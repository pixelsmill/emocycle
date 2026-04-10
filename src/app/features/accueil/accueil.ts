import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { EmotionFamily } from '../../models/emotion.model';
import { EmotionSessionService } from '../../services/emotion-session.service';
import { ThemeService } from '../../services/theme.service';

interface FamilleItem {
  id: EmotionFamily;
  label: string;
  ariaLabel: string;
}

const FAMILLES: FamilleItem[] = [
  { id: 'joie',      label: 'Joies',      ariaLabel: 'Choisir la famille Joies' },
  { id: 'amour',     label: 'Amours',     ariaLabel: 'Choisir la famille Amours' },
  { id: 'desir',     label: 'Désirs',     ariaLabel: 'Choisir la famille Désirs' },
  { id: 'tristesse', label: 'Tristesses', ariaLabel: 'Choisir la famille Tristesses' },
  { id: 'colere',    label: 'Colères',    ariaLabel: 'Choisir la famille Colères' },
  { id: 'peur',      label: 'Peurs',      ariaLabel: 'Choisir la famille Peurs' },
];

@Component({
  selector: 'app-accueil',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  templateUrl: './accueil.html',
  styleUrl: './accueil.scss',
})
export class AccueilComponent {
  private readonly router = inject(Router);
  private readonly theme = inject(ThemeService);
  private readonly session = inject(EmotionSessionService);

  readonly familles = FAMILLES;

  onFamilleSelect(famille: FamilleItem): void {
    this.theme.applyFamily(famille.id);
    this.session.selectFamily(famille.id);
    this.router.navigate(['/famille', famille.id]);
  }
}
