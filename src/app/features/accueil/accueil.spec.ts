import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { provideRouter } from '@angular/router';
import { ComponentFixture } from '@angular/core/testing';
import { AccueilComponent } from './accueil';
import { ThemeService } from '../../services/theme.service';
import { EmotionSessionService } from '../../services/emotion-session.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('AccueilComponent', () => {
  let fixture: ComponentFixture<AccueilComponent>;
  let component: AccueilComponent;
  let router: Router;
  let themeService: ThemeService;
  let sessionService: EmotionSessionService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccueilComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AccueilComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    themeService = TestBed.inject(ThemeService);
    sessionService = TestBed.inject(EmotionSessionService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render 6 famille buttons', () => {
    const buttons = fixture.nativeElement.querySelectorAll('.accueil__rond');
    expect(buttons.length).toBe(6);
  });

  it('should render title "Émocycle"', () => {
    const h1 = fixture.nativeElement.querySelector('h1');
    expect(h1?.textContent?.trim()).toBe('Émocycle');
  });

  it('each button should have an aria-label', () => {
    const buttons = fixture.nativeElement.querySelectorAll('.accueil__rond');
    buttons.forEach((btn: Element) => {
      expect(btn.getAttribute('aria-label')).toBeTruthy();
    });
  });

  it('should call ThemeService, SessionService and navigate on onFamilleSelect()', () => {
    const themeSpy = vi.spyOn(themeService, 'applyFamily');
    const sessionSpy = vi.spyOn(sessionService, 'selectFamily');
    const routerSpy = vi.spyOn(router, 'navigate');

    component.onFamilleSelect({ id: 'joie', label: 'Joies', ariaLabel: 'test' });

    expect(themeSpy).toHaveBeenCalledWith('joie');
    expect(sessionSpy).toHaveBeenCalledWith('joie');
    expect(routerSpy).toHaveBeenCalledWith(['/famille', 'joie']);
  });

  it('should display both baseline lines', () => {
    const lines = fixture.nativeElement.querySelectorAll('.accueil__baseline-line');
    expect(lines.length).toBe(2);
    expect(lines[0].textContent).toContain("L'émotion que vous vivez");
    expect(lines[1].textContent).toContain('a un message.');
  });
});
