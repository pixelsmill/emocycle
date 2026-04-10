import { TestBed, ComponentFixture } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { CycleComponent } from './cycle';
import { ThemeService } from '../../services/theme.service';
import { Emotion } from '../../models/emotion.model';

const mockEmotion: Emotion = {
  id: 'colere', name: 'La colère', family: 'colere',
  valence: 'negative', type: 'simple', gender: 'f', contentFile: 'colere.md',
};

function createActivatedRoute(emotionId: string) {
  return { paramMap: of(convertToParamMap({ emotionId })) };
}

describe('CycleComponent', () => {
  let fixture: ComponentFixture<CycleComponent>;
  let component: CycleComponent;
  let router: Router;
  let httpMock: HttpTestingController;

  async function setup(emotionId: string, emotions = [mockEmotion]) {
    await TestBed.configureTestingModule({
      imports: [CycleComponent],
      providers: [
        provideRouter([
          { path: 'emotion/:id', children: [] },
          { path: 'sortie/:id', children: [] },
        ]),
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ActivatedRoute, useValue: createActivatedRoute(emotionId) },
      ],
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(CycleComponent);
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

  it('should start at step 0', async () => {
    await setup('colere');
    expect(component.currentIndex()).toBe(0);
  });

  it('should show 5 slides', async () => {
    await setup('colere');
    const slides = fixture.nativeElement.querySelectorAll('.cycle__slide');
    expect(slides.length).toBe(5);
  });

  it('should show 5 pagination dots', async () => {
    await setup('colere');
    const dots = fixture.nativeElement.querySelectorAll('.cycle__dot');
    expect(dots.length).toBe(5);
  });

  it('first dot should be active', async () => {
    await setup('colere');
    const activeDot = fixture.nativeElement.querySelector('.cycle__dot--active');
    expect(activeDot).toBeTruthy();
    const dots = fixture.nativeElement.querySelectorAll('.cycle__dot');
    expect(dots[0].classList.contains('cycle__dot--active')).toBe(true);
  });

  it('goNext() increments currentIndex', async () => {
    await setup('colere');
    component.goNext();
    expect(component.currentIndex()).toBe(1);
  });

  it('goPrev() at step 0 navigates to /emotion/:id', async () => {
    await setup('colere');
    const spy = vi.spyOn(router, 'navigate');
    component.goPrev();
    expect(spy).toHaveBeenCalledWith(['/emotion', 'colere']);
  });

  it('goNext() at last step navigates to /sortie/:id', async () => {
    await setup('colere');
    const spy = vi.spyOn(router, 'navigate');
    component.currentIndex.set(4);
    component.goNext();
    expect(spy).toHaveBeenCalledWith(['/sortie', 'colere']);
  });

  it('shows "Terminer" button at last step', async () => {
    await setup('colere');
    component.currentIndex.set(4);
    fixture.detectChanges();
    const nextBtn = fixture.nativeElement.querySelector('.cycle__btn--next');
    expect(nextBtn?.textContent?.trim()).toContain('Terminer');
  });

  it('shows "← Fiche" at first step', async () => {
    await setup('colere');
    fixture.detectChanges();
    const prevBtn = fixture.nativeElement.querySelector('.cycle__btn--prev');
    expect(prevBtn?.textContent).toContain('Fiche');
  });

  it('interpolates emotion name into step question', async () => {
    await setup('colere');
    const step = component.steps()[2]; // Reconnaissance
    expect(step.question).toContain('la colère');
  });

  it('uses negative templates for negative valence', async () => {
    await setup('colere');
    const step = component.steps()[2]; // Reconnaissance
    expect(step.question).toContain('besoin');
  });

  it('applies theme on init', async () => {
    const spy = vi.spyOn(ThemeService.prototype, 'applyFamily');
    await setup('colere');
    expect(spy).toHaveBeenCalledWith('colere');
    spy.mockRestore();
  });

  it('swipe left calls goNext()', async () => {
    await setup('colere');
    const spy = vi.spyOn(component, 'goNext');
    component.onTouchStart({ touches: [{ clientX: 300 }] } as unknown as TouchEvent);
    component.onTouchEnd({ changedTouches: [{ clientX: 200 }] } as unknown as TouchEvent);
    expect(spy).toHaveBeenCalled();
  });

  it('swipe right calls goPrev()', async () => {
    await setup('colere');
    const spy = vi.spyOn(component, 'goPrev');
    component.onTouchStart({ touches: [{ clientX: 200 }] } as unknown as TouchEvent);
    component.onTouchEnd({ changedTouches: [{ clientX: 300 }] } as unknown as TouchEvent);
    expect(spy).toHaveBeenCalled();
  });
});
