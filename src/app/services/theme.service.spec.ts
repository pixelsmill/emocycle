import { TestBed } from '@angular/core/testing';
import { DOCUMENT } from '@angular/common';
import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  let service: ThemeService;
  let document: Document;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThemeService);
    document = TestBed.inject(DOCUMENT);
    // Nettoie le body avant chaque test
    document.body.className = '';
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add the correct bg class on applyFamily()', () => {
    service.applyFamily('colere');
    expect(document.body.classList.contains('bg-colere')).toBe(true);
  });

  it('should remove other family classes when switching family', () => {
    service.applyFamily('joie');
    service.applyFamily('tristesse');

    expect(document.body.classList.contains('bg-joie')).toBe(false);
    expect(document.body.classList.contains('bg-tristesse')).toBe(true);
  });

  it('should remove all family classes on resetFamily()', () => {
    service.applyFamily('peur');
    service.resetFamily();

    expect(document.body.className).toBe('');
  });
});
