import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, map, shareReplay } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  isMobile$: Observable<boolean>;

  constructor(
    private breakpointObserver: BreakpointObserver,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    // Only set up the breakpoint observer if we're in a browser
    if (isPlatformBrowser(this.platformId)) {
      this.isMobile$ = this.breakpointObserver.observe([Breakpoints.Handset])
        .pipe(
          map(result => result.matches),
          shareReplay()
        );
    } else {
      // On the server, default to desktop view (false for isMobile)
      this.isMobile$ = new Observable<boolean>(observer => observer.next(false));
    }
  }
}