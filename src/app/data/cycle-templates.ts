import { Emotion, Valence } from '../models/emotion.model';

export interface CycleStep {
  name: string;
  question: string;
  guide: string;
}

/**
 * Textes des 5 étapes du cycle émotionnel, par valence.
 * Le placeholder `[émotion]` est remplacé à l'affichage par `interpolate()`.
 */
export const CYCLE_TEMPLATES: Record<Valence, CycleStep[]> = {
  negative: [
    {
      name: 'Émergence',
      question: 'Que remarquez-vous en ce moment ?',
      guide: `[émotion] est là. Pas besoin de l'expliquer — juste la reconnaître.`,
    },
    {
      name: 'Sensation',
      question: 'Où ressentez-vous [émotion] dans votre corps ?',
      guide: `Tension, chaleur, serrement, vide… Prenez le temps d'observer sans juger.`,
    },
    {
      name: 'Reconnaissance',
      question: 'Et si [émotion] était liée à un besoin qui vous appelle ?',
      guide: `Les émotions ne surgissent pas par hasard. Quel besoin cherche à se faire entendre ?`,
    },
    {
      name: 'Expression',
      question: 'Si [émotion] pouvait parler, que dirait-elle ?',
      guide: `Sans censure. Ce qu'elle dirait à la personne concernée, ou à vous-même.`,
    },
    {
      name: 'Action',
      question: 'Que voulez-vous faire de ce que vous venez de découvrir ?',
      guide: `Une petite action suffit. [émotion] a livré son message — vous pouvez avancer.`,
    },
  ],

  positive: [
    {
      name: 'Émergence',
      question: 'Que remarquez-vous en ce moment ?',
      guide: `[émotion] est là. Accueillez-la — ce moment mérite d'être pleinement vécu.`,
    },
    {
      name: 'Sensation',
      question: 'Où ressentez-vous [émotion] dans votre corps ?',
      guide: `Légèreté, chaleur, élan, ouverture… Prenez le temps de savourer.`,
    },
    {
      name: 'Reconnaissance',
      question: 'Et si [émotion] vous montrait ce qui compte vraiment pour vous ?',
      guide: `Les émotions positives sont des boussoles. Qu'est-ce qu'elles signalent ici ?`,
    },
    {
      name: 'Expression',
      question: 'Comment aimeriez-vous exprimer [émotion] ?',
      guide: `Un geste, un mot, un partage… Laissez [émotion] trouver sa forme naturelle.`,
    },
    {
      name: 'Action',
      question: 'Comment honorer ce qui vous fait du bien ?',
      guide: `[émotion] vous montre un chemin. Quelle petite action peut l'ancrer dans votre vie ?`,
    },
  ],
};

/**
 * Remplace `[émotion]` dans un template par le nom de l'émotion avec article,
 * en minuscule (adapté à l'intérieur d'une phrase).
 * Ex : "La colère" → "la colère", "Le ressentiment" → "le ressentiment"
 */
export function interpolate(template: string, emotion: Emotion): string {
  const name = emotion.name; // ex. "La colère"
  const nameLower = name.charAt(0).toLowerCase() + name.slice(1);
  return template.replace(/\[émotion\]/gi, nameLower);
}
