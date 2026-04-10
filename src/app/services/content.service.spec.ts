import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { ContentService } from './content.service';

const SAMPLE_MARKDOWN = `# La colère

**Type :** simple

## Exemples

- Un exemple de colère.

## Qu'est-ce que c'est ?

La colère est une émotion simple.

**Les erreurs typiques reliées à la colère**

Erreur typique.

## À quoi ça sert ?

La colère fournit de l'énergie.

---
_Source_`;

describe('ContentService', () => {
  let service: ContentService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    httpMock = TestBed.inject(HttpTestingController);
    service = TestBed.inject(ContentService);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should parse and return content from markdown', () => {
    let result: unknown;
    service.loadContent('colere').subscribe((c) => (result = c));

    httpMock.expectOne('/content/colere.md').flush(SAMPLE_MARKDOWN);

    expect((result as { examples: string }).examples).toContain('Un exemple');
    expect((result as { description: string }).description).toContain('émotion simple');
    expect((result as { utility: string }).utility).toContain("fournit de l'énergie");
    expect((result as { typicalErrors: string }).typicalErrors).toContain('Erreur typique');
  });

  it('should return fallback content when fetch fails', () => {
    let result: unknown;
    service.loadContent('inconnu').subscribe((c) => (result = c));

    httpMock.expectOne('/content/inconnu.md').flush('', {
      status: 404,
      statusText: 'Not Found',
    });

    expect((result as { description: string }).description).toBeTruthy();
    expect((result as { examples: unknown }).examples).toBeNull();
  });
});
