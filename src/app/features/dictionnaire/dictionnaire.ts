import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { Emotion, EmotionContent, EmotionFamily } from '../../models/emotion.model';
import { EmotionService } from '../../services/emotion.service';
import { ThemeService } from '../../services/theme.service';
import { ContentService } from '../../services/content.service';
import { MarkdownPipe } from '../../pipes/markdown.pipe';
import { TablerIconComponent } from '@tabler/icons-angular';
import { RouterLink } from '@angular/router';

interface FamilleGroup {
  id: EmotionFamily;
  label: string;
  emotions: Emotion[];
}

const FAMILLE_LABELS: Record<EmotionFamily, string> = {
  joie:      'Joies',
  amour:     'Amours',
  desir:     'Désirs',
  tristesse: 'Tristesses',
  colere:    'Colères',
  peur:      'Peurs',
};

const FAMILLE_ORDER: EmotionFamily[] = ['joie', 'amour', 'desir', 'tristesse', 'colere', 'peur'];

@Component({
  selector: 'app-dictionnaire',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, MarkdownPipe, TablerIconComponent],
  templateUrl: './dictionnaire.html',
  styleUrl: './dictionnaire.scss',
})
export class DictionnaireComponent implements OnInit {
  private readonly emotionService = inject(EmotionService);
  private readonly theme = inject(ThemeService);
  private readonly contentService = inject(ContentService);

  ngOnInit(): void {
    this.theme.resetFamily();
  }

  readonly groupes = computed<FamilleGroup[]>(() => {
    const all = this.emotionService.emotions();
    return FAMILLE_ORDER.map((id) => ({
      id,
      label: FAMILLE_LABELS[id],
      emotions: all
        .filter((e) => e.family === id)
        .sort((a, b) => a.name.localeCompare(b.name, 'fr')),
    }));
  });

  readonly isLoading = this.emotionService.isLoading;

  // ── Modale fiche ─────────────────────────────────────────────
  readonly modalOpen = signal(false);
  readonly modalEmotion = signal<Emotion | null>(null);
  readonly modalContent = signal<EmotionContent | null>(null);
  readonly modalLoading = signal(false);

  openFiche(emotion: Emotion): void {
    this.modalEmotion.set(emotion);
    this.modalContent.set(null);
    this.modalOpen.set(true);
    this.modalLoading.set(true);
    this.contentService.loadContent(emotion.id).subscribe((c) => {
      this.modalContent.set(c);
      this.modalLoading.set(false);
    });
  }

  closeFiche(): void {
    this.modalOpen.set(false);
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') this.closeFiche();
  }
}
