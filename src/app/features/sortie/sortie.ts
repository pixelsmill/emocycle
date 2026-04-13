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
import { EmotionContent } from '../../models/emotion.model';
import { EmotionService } from '../../services/emotion.service';
import { ContentService } from '../../services/content.service';
import { ThemeService } from '../../services/theme.service';
import { MarkdownPipe } from '../../pipes/markdown.pipe';
import { TablerIconComponent } from '@tabler/icons-angular';

type SortieState = 'initial' | 'merci' | 'pas-vraiment';

@Component({
  selector: 'app-sortie',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MarkdownPipe, TablerIconComponent],
  host: { class: 'sortie-host' },
  templateUrl: './sortie.html',
  styleUrl: './sortie.scss',
})
export class SortieComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly emotionService = inject(EmotionService);
  private readonly contentService = inject(ContentService);
  private readonly theme = inject(ThemeService);

  private readonly emotionId = toSignal(
    this.route.paramMap.pipe(map((p) => p.get('emotionId') ?? '')),
    { initialValue: '' },
  );

  readonly emotion = computed(() => this.emotionService.getById(this.emotionId()));

  readonly state = signal<SortieState>('initial');

  // ── Modale fiche ─────────────────────────────────────────────
  readonly ficheModalOpen = signal(false);
  readonly ficheContent = signal<EmotionContent | null>(null);
  readonly ficheLoading = signal(false);

  ngOnInit(): void {
    const id = this.emotionId();
    const emotion = this.emotionService.getById(id);

    if (!emotion && !this.emotionService.isLoading()) {
      this.router.navigate(['/']);
      return;
    }

    if (emotion) {
      this.theme.applyFamily(emotion.family);
    } else {
      setTimeout(() => {
        const e = this.emotionService.getById(id);
        if (!e) { this.router.navigate(['/']); return; }
        this.theme.applyFamily(e.family);
      }, 0);
    }
  }

  onMerci(): void {
    this.state.set('merci');
  }

  onPasVraiment(): void {
    this.state.set('pas-vraiment');
  }

  recommencer(): void {
    this.theme.resetFamily();
    this.router.navigate(['/']);
  }

  // ── Fiche modale ─────────────────────────────────────────────

  openFiche(): void {
    this.ficheModalOpen.set(true);
    if (!this.ficheContent() && !this.ficheLoading()) {
      this.ficheLoading.set(true);
      this.contentService.loadContent(this.emotionId()).subscribe((c) => {
        this.ficheContent.set(c);
        this.ficheLoading.set(false);
      });
    }
  }

  closeFiche(): void {
    this.ficheModalOpen.set(false);
  }

  onFicheKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') this.closeFiche();
  }

  /** Nom de l'émotion avec 1ʳᵉ lettre en minuscule (FR). */
  readonly emotionNameLc = computed(() => {
    const n = this.emotion()?.name ?? '';
    return n ? n.charAt(0).toLocaleLowerCase('fr') + n.slice(1) : '';
  });
}
