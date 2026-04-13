import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Emotion, EmotionFamily } from '../models/emotion.model';

@Injectable({ providedIn: 'root' })
export class EmotionService {
  private readonly http = inject(HttpClient);

  readonly emotions = signal<Emotion[]>([]);
  readonly isLoading = signal(false);
  readonly error = signal<string | null>(null);

  constructor() {
    this.loadAll();
  }

  private loadAll(): void {
    this.isLoading.set(true);
    this.http.get<Emotion[]>('/data/emotions.json').subscribe({
      next: (data) => {
        this.emotions.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('EmotionService: échec du chargement de emotions.json', err);
        this.error.set('Impossible de charger les émotions.');
        this.isLoading.set(false);
      },
    });
  }

  getById(id: string): Emotion | null {
    return this.emotions().find((e) => e.id === id) ?? null;
  }

  getByFamily(family: EmotionFamily): Emotion[] {
    return this.emotions()
      .filter((e) => e.family === family)
      .sort((a, b) => a.name.localeCompare(b.name, 'fr'));
  }
}
