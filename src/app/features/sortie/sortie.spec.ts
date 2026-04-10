import { TestBed, ComponentFixture } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { SortieComponent } from './sortie';
import { ThemeService } from '../../services/theme.service';
import { Emotion } from '../../models/emotion.model';

const mockEmotion: Emotion = {
  id: 'colere', name: 'La colère', family: 'colere',
  valence: 'negative', type: 'simple', gender: 'f', contentFile: 'colere.md',
};

function createActivatedRoute(emotionId: string) {
  return { paramMap: of(convertToParamMap({ emotionId })) };
}

describe('SortieComponent', () => {
  let fixture: ComponentFixture<SortieComponent>;
  let component: SortieComponent;
  let router: Router;
  let httpMock: HttpTestingController;

  async function setup(emotionId: string, emotions = [mockEmotion]) {
    await TestBed.configureTestingModule({
      imports: [SortieComponent],
      providers: [
        provideRouter([
          { path: '', children: [] },
        ]),
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ActivatedRoute, useValue: createActivatedRoute(emotionId) },
      ],
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(SortieComponent);
    component = fixture.componentInstance;
    httpMock.expectOne('/data/emotions.json').flush(emotions);
    fixture.detectChanges();
  }

  afterEach(() => {
    httpMock?.match(() => true).forEach((r) => !r.cancelled && r.flush(''));
    httpMock?.verify();
    TestBed.resetTestingModule();
    document.body.className = '';
  });

  it('should create', async () => {
    await setup('colere');
    expect(component).toBeTruthy();
  });

  it('should start in initial state', async () => {
    await setup('colere');
    expect(component.state()).toBe('initial');
  });

  it('should show emotion name', async () => {
    await setup('colere');
    const nom = fixture.nativeElement.querySelector('.sortie__emotion-nom');
    expect(nom?.textContent?.trim()).toBe('La colère');
  });

  it('should show initial message', async () => {
    await setup('colere');
    const msg = fixture.nativeElement.querySelector('.sortie__message');
    expect(msg?.textContent).toContain('Prenez soin de vous');
  });

  it('should show Merci and Pas vraiment buttons in initial state', async () => {
    await setup('colere');
    const merci = fixture.nativeElement.querySelector('.sortie__btn--merci');
    const pasVraiment = fixture.nativeElement.querySelector('.sortie__btn--pas-vraiment');
    expect(merci).toBeTruthy();
    expect(pasVraiment).toBeTruthy();
  });

  it('onMerci() sets state to merci', async () => {
    await setup('colere');
    component.onMerci();
    fixture.detectChanges();
    expect(component.state()).toBe('merci');
  });

  it('onPasVraiment() sets state to pas-vraiment', async () => {
    await setup('colere');
    component.onPasVraiment();
    fixture.detectChanges();
    expect(component.state()).toBe('pas-vraiment');
  });

  it('merci state shows positive message and Recommencer', async () => {
    await setup('colere');
    component.onMerci();
    fixture.detectChanges();
    const msg = fixture.nativeElement.querySelector('.sortie__message');
    expect(msg?.textContent).toContain('Continuez à vous écouter');
    const btn = fixture.nativeElement.querySelector('.sortie__btn--recommencer');
    expect(btn).toBeTruthy();
  });

  it('pas-vraiment state shows humble message and Recommencer', async () => {
    await setup('colere');
    component.onPasVraiment();
    fixture.detectChanges();
    const msg = fixture.nativeElement.querySelector('.sortie__message');
    expect(msg?.textContent).toContain("Ce n'est pas grave");
    const btn = fixture.nativeElement.querySelector('.sortie__btn--recommencer');
    expect(btn).toBeTruthy();
  });

  it('recommencer() navigates to /', async () => {
    await setup('colere');
    const spy = vi.spyOn(router, 'navigate');
    component.recommencer();
    expect(spy).toHaveBeenCalledWith(['/']);
  });

  it('recommencer() resets theme', async () => {
    await setup('colere');
    const themeService = TestBed.inject(ThemeService);
    const spy = vi.spyOn(themeService, 'resetFamily');
    component.recommencer();
    expect(spy).toHaveBeenCalled();
  });

  it('shows filet de sécurité with tel: links', async () => {
    await setup('colere');
    const filet = fixture.nativeElement.querySelector('.sortie__filet');
    expect(filet).toBeTruthy();
    const links = filet.querySelectorAll('a[href^="tel:"]');
    expect(links.length).toBe(2);
  });

  it('filet links include 3114 and SOS Amitié number', async () => {
    await setup('colere');
    const links = fixture.nativeElement.querySelectorAll('.sortie__filet-lien');
    const hrefs = Array.from(links).map((l: any) => l.getAttribute('href'));
    expect(hrefs).toContain('tel:3114');
    expect(hrefs).toContain('tel:0972394050');
  });

  it('applies theme on init', async () => {
    const spy = vi.spyOn(ThemeService.prototype, 'applyFamily');
    await setup('colere');
    expect(spy).toHaveBeenCalledWith('colere');
    spy.mockRestore();
  });
});
