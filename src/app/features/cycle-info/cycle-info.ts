import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { TablerIconComponent } from '@tabler/icons-angular';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

@Component({
  selector: 'app-cycle-info',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './cycle-info.html',
  styleUrl: './cycle-info.scss',
  imports: [TablerIconComponent, RouterLink],
  host: { class: 'cycle-info-host' },
})
export class CycleInfoComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  private readonly queryParams = toSignal(this.route.queryParamMap, {
    initialValue: this.route.snapshot.queryParamMap,
  });

  readonly returnUrl = computed(() => {
    const params = this.queryParams();
    const from = params.get('from');
    const emotionId = params.get('emotionId');
    if (from === 'cycle' && emotionId) return `/cycle/${emotionId}`;
    return '/';
  });

  goBack(): void {
    this.router.navigateByUrl(this.returnUrl());
  }
}
