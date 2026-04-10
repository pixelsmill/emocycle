import { Injectable, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { EmotionFamily } from '../models/emotion.model';

const FAMILY_CLASSES: EmotionFamily[] = [
  'joie',
  'amour',
  'desir',
  'tristesse',
  'colere',
  'peur',
];

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document = inject(DOCUMENT);

  applyFamily(family: EmotionFamily): void {
    const body = this.document.body;
    // Retire toutes les classes de famille existantes
    for (const f of FAMILY_CLASSES) {
      body.classList.remove(`bg-${f}`);
    }
    body.classList.add(`bg-${family}`);
  }

  resetFamily(): void {
    const body = this.document.body;
    for (const f of FAMILY_CLASSES) {
      body.classList.remove(`bg-${f}`);
    }
  }
}
