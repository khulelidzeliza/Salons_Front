import { Injectable,  inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IDeleteRequest, ITokenResponse, IUpdateRequest } from '../models/auth.models';

@Injectable({ providedIn: 'root' })

export class UserService {

  private readonly http = inject(HttpClient);
  private readonly base = `/Users`;

   public UpdateUser(body: IUpdateRequest) {
    return this.http.patch<void>(`${this.base}/update-user`, body);
  }

  public DeleteUser() {
    return this.http.delete<void>(`${this.base}/delete-user`);
  }

    

}