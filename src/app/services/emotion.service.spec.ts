import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { EmotionService } from './emotion.service';
import { Emotion } from '../models/emotion.model';

const mockEmotions: Emotion[] = [
  {
    id: 'colere',
    name: 'La colère',
    family: 'colere',
    valence: 'negative',
    type: 'simple',
    gender: 'f',
    contentFile: 'colere.md',
  },
  {
    id: 'tristesse',
    name: 'La tristesse',
    family: 'tristesse',
    valence: 'negative',
    type: 'simple',
    gender: 'f',
    contentFile: 'tristesse.md',
  },
  {
    id: 'frustration',
    name: 'La frustration',
    family: 'colere',
    valence: 'negative',
    type: 'pseudo',
    gender: 'f',
    contentFile: 'frustration.md',
  },
];

describe('EmotionService', () => {
  let service: EmotionService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    httpMock = TestBed.inject(HttpTestingController);
    service = TestBed.inject(EmotionService);
    // Respond to the initial loadAll() call
    httpMock.expectOne('/data/emotions.json').flush(mockEmotions);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load all emotions on init', () => {
    expect(service.emotions()).toEqual(mockEmotions);
    expect(service.isLoading()).toBe(false);
  });

  it('getById() should return matching emotion', () => {
    expect(service.getById('colere')).toEqual(mockEmotions[0]);
  });

  it('getById() should return null for unknown id', () => {
    expect(service.getById('inconnu')).toBeNull();
  });

  it('getByFamily() should return only simple emotions of that family', () => {
    const result = service.getByFamily('colere');

    // frustration is type 'pseudo', must be excluded
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('colere');
  });
});
