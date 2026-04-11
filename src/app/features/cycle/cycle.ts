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
import { EmotionService } from '../../services/emotion.service';
import { ContentService } from '../../services/content.service';
import { ThemeService } from '../../services/theme.service';
import { CycleSessionService } from '../../services/cycle-session.service';
import { CYCLE_TEMPLATES, CycleStep, interpolate } from '../../data/cycle-templates';
import { MarkdownPipe } from '../../pipes/markdown.pipe';
import { TablerIconComponent } from '@tabler/icons-angular';

const SWIPE_THRESHOLD = 50;
const TOTAL_STEPS = 5;

@Component({
  selector: 'app-cycle',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MarkdownPipe, TablerIconComponent],
  templateUrl: './cycle.html',
  styleUrl: './cycle.scss',
  host: { class: 'cycle-host' },
})
export class CycleComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly emotionService = inject(EmotionService);
  private readonly contentService = inject(ContentService);
  private readonly theme = inject(ThemeService);
  private readonly cycleSession = inject(CycleSessionService);

  private readonly emotionId = toSignal(
    this.route.paramMap.pipe(map((p) => p.get('emotionId') ?? '')),
    { initialValue: '' },
  );

  readonly emotion = computed<Emotion | null>(() =>
    this.emotionService.getById(this.emotionId()),
  );

  readonly currentIndex = signal(0);

  readonly steps = computed<CycleStep[]>(() => {
    const e = this.emotion();
    if (!e) return CYCLE_TEMPLATES['negative'];
    return CYCLE_TEMPLATES[e.valence].map((step) => ({
      name: step.name,
      question: interpolate(step.question, e),
      guide: interpolate(step.guide, e),
    }));
  });

  readonly currentStep = computed(() => this.steps()[this.currentIndex()]);
  readonly isFirst = computed(() => this.currentIndex() === 0);
  readonly isLast = computed(() => this.currentIndex() === TOTAL_STEPS - 1);

  readonly slideTransform = computed(
    () => `translateX(-${this.currentIndex() * 100}%)`,
  );

  // ── Modale fiche ─────────────────────────────────────────────
  readonly ficheModalOpen = signal(false);

  // ── Modale cycle-info ─────────────────────────────────────────
  readonly cycleInfoModalOpen = signal(false);
  readonly ficheContent = signal<EmotionContent | null>(null);
  readonly ficheLoading = signal(false);

  // ── Disclaimer première visite ────────────────────────────────
  readonly showDisclaimer = signal(this.cycleSession.shouldShowDisclaimer);

  // ── Swipe touch ──────────────────────────────────────────────
  private touchStartX = 0;

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

  goNext(): void {
    if (this.isLast()) {
      this.router.navigate(['/sortie', this.emotionId()]);
    } else {
      this.currentIndex.update((i) => i + 1);
    }
  }

  goPrev(): void {
    if (this.isFirst()) {
      const family = this.emotion()?.family;
      this.router.navigate(family ? ['/famille', family] : ['/']);
    } else {
      this.currentIndex.update((i) => i - 1);
    }
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

  // ── Disclaimer ───────────────────────────────────────────────

  dismissDisclaimer(discover: boolean): void {
    this.cycleSession.markDisclaimerShown();
    this.showDisclaimer.set(false);
    if (discover) {
      this.cycleInfoModalOpen.set(true);
    }
  }

  onDisclaimerKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') this.dismissDisclaimer(false);
  }

  // ── Aide ─────────────────────────────────────────────────────

  goHelp(): void {
    this.cycleInfoModalOpen.set(true);
  }

  closeCycleInfo(): void {
    this.cycleInfoModalOpen.set(false);
  }

  onCycleInfoKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') this.closeCycleInfo();
  }

  // ── Touch ────────────────────────────────────────────────────

  onTouchStart(event: TouchEvent): void {
    this.touchStartX = event.touches[0].clientX;
  }

  onTouchEnd(event: TouchEvent): void {
    const delta = event.changedTouches[0].clientX - this.touchStartX;
    if (delta < -SWIPE_THRESHOLD) this.goNext();
    else if (delta > SWIPE_THRESHOLD) this.goPrev();
  }
}
