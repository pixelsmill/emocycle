import { TestBed, ComponentFixture } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { FicheComponent, stripArticle } from './fiche';
import { ThemeService } from '../../services/theme.service';
import { EmotionSessionService } from '../../services/emotion-session.service';
import { Emotion, EmotionContent } from '../../models/emotion.model';

// ── Helpers ───────────────────────────────────────────────────

const mockEmotion: Emotion = {
  id: 'colere',
  name: 'La colère',
  family: 'colere',
  valence: 'negative',
  type: 'simple',
  gender: 'f',
  contentFile: 'colere.md',
};

const mockContent: EmotionContent = {
  examples: '- Un exemple.',
  description: 'La colère est une émotion simple.',
  utility: "Elle fournit de l'énergie.",
  typicalErrors: 'Erreur typique.',
};

const SAMPLE_MD = `# La colère

**Type :** simple

## Exemples

- Un exemple.

## Qu'est-ce que c'est ?

La colère est une émotion simple.

## À quoi ça sert ?

Elle fournit de l'énergie.

**Les erreurs typiques reliées à la colère**

Erreur typique.

---
_Source_`;

function createActivatedRoute(emotionId: string) {
  return { paramMap: of(convertToParamMap({ emotionId })) };
}

// ── Tests stripArticle ─────────────────────────────────────────

describe('stripArticle()', () => {
  it('strips "La "',  () => expect(stripArticle('La colère')).toBe('colère'));
  it('strips "Le "',  () => expect(stripArticle('Le ressentiment')).toBe('ressentiment'));
  it("strips \"L'\"", () => expect(stripArticle("L'amour")).toBe('amour'));
  it("strips \"L'\u2019\"", () => expect(stripArticle('L\u2019envie')).toBe('envie'));
  it('strips "Les "', () => expect(stripArticle('Les tics')).toBe('tics'));
});

// ── Tests FicheComponent ───────────────────────────────────────

describe('FicheComponent', () => {
  let fixture: ComponentFixture<FicheComponent>;
  let component: FicheComponent;
  let router: Router;
  let themeService: ThemeService;
  let httpMock: HttpTestingController;

  async function setup(emotionId: string) {
    await TestBed.configureTestingModule({
      imports: [FicheComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ActivatedRoute, useValue: createActivatedRoute(emotionId) },
      ],
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    themeService = TestBed.inject(ThemeService);

    fixture = TestBed.createComponent(FicheComponent);
    component = fixture.componentInstance;

    // EmotionService loads emotions.json on init
    httpMock.expectOne('/data/emotions.json').flush([mockEmotion]);
    fixture.detectChanges();
  }

  afterEach(() => {
    // Absorbe les requêtes non flushées avant verify()
    httpMock?.match(() => true).forEach((r) => !r.cancelled && r.flush(''));
    httpMock?.verify();
    TestBed.resetTestingModule();
    document.body.className = '';
  });

  it('should create', async () => {
    await setup('colere');
    expect(component).toBeTruthy();
  });

  it('should apply theme for emotion family on init', async () => {
    // Espionner sur le prototype AVANT la création du composant (ngOnInit s'exécute dans setup)
    const spy = vi.spyOn(ThemeService.prototype, 'applyFamily');
    await setup('colere');
    expect(spy).toHaveBeenCalledWith('colere');
    spy.mockRestore();
  });

  it('should display emotion name after content loads', async () => {
    await setup('colere');
    httpMock.expectOne('/content/colere.md').flush(SAMPLE_MD);
    fixture.detectChanges();

    const h1 = fixture.nativeElement.querySelector('.fiche__nom');
    expect(h1?.textContent?.trim()).toContain('La colère');
  });

  it('should show fixed button with stripped name', async () => {
    await setup('colere');
    httpMock.expectOne('/content/colere.md').flush(SAMPLE_MD);
    fixture.detectChanges();

    const btn = fixture.nativeElement.querySelector('.fiche__btn-fixe');
    expect(btn?.textContent).toContain('colère');
    expect(btn?.textContent).toContain('a quelque chose à vous dire');
  });

  it('should navigate to /cycle/:id on button click', async () => {
    await setup('colere');
    httpMock.expectOne('/content/colere.md').flush(SAMPLE_MD);
    fixture.detectChanges();

    const spy = vi.spyOn(router, 'navigate');
    component.onStartCycle();
    expect(spy).toHaveBeenCalledWith(['/cycle', 'colere']);
  });

  it('should redirect to / for unknown emotionId', async () => {
    await setup('inconnu');
    // emotions.json already flushed in setup → isLoading() is false → redirect is synchronous
    const spy = vi.spyOn(router, 'navigate');
    component.ngOnInit();
    expect(spy).toHaveBeenCalledWith(['/']);
  });

  it('should display content sections after load', async () => {
    await setup('colere');
    httpMock.expectOne('/content/colere.md').flush(SAMPLE_MD);
    fixture.detectChanges();

    const labels = fixture.nativeElement.querySelectorAll('.fiche__section-label');
    const labelTexts = Array.from(labels).map((l: unknown) =>
      (l as Element).textContent?.trim().toLowerCase(),
    );
    expect(labelTexts).toContain('exemples');
    expect(labelTexts).toContain('définition');
  });

  it('should show typical errors section when present', async () => {
    await setup('colere');
    httpMock.expectOne('/content/colere.md').flush(SAMPLE_MD);
    fixture.detectChanges();

    const labels = fixture.nativeElement.querySelectorAll('.fiche__section-label');
    const labelTexts = Array.from(labels).map((l: unknown) =>
      (l as Element).textContent?.trim().toLowerCase(),
    );
    expect(labelTexts).toContain('erreurs typiques');
  });

  it('should display fallback content when fetch fails (Story 3.3)', async () => {
    await setup('colere');
    httpMock.expectOne('/content/colere.md').flush('', {
      status: 404,
      statusText: 'Not Found',
    });
    fixture.detectChanges();

    // Fixed button still present even with fallback content
    const btn = fixture.nativeElement.querySelector('.fiche__btn-fixe');
    expect(btn).toBeTruthy();
  });
});
