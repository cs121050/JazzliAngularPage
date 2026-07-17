// navigation.service.ts
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Observable, map, shareReplay, BehaviorSubject } from 'rxjs';          // ← add BehaviorSubject
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class NavigationService {
  isMobile$: Observable<boolean>;

  // New: mobile menu state
  private mobileMenuOpenSubject = new BehaviorSubject<boolean>(false);
  mobileMenuOpen$ = this.mobileMenuOpenSubject.asObservable();

  constructor(
    private breakpointObserver: BreakpointObserver,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.isMobile$ = this.breakpointObserver
        .observe(['(max-width: 599px)'])
        .pipe(
          map(result => result.matches),
          shareReplay(1)
        );
    } else {
      this.isMobile$ = new Observable(sub => sub.next(false));
    }
  }

  // Toggle the mobile menu
  toggleMobileMenu(): void {
    this.mobileMenuOpenSubject.next(!this.mobileMenuOpenSubject.value);
  }

  // Optional: close menu (useful when navigating)
  closeMobileMenu(): void {
    this.mobileMenuOpenSubject.next(false);
  }
}