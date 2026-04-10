import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-credits',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  host: { class: 'credits-host' },
  templateUrl: './credits.html',
  styleUrl: './credits.scss',
})
export class CreditsComponent {
  constructor() {
    inject(ThemeService).resetFamily();
  }
}
