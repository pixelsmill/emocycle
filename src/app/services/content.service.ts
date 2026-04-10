import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import { EmotionContent } from '../models/emotion.model';
import { MarkdownParserService } from './markdown-parser.service';

const FALLBACK_CONTENT: EmotionContent = {
  examples: null,
  description:
    "Cette émotion fait partie de votre expérience intérieure. Elle mérite d'être accueillie avec bienveillance.",
  utility:
    "Chaque émotion porte un message sur ce qui compte pour vous. Prenez le temps de l'écouter.",
  typicalErrors: null,
};

@Injectable({ providedIn: 'root' })
export class ContentService {
  private readonly http = inject(HttpClient);
  private readonly parser = inject(MarkdownParserService);

  loadContent(id: string): Observable<EmotionContent> {
    return new Observable<EmotionContent>((observer) => {
      this.http
        .get(`/content/${id}.md`, { responseType: 'text' })
        .pipe(
          catchError((err) => {
            console.error(
              `ContentService: impossible de charger /content/${id}.md`,
              err,
            );
            return of(null);
          }),
        )
        .subscribe((raw) => {
          if (raw === null) {
            observer.next(FALLBACK_CONTENT);
          } else {
            const parsed = this.parser.parse(raw);
            const content: EmotionContent = {
              examples: parsed.examples ?? FALLBACK_CONTENT.examples,
              description: parsed.description ?? FALLBACK_CONTENT.description,
              utility: parsed.utility ?? FALLBACK_CONTENT.utility,
              typicalErrors: parsed.typicalErrors ?? null,
            };
            observer.next(content);
          }
          observer.complete();
        });
    });
  }
}
