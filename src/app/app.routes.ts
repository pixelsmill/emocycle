import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/accueil/accueil').then((m) => m.AccueilComponent),
  },
  {
    path: 'famille/:familleId',
    loadComponent: () =>
      import('./features/liste/liste').then((m) => m.ListeComponent),
  },
  {
    path: 'emotion/:emotionId',
    loadComponent: () =>
      import('./features/fiche/fiche').then((m) => m.FicheComponent),
  },
  {
    path: 'cycle/:emotionId',
    loadComponent: () =>
      import('./features/cycle/cycle').then((m) => m.CycleComponent),
  },
  {
    path: 'sortie/:emotionId',
    loadComponent: () =>
      import('./features/sortie/sortie').then((m) => m.SortieComponent),
  },
  {
    path: 'credits',
    loadComponent: () =>
      import('./features/credits/credits').then((m) => m.CreditsComponent),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
