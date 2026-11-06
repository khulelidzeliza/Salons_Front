import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { ITokenResponse } from '../../features/auth/models/auth.models';
import { isPlatformBrowser } from '@angular/common';

export interface ITokens {
  access_token: string | null;
}

interface JwtPayload {
  exp?: number;
  iat?: number;
  sub?: string;
  [key: string]: unknown;
}

@Injectable({
  providedIn: 'root',
})
export class AuthTokenService {
  private readonly accessTokenName = 'access_token';
  private readonly platformId = inject(PLATFORM_ID);
  private get isBrowser(): boolean {
  return isPlatformBrowser(this.platformId);
}
  public saveTokens({ accessToken }: ITokenResponse) {
    localStorage.setItem(this.accessTokenName, accessToken);
  }

  public getTokens(): ITokens {
  if (!this.isBrowser) {
    return { access_token: null };
  }

  const access_token = localStorage.getItem(this.accessTokenName);
  return { access_token };
}

  public deleteTokens() {
    localStorage.removeItem(this.accessTokenName);
  }

  public static decodeToken(token: string): JwtPayload | null {
    try {
      const parts = token.split('.');

      if (parts.length !== 3) {
        return null;
      }

      const payload = parts[1];
      const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));

      return JSON.parse(decoded);
    } catch {
      return null;
    }
  }
}