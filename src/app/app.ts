import { Component, Inject, PLATFORM_ID, afterNextRender } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `<router-outlet></router-outlet>`,
  styles: [`
    :host {
      display: block;
      height: 100%;
    }
  `]
})
export class App {
  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: object
  ) {
    afterNextRender(() => {
      if (isPlatformBrowser(this.platformId)) {
        window.addEventListener('navigateTo', ((event: any) => {
          this.router.navigate([event.detail]);
        }) as EventListener);
      }
    });
  }
}