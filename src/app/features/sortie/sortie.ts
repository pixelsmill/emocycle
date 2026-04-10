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
import { EmotionService } from '../../services/emotion.service';
import { ThemeService } from '../../services/theme.service';

type SortieState = 'initial' | 'merci' | 'pas-vraiment';

@Component({
  selector: 'app-sortie',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'sortie-host' },
  templateUrl: './sortie.html',
  styleUrl: './sortie.scss',
})
export class SortieComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly emotionService = inject(EmotionService);
  private readonly theme = inject(ThemeService);

  private readonly emotionId = toSignal(
    this.route.paramMap.pipe(map((p) => p.get('emotionId') ?? '')),
    { initialValue: '' },
  );

  readonly emotion = computed(() => this.emotionService.getById(this.emotionId()));

  readonly state = signal<SortieState>('initial');

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
}
