import { TestBed, ComponentFixture } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ListeComponent } from './liste';
import { ThemeService } from '../../services/theme.service';
import { EmotionSessionService } from '../../services/emotion-session.service';
import { Emotion } from '../../models/emotion.model';

const mockEmotions: Emotion[] = [
  { id: 'colere',      name: 'La colère',      family: 'colere', valence: 'negative', type: 'simple', gender: 'f', contentFile: 'colere.md' },
  { id: 'haine',       name: 'La haine',       family: 'colere', valence: 'negative', type: 'simple', gender: 'f', contentFile: 'haine.md' },
  { id: 'rage',        name: 'La rage',        family: 'colere', valence: 'negative', type: 'simple', gender: 'f', contentFile: 'rage.md' },
  { id: 'frustration', name: 'La frustration', family: 'colere', valence: 'negative', type: 'pseudo', gender: 'f', contentFile: 'frustration.md' },
];

function createActivatedRoute(familleId: string) {
  return {
    paramMap: of(convertToParamMap({ familleId })),
  };
}

describe('ListeComponent', () => {
  let fixture: ComponentFixture<ListeComponent>;
  let component: ListeComponent;
  let router: Router;
  let themeService: ThemeService;
  let sessionService: EmotionSessionService;
  let httpMock: HttpTestingController;

  async function setup(familleId: string) {
    await TestBed.configureTestingModule({
      imports: [ListeComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ActivatedRoute, useValue: createActivatedRoute(familleId) },
      ],
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    themeService = TestBed.inject(ThemeService);
    sessionService = TestBed.inject(EmotionSessionService);

    fixture = TestBed.createComponent(ListeComponent);
    component = fixture.componentInstance;

    // Satisfy initial EmotionService HTTP call
    httpMock.expectOne('/data/emotions.json').flush(mockEmotions);
    fixture.detectChanges();
  }

  afterEach(() => {
    httpMock?.verify();
    TestBed.resetTestingModule();
    document.body.className = '';
  });

  it('should create', async () => {
    await setup('colere');
    expect(component).toBeTruthy();
  });

  it('should display family label "Colères"', async () => {
    await setup('colere');
    const h1 = fixture.nativeElement.querySelector('h1');
    expect(h1?.textContent?.trim()).toBe('Colères');
  });

  it('should list all emotions of the family (simple + complex)', async () => {
    await setup('colere');
    const items = fixture.nativeElement.querySelectorAll('.liste__item');
    expect(items.length).toBe(4);
  });

  it('should expose the emotion type via the native title attribute', async () => {
    await setup('colere');
    const items = Array.from(
      fixture.nativeElement.querySelectorAll('.liste__item'),
    ) as HTMLElement[];

    const frustrationBtn = items.find(
      (el) => el.textContent?.trim() === 'La frustration',
    );
    const colereBtn = items.find(
      (el) => el.textContent?.trim() === 'La colère',
    );

    expect(frustrationBtn?.getAttribute('title')).toBe('Pseudo-émotion');
    expect(colereBtn?.getAttribute('title')).toBe('Émotion simple');
  });

  it('should call ThemeService.applyFamily on init', async () => {
    const spy = vi.spyOn(ThemeService.prototype, 'applyFamily');
    await setup('colere');
    expect(spy).toHaveBeenCalledWith('colere');
  });

  it('should redirect to / for unknown familleId', async () => {
    await setup('inconnu');
    const spy = vi.spyOn(router, 'navigate');
    // Trigger ngOnInit re-evaluation by resetting
    component.ngOnInit();
    expect(spy).toHaveBeenCalledWith(['/']);
  });

  it('should call session.select and navigate on onEmotionSelect()', async () => {
    await setup('colere');
    const sessionSpy = vi.spyOn(sessionService, 'select');
    const routerSpy = vi.spyOn(router, 'navigate');

    component.onEmotionSelect(mockEmotions[0]);

    expect(sessionSpy).toHaveBeenCalledWith(mockEmotions[0]);
    expect(routerSpy).toHaveBeenCalledWith(['/emotion', 'colere']);
  });
});
