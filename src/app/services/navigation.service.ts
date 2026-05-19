import { Injectable, Inject, PLATFORM_ID, NgZone } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  private isMobileSubject = new BehaviorSubject<boolean>(false);
  isMobile$: Observable<boolean> = this.isMobileSubject.asObservable();
  private resizeListener: (() => void) | null = null;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private ngZone: NgZone
  ) {
    if (isPlatformBrowser(this.platformId)) {
      // Initial check
      this.checkViewportSize();
      
      // Set up resize listener inside Angular zone so change detection triggers
      this.ngZone.runOutsideAngular(() => {
        this.resizeListener = () => {
          this.ngZone.run(() => this.checkViewportSize());
        };
        window.addEventListener('resize', this.resizeListener);
        // Also listen to orientation change explicitly (some mobile browsers)
        window.addEventListener('orientationchange', this.resizeListener);
      });
    }
  }

  private checkViewportSize(): void {
    const isMobile = window.innerWidth < 600; // matches CSS breakpoint
    this.isMobileSubject.next(isMobile);
  }

  // Optional: clean up listener if you ever need to destroy this service (rare for root)
  // But Angular doesn't provide a hook for root services; you can add a destroy method
  // and call it from AppComponent if needed. For now, it's fine.
}