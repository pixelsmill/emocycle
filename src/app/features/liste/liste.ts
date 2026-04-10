import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { Emotion, EmotionFamily } from '../../models/emotion.model';
import { EmotionService } from '../../services/emotion.service';
import { EmotionSessionService } from '../../services/emotion-session.service';
import { ThemeService } from '../../services/theme.service';

const FAMILLE_LABELS: Record<EmotionFamily, string> = {
  joie:      'Joies',
  amour:     'Amours',
  desir:     'Désirs',
  tristesse: 'Tristesses',
  colere:    'Colères',
  peur:      'Peurs',
};

const VALID_FAMILIES: EmotionFamily[] = [
  'joie', 'amour', 'desir', 'tristesse', 'colere', 'peur',
];

@Component({
  selector: 'app-liste',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './liste.html',
  styleUrl: './liste.scss',
  host: { class: 'liste-host' },
})
export class ListeComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly emotionService = inject(EmotionService);
  private readonly session = inject(EmotionSessionService);
  private readonly theme = inject(ThemeService);

  private readonly familleId = toSignal(
    this.route.paramMap.pipe(map((p) => p.get('familleId') ?? '')),
    { initialValue: '' },
  );

  readonly familleLabel = computed(() => {
    const id = this.familleId() as EmotionFamily;
    return FAMILLE_LABELS[id] ?? '';
  });

  readonly emotions = computed<Emotion[]>(() => {
    const id = this.familleId() as EmotionFamily;
    if (!VALID_FAMILIES.includes(id)) return [];
    return this.emotionService.getByFamily(id);
  });

  ngOnInit(): void {
    const id = this.familleId();
    if (!VALID_FAMILIES.includes(id as EmotionFamily)) {
      this.router.navigate(['/']);
      return;
    }
    this.theme.applyFamily(id as EmotionFamily);
  }

  onEmotionSelect(emotion: Emotion): void {
    this.session.select(emotion);
    this.router.navigate(['/emotion', emotion.id]);
  }

  goBack(): void {
    this.theme.resetFamily();
    this.router.navigate(['/']);
  }
}
