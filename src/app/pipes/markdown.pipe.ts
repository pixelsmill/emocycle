import { Pipe, PipeTransform, inject } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { parse } from 'marked';

/**
 * Transforme du texte markdown en HTML sécurisé.
 * Le contenu provient exclusivement de nos fichiers Larivey locaux (source maîtrisée).
 * Nom du pipe : fiche_md (utilisé dans les templates de fiche).
 */
@Pipe({ name: 'fiche_md' })
export class MarkdownPipe implements PipeTransform {
  private readonly sanitizer = inject(DomSanitizer);

  transform(value: string | null | undefined): SafeHtml {
    if (!value) return '';
    const html = parse(value) as string;
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
}
