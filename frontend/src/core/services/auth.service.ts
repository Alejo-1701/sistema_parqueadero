import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);

  constructor() {
    this.checkInitialAuthStatus();
  }

  // Authentication state
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  // Token management
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    this.isAuthenticatedSubject.next(true);
  }

  removeToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.isAuthenticatedSubject.next(false);
  }

  // Authentication methods
  login(token: string): void {
    this.setToken(token);
  }

  logout(): void {
    this.removeToken();
  }

  // Check if user is authenticated
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  // Check initial auth status
  private checkInitialAuthStatus(): void {
    const token = this.getToken();
    this.isAuthenticatedSubject.next(!!token);
  }
}
