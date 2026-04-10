import { TestBed, ComponentFixture } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { CreditsComponent } from './credits';
import { ThemeService } from '../../services/theme.service';

describe('CreditsComponent', () => {
  let fixture: ComponentFixture<CreditsComponent>;
  let component: CreditsComponent;

  async function setup() {
    await TestBed.configureTestingModule({
      imports: [CreditsComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(CreditsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  afterEach(() => {
    TestBed.resetTestingModule();
    document.body.className = '';
  });

  it('should create', async () => {
    await setup();
    expect(component).toBeTruthy();
  });

  it('resets theme on init', async () => {
    const spy = vi.spyOn(ThemeService.prototype, 'resetFamily');
    await setup();
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  it('shows page title "Crédits"', async () => {
    await setup();
    const h1 = fixture.nativeElement.querySelector('h1');
    expect(h1?.textContent?.trim()).toBe('Crédits');
  });

  it('shows back link to accueil', async () => {
    await setup();
    const retour = fixture.nativeElement.querySelector('.credits__retour');
    expect(retour).toBeTruthy();
    expect(retour.getAttribute('href')).toBe('/');
  });

  it('mentions Larivey and Garneau', async () => {
    await setup();
    const content = fixture.nativeElement.textContent;
    expect(content).toContain('Larivey');
    expect(content).toContain('Garneau');
  });

  it('mentions redpsy.com', async () => {
    await setup();
    const content = fixture.nativeElement.textContent;
    expect(content).toContain('redpsy.com');
  });

  it('has a mailto contact link', async () => {
    await setup();
    const mailLink = fixture.nativeElement.querySelector('a[href^="mailto:"]');
    expect(mailLink).toBeTruthy();
  });

  it('has 3 sections: Sources, Intention, Contact', async () => {
    await setup();
    const headings = fixture.nativeElement.querySelectorAll('h2');
    const texts = Array.from(headings).map((h: any) => h.textContent?.trim());
    expect(texts).toContain('Sources');
    expect(texts).toContain('Intention');
    expect(texts).toContain('Contact');
  });
});
