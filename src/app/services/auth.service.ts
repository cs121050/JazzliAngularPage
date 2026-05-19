import { Injectable, inject } from '@angular/core';
import { 
  Auth, 
  signOut, 
  User, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup
} from '@angular/fire/auth';
import { authState } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private auth = inject(Auth);
  
  // Use AngularFire's authState observable (already zone-aware)
  currentUser$: Observable<User | null> = authState(this.auth);
  isLoggedIn$: Observable<boolean> = authState(this.auth).pipe(map(user => !!user));

  // Optional: synchronous getters for convenience
  get currentUser(): User | null {
    return this.auth.currentUser;
  }

  get isLoggedIn(): boolean {
    return !!this.auth.currentUser;
  }

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

  logout(): Promise<void> {
    return signOut(this.auth);
  }
}