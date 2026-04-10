import { Injectable } from '@angular/core';
import { EmotionContent } from '../models/emotion.model';

@Injectable({ providedIn: 'root' })
export class MarkdownParserService {
  /**
   * Extrait les sections structurées d'un fichier markdown Larivey.
   * Sections attendues : Exemples, Qu'est-ce que c'est ?, À quoi ça sert ?
   * + erreurs typiques (détectées dans le corps de la définition/utilité)
   */
  parse(markdown: string): EmotionContent {
    const examples = this.extractSection(markdown, ['## Exemples']);
    const description = this.extractSection(markdown, ["## Qu'est-ce que c'est ?"]);
    const utility = this.extractSection(markdown, ['## À quoi ça sert ?']);
    const typicalErrors = this.extractTypicalErrors(markdown);

    return { examples, description, utility, typicalErrors };
  }

  private extractSection(markdown: string, headings: string[]): string | null {
    for (const heading of headings) {
      const escapedHeading = heading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      // [^\n]* : ne consomme que la fin de la ligne du titre (pas les lignes suivantes)
      const regex = new RegExp(
        `${escapedHeading}[^\\n]*\\n([\\s\\S]*?)(?=\\n##[\\s#]|\\n---\\s*$|$)`,
      );
      const match = markdown.match(regex);
      if (match) {
        const text = match[1].trim();
        return text.length > 0 ? text : null;
      }
    }
    return null;
  }

  private extractTypicalErrors(markdown: string): string | null {
    // Les erreurs typiques sont signalées par un titre gras en cours de section
    const match = markdown.match(
      /\*\*Les erreurs typiques[^*]*\*\*([\s\S]*?)(?=\n##\s|\n---\s*$|$)/i,
    );
    if (!match) return null;
    const text = match[1].trim();
    return text.length > 0 ? text : null;
  }
}
