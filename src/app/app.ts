import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet],
  template: `
    <a class="skip-link" href="#main-skip-target">Aller au contenu</a>
    <div id="main-skip-target" tabindex="-1"></div>
    <router-outlet />
  `,
  styles: [`
    .skip-link {
      position: absolute;
      left: -9999px;
      top: auto;
      width: 1px;
      height: 1px;
      overflow: hidden;

      &:focus {
        position: fixed;
        top: 1rem;
        left: 1rem;
        width: auto;
        height: auto;
        padding: 0.5rem 1rem;
        background: #fff;
        color: #000;
        font-size: 14px;
        z-index: 9999;
        border-radius: 4px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      }
    }

    #main-skip-target:focus {
      outline: none;
    }
  `],
})
export class App {
  private readonly document = inject(DOCUMENT);

  constructor() {
    inject(Router).events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe(() => {
        this.document.defaultView?.scrollTo(0, 0);
        const target = this.document.getElementById('main-skip-target');
        target?.focus({ preventScroll: true });
      });
  }
}
