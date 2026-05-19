import { Injectable, signal } from '@angular/core';
import { Auth, onAuthStateChanged, signOut, User } from '@angular/fire/auth';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  
  currentUser$ = this.currentUserSubject.asObservable();
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor(private auth: Auth) {
    onAuthStateChanged(this.auth, (user) => {
      this.currentUserSubject.next(user);
      this.isLoggedInSubject.next(!!user);
    });
  }

  isLoggedIn(): boolean {
    return this.isLoggedInSubject.value;
  }

  currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  logout() {
    signOut(this.auth);
  }
}