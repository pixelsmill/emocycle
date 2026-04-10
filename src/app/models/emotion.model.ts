export type EmotionFamily = 'joie' | 'amour' | 'desir' | 'tristesse' | 'colere' | 'peur';

export type Valence = 'positive' | 'negative';

export type EmotionType = 'simple' | 'mixte' | 'repoussee' | 'pseudo' | 'inconnu';

export type Gender = 'm' | 'f';

export interface Emotion {
  id: string;
  name: string;
  family: EmotionFamily;
  valence: Valence;
  type: EmotionType;
  gender: Gender;
  contentFile: string;
}

export interface EmotionContent {
  examples: string | null;
  description: string | null;
  utility: string | null;
  typicalErrors: string | null;
}
