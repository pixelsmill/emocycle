import { CYCLE_TEMPLATES, interpolate } from './cycle-templates';
import { Emotion } from '../models/emotion.model';

const colere: Emotion = {
  id: 'colere', name: 'La colère', family: 'colere',
  valence: 'negative', type: 'simple', gender: 'f', contentFile: 'colere.md',
};
const plaisir: Emotion = {
  id: 'plaisir', name: 'Le plaisir', family: 'joie',
  valence: 'positive', type: 'simple', gender: 'm', contentFile: 'plaisir.md',
};
const amour: Emotion = {
  id: 'amour', name: "L'amour", family: 'amour',
  valence: 'positive', type: 'mixte', gender: 'm', contentFile: 'amour.md',
};

describe('CYCLE_TEMPLATES', () => {
  it('exports 5 steps for negative valence', () => {
    expect(CYCLE_TEMPLATES.negative).toHaveLength(5);
  });

  it('exports 5 steps for positive valence', () => {
    expect(CYCLE_TEMPLATES.positive).toHaveLength(5);
  });

  it('each step has name, question and guide', () => {
    for (const step of [...CYCLE_TEMPLATES.negative, ...CYCLE_TEMPLATES.positive]) {
      expect(step.name).toBeTruthy();
      expect(step.question).toBeTruthy();
      expect(step.guide).toBeTruthy();
    }
  });

  it('step 3 (Reconnaissance) question differs by valence', () => {
    const neg = CYCLE_TEMPLATES.negative[2].question;
    const pos = CYCLE_TEMPLATES.positive[2].question;
    expect(neg).toContain('besoin');
    expect(pos).toContain('compte');
    expect(neg).not.toBe(pos);
  });

  it('step names are: Émergence, Sensation, Reconnaissance, Expression, Action', () => {
    const names = CYCLE_TEMPLATES.negative.map((s) => s.name);
    expect(names).toEqual([
      'Émergence', 'Sensation', 'Reconnaissance', 'Expression', 'Action',
    ]);
  });
});

describe('interpolate()', () => {
  it('replaces [émotion] with lowercased emotion name (feminine)', () => {
    const result = interpolate('Où [émotion] se loge-t-elle ?', colere);
    expect(result).toBe('Où la colère se loge-t-elle ?');
  });

  it('replaces [émotion] with lowercased emotion name (masculine)', () => {
    const result = interpolate('Où [émotion] se loge-t-il ?', plaisir);
    expect(result).toBe('Où le plaisir se loge-t-il ?');
  });

  it("replaces [émotion] when name starts with L'", () => {
    const result = interpolate('[émotion] est là.', amour);
    expect(result).toBe("l'amour est là.");
  });

  it('replaces multiple occurrences of [émotion]', () => {
    const result = interpolate('[émotion] et [émotion]', colere);
    expect(result).toBe('la colère et la colère');
  });

  it('is case-insensitive for the placeholder', () => {
    const result = interpolate('Si [Émotion] pouvait parler', colere);
    expect(result).toBe('Si la colère pouvait parler');
  });
});
