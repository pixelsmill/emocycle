import { TestBed } from '@angular/core/testing';
import { MarkdownParserService } from './markdown-parser.service';

describe('MarkdownParserService', () => {
  let service: MarkdownParserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MarkdownParserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should extract all four sections from a complete markdown', () => {
    const markdown = `# La colère

**Type :** simple

## Exemples

- Exemple de colère.

## Qu'est-ce que c'est ?

La colère est une émotion simple.

**Les erreurs typiques reliées à la colère**

Erreur #1: dévier.

## À quoi ça sert ?

La colère fournit de l'énergie.

---
_Source_`;

    const result = service.parse(markdown);

    expect(result.examples).toContain('Exemple de colère');
    expect(result.description).toContain('émotion simple');
    expect(result.utility).toContain("fournit de l'énergie");
    expect(result.typicalErrors).toContain('Erreur #1');
  });

  it('should return null for missing sections', () => {
    const markdown = `# La tristesse\n\n**Type :** simple\n\n## Exemples\n\nUn exemple.\n\n---`;

    const result = service.parse(markdown);

    expect(result.examples).toBeTruthy();
    expect(result.description).toBeNull();
    expect(result.utility).toBeNull();
    expect(result.typicalErrors).toBeNull();
  });

  it('should return null for empty section content', () => {
    const markdown = `# Test\n\n## Exemples\n\n## Qu'est-ce que c'est ?\n\nDu contenu.\n\n---`;

    const result = service.parse(markdown);

    expect(result.examples).toBeNull();
    expect(result.description).toBeTruthy();
  });
});
