import { TestBed } from '@angular/core/testing';
import { EmotionSessionService } from './emotion-session.service';
import { Emotion } from '../models/emotion.model';

const mockEmotion: Emotion = {
  id: 'colere',
  name: 'La colère',
  family: 'colere',
  valence: 'negative',
  type: 'simple',
  gender: 'f',
  contentFile: 'colere.md',
};

describe('EmotionSessionService', () => {
  let service: EmotionSessionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmotionSessionService);
  });

  it('should be created with null state', () => {
    expect(service.selectedEmotion()).toBeNull();
    expect(service.selectedFamily()).toBeNull();
  });

  it('should update selectedEmotion and selectedFamily on select()', () => {
    service.select(mockEmotion);

    expect(service.selectedEmotion()).toEqual(mockEmotion);
    expect(service.selectedFamily()).toBe('colere');
  });

  it('should update only selectedFamily on selectFamily()', () => {
    service.selectFamily('joie');

    expect(service.selectedFamily()).toBe('joie');
    expect(service.selectedEmotion()).toBeNull();
  });

  it('should reset both signals on reset()', () => {
    service.select(mockEmotion);
    service.reset();

    expect(service.selectedEmotion()).toBeNull();
    expect(service.selectedFamily()).toBeNull();
  });
});
