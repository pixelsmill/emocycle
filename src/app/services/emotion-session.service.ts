import { Injectable, signal } from '@angular/core';
import { Emotion, EmotionFamily } from '../models/emotion.model';

@Injectable({ providedIn: 'root' })
export class EmotionSessionService {
  readonly selectedEmotion = signal<Emotion | null>(null);
  readonly selectedFamily = signal<EmotionFamily | null>(null);

  select(emotion: Emotion): void {
    this.selectedEmotion.set(emotion);
    this.selectedFamily.set(emotion.family);
  }

  selectFamily(family: EmotionFamily): void {
    this.selectedFamily.set(family);
  }

  reset(): void {
    this.selectedEmotion.set(null);
    this.selectedFamily.set(null);
  }
}
