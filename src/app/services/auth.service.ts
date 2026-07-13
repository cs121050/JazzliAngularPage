// src/app/services/auth.service.ts
import { Injectable, inject } from '@angular/core';
import { 
  Auth, 
  signOut, 
  User, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
  getIdToken // <-- import
} from '@angular/fire/auth';
import { authState } from '@angular/fire/auth';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, from, of, throwError } from 'rxjs';
import { map, switchMap, catchError, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface AppUser {
  firebaseUid: string;
  email: string;
  displayName?: string | null;
  role: 'user' | 'developer' | 'admin';
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private auth = inject(Auth);
  private http = inject(HttpClient);
  private apiBaseUrl = environment.apiBaseUrl;

  // Firebase auth state
  private firebaseUser$ = authState(this.auth);
  isLoggedIn$ = this.firebaseUser$.pipe(map(user => !!user));

  // Backend-synced user with role
  private currentUserSubject = new BehaviorSubject<AppUser | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  // Admin status observable (derived from currentUser$)
  isAdmin$ = this.currentUser$.pipe(map(user => user?.role === 'admin'));

  // Convenience getters (synchronous)
  get currentUser(): AppUser | null {
    return this.currentUserSubject.value;
  }

  get isLoggedIn(): boolean {
    return !!this.auth.currentUser;
  }

  constructor() {
    // Subscribe to Firebase auth changes
    this.firebaseUser$.subscribe(firebaseUser => {
      if (firebaseUser) {
        // Sync with backend when user logs in
        this.syncUserWithBackend(firebaseUser).subscribe({
          next: (appUser) => this.currentUserSubject.next(appUser),
          error: (err) => {
            console.error('Failed to sync user with backend:', err);
            // Still keep Firebase user, but we might want to show an error
            // For now, we'll set currentUser to null and let the user retry manually?
            // Better: set a flag that we are offline, but we'll keep null.
            this.currentUserSubject.next(null);
          }
        });
      } else {
        // User logged out
        this.currentUserSubject.next(null);
      }
    });
  }

  // Sync the Firebase user with the backend
  private syncUserWithBackend(firebaseUser: User): Observable<AppUser> {
    // Get the ID token
    return from(getIdToken(firebaseUser, true)).pipe(
      switchMap(token => {
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        return this.http.get<AppUser>(`${this.apiBaseUrl}/users/me`, { headers });
      }),
      tap(user => console.log('✅ User synced:', user)),
      catchError(error => {
        console.error('❌ Error syncing user:', error);
        // If backend is down, we might return a fallback user? 
        // Better to propagate error so subscriber can handle.
        return throwError(() => error);
      })
    );
  }

  // ----- Existing auth methods (unchanged) -----

  async signInWithEmail(email: string, password: string): Promise<User> {
    const result = await signInWithEmailAndPassword(this.auth, email, password);
    return result.user;
  }

  async signUpWithEmail(email: string, password: string): Promise<User> {
    const result = await createUserWithEmailAndPassword(this.auth, email, password);
    return result.user;
  }

  async sendPasswordResetEmail(email: string): Promise<void> {
    await sendPasswordResetEmail(this.auth, email);
  }

  async signInWithGoogle(): Promise<User> {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(this.auth, provider);
    return result.user;
  }

  async logout(): Promise<void> {
    await signOut(this.auth);
    // Clear the subject (already handled by authState subscription)
    // But we can also explicitly clear:
    this.currentUserSubject.next(null);
  }

  // Additional helpers
  getRole(): string | undefined {
    return this.currentUser?.role;
  }
}