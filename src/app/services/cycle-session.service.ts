import { Injectable } from '@angular/core';

/**
 * Gère l'état de session du cycle — sans persistance (reset au F5).
 * Permet de n'afficher le disclaimer qu'une seule fois par session.
 */
@Injectable({ providedIn: 'root' })
export class CycleSessionService {
  private _disclaimerShown = false;

  get shouldShowDisclaimer(): boolean {
    return !this._disclaimerShown;
  }

  markDisclaimerShown(): void {
    this._disclaimerShown = true;
  }
}
