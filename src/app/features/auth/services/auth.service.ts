import { Injectable, signal, computed, inject } from '@angular/core';
import { Result } from '../../../core/models/api-result.model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {IChangePasswordRequest, ILoginRequest, IRegisterRequest, IResendCodeRequest, ISendPasswordResetRequest, ITokenResponse, IVerifyEmailRequest } from '../models/auth.models';

@Injectable({ providedIn: 'root' })

export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly base = `/Auth`;

  public login(body: ILoginRequest) {
    return this.http.post<ITokenResponse>(`${this.base}/login`, body);
  }

  public register(body: IRegisterRequest) {
    return this.http.post(`${this.base}/register`, body);
  }

  public verifyEmail(body: IVerifyEmailRequest) {
    return this.http.post<ITokenResponse>(`${this.base}/verify-email`, body);
  }

  public resendCode(body: IResendCodeRequest): Observable<Result<boolean>> {
    return this.http.post<Result<boolean>>(`${this.base}/resend-code`, body);
  }
 public sendPasswordReset(body: ISendPasswordResetRequest): Observable<Result<boolean>> {
    return this.http.post<Result<boolean>>(`${this.base}/reset-password` , body);
  }
    public resetPassword(body: IChangePasswordRequest): Observable<boolean> {
    return this.http.post<boolean>(`${this.base}/change-password`, body);
  }

}