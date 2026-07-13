// navigation.service.ts
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Observable, map, shareReplay } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class NavigationService {
  isMobile$: Observable<boolean>;

  constructor(
    private breakpointObserver: BreakpointObserver,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      // Breakpoint exactly matching your requirement: portrait < 600px
      this.isMobile$ = this.breakpointObserver
        .observe(['(max-width: 599px)'])
        .pipe(
          map(result => result.matches),
          shareReplay(1) // important: avoid multiple emissions
        );
    } else {
      // Server-side: default to desktop
      this.isMobile$ = new Observable(sub => sub.next(false));
    }
  }

  toggleMobileMenu(): void {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('toggleMenu'));
    }
  }
}