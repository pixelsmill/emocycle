import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { EmotionFamily } from '../../models/emotion.model';
import { EmotionSessionService } from '../../services/emotion-session.service';
import { ThemeService } from '../../services/theme.service';

interface FamilleItem {
  id: EmotionFamily;
  label: string;
  ariaLabel: string;
  face: string;
}

const FAMILLES: FamilleItem[] = [
  { id: 'joie',      label: 'Joies',      ariaLabel: 'Choisir la famille Joies',      face: '/images/face_08.jpg' },
  { id: 'amour',     label: 'Amours',     ariaLabel: 'Choisir la famille Amours',     face: '/images/face_10.jpg' },
  { id: 'desir',     label: 'Désirs',     ariaLabel: 'Choisir la famille Désirs',     face: '/images/face_11.jpg' },
  { id: 'tristesse', label: 'Tristesses', ariaLabel: 'Choisir la famille Tristesses', face: '/images/face_12.jpg' },
  { id: 'colere',    label: 'Colères',    ariaLabel: 'Choisir la famille Colères',    face: '/images/face_05.jpg' },
  { id: 'peur',      label: 'Peurs',      ariaLabel: 'Choisir la famille Peurs',      face: '/images/face_09.jpg' },
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
