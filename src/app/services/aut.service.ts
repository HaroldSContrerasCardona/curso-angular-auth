import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TokenService } from '@services/token.service';

import { environment } from '@environments/environment';
import { switchMap, tap } from 'rxjs/operators';
import { ResponseLogin } from '@models/auth.model';
import { User } from '@models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AutService {

  apiUrl = environment.API_URL;

  constructor( private http: HttpClient, private tokenSerive: TokenService) { }

  login(email:string, password: string) {
    return this.http.post<ResponseLogin>(`${this.apiUrl}/api/v1/auth/login`, {
      email,
      password
    })
    .pipe(
      tap(response => {
        this.tokenSerive.saveToken(response.access_token);
      })
    );
  }

  registerAndLogin(email: string, password: string, name: string) {
    return this.register(email,password,name)
    .pipe(
      switchMap(() => this.login(email, password))
    )
  }

  register(email: string, password: string, name: string){
    return this.http.post(`${this.apiUrl}/api/v1/auth/register`, {
      email,
      password,
      name
    });
  }

  isAvailable(email: string) {
    return this.http.post<{isAvailable: boolean}>(`${this.apiUrl}/api/v1/auth/is-available`, { email });
  }

  recovery(email: string) {
    return this.http.post(`${this.apiUrl}/api/v1/auth/recovery`, { email });
  }

  changePassword(token: string, newPassword: string) {
    return this.http.post(`${this.apiUrl}/api/v1/auth/change-password`, { token, newPassword });
  }

  getProfile() {
    const token = this.tokenSerive.getToken();
    return this.http.get<User>(`${this.apiUrl}/api/v1/auth/profile`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
     });
  }

  logout() {
    this.tokenSerive.removeToken();
  }
}
