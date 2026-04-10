import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { Emotion, EmotionContent } from '../../models/emotion.model';
import { ContentService } from '../../services/content.service';
import { EmotionService } from '../../services/emotion.service';
import { ThemeService } from '../../services/theme.service';
import { MarkdownPipe } from '../../pipes/markdown.pipe';

/** Retire l'article défini français du nom de l'émotion.
 *  "La colère" → "colère", "L'amour" → "amour", "Le désir" → "désir"
 */
export function stripArticle(name: string): string {
  return name
    .replace(/^(La |Le |Les |L['\u2019])/i, '')
    .trim();
}

@Component({
  selector: 'app-fiche',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MarkdownPipe],
  templateUrl: './fiche.html',
  styleUrl: './fiche.scss',
  host: { class: 'fiche-host' },
})
export class FicheComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly emotionService = inject(EmotionService);
  private readonly contentService = inject(ContentService);
  private readonly theme = inject(ThemeService);

  private readonly emotionId = toSignal(
    this.route.paramMap.pipe(map((p) => p.get('emotionId') ?? '')),
    { initialValue: '' },
  );

  readonly emotion = computed<Emotion | null>(() =>
    this.emotionService.getById(this.emotionId()),
  );

  readonly content = signal<EmotionContent | null>(null);
  readonly isLoading = signal(true);

  /** Nom sans article pour le bouton fixe : "Votre colère a quelque chose…" */
  readonly nomSansArticle = computed(() => {
    const e = this.emotion();
    return e ? stripArticle(e.name) : '';
  });

  ngOnInit(): void {
    const id = this.emotionId();
    const emotion = this.emotionService.getById(id);

    if (!emotion) {
      // Attendre que les émotions soient chargées si le service charge encore
      if (!this.emotionService.isLoading()) {
        this.router.navigate(['/']);
        return;
      }
      // Réessayer après le chargement
      const sub = this.emotionService.emotions;
      const check = () => {
        const e = this.emotionService.getById(id);
        if (!e) {
          this.router.navigate(['/']);
          return;
        }
        this.theme.applyFamily(e.family);
        this.loadContent(id);
      };
      // Vitest-safe: juste appeler check après le prochain tick
      setTimeout(check, 0);
      return;
    }

    this.theme.applyFamily(emotion.family);
    this.loadContent(id);
  }

  private loadContent(id: string): void {
    this.isLoading.set(true);
    this.contentService.loadContent(id).subscribe((c) => {
      this.content.set(c);
      this.isLoading.set(false);
    });
  }

  onStartCycle(): void {
    const id = this.emotionId();
    this.router.navigate(['/cycle', id]);
  }

  goBack(): void {
    const family = this.emotion()?.family;
    if (family) {
      this.router.navigate(['/famille', family]);
    } else {
      this.router.navigate(['/']);
    }
  }
}
