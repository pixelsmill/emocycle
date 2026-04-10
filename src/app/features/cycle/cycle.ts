import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { Emotion } from '../../models/emotion.model';
import { EmotionService } from '../../services/emotion.service';
import { ThemeService } from '../../services/theme.service';
import { CYCLE_TEMPLATES, CycleStep, interpolate } from '../../data/cycle-templates';

const SWIPE_THRESHOLD = 50; // px minimum pour déclencher un swipe
const TOTAL_STEPS = 5;

@Component({
  selector: 'app-cycle',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './cycle.html',
  styleUrl: './cycle.scss',
  host: { class: 'cycle-host' },
})
export class CycleComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly emotionService = inject(EmotionService);
  private readonly theme = inject(ThemeService);
  private readonly el = inject(ElementRef);

  private readonly emotionId = toSignal(
    this.route.paramMap.pipe(map((p) => p.get('emotionId') ?? '')),
    { initialValue: '' },
  );

  readonly emotion = computed<Emotion | null>(() =>
    this.emotionService.getById(this.emotionId()),
  );

  readonly currentIndex = signal(0);

  /** Steps interpolés avec le nom de l'émotion */
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

  /** translateX pour le slide CSS */
  readonly slideTransform = computed(
    () => `translateX(-${this.currentIndex() * 100}%)`,
  );

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
      // Attendre le chargement des émotions
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
      this.router.navigate(['/emotion', this.emotionId()]);
    } else {
      this.currentIndex.update((i) => i - 1);
    }
  }

  onTouchStart(event: TouchEvent): void {
    this.touchStartX = event.touches[0].clientX;
  }

  onTouchEnd(event: TouchEvent): void {
    const delta = event.changedTouches[0].clientX - this.touchStartX;
    if (delta < -SWIPE_THRESHOLD) this.goNext();
    else if (delta > SWIPE_THRESHOLD) this.goPrev();
  }
}
