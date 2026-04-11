import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TablerIconComponent } from '@tabler/icons-angular';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-credits',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, TablerIconComponent],
  host: { class: 'credits-host' },
  templateUrl: './credits.html',
  styleUrl: './credits.scss',
})
export class CreditsComponent {
  constructor() {
    inject(ThemeService).resetFamily();
  }
}
