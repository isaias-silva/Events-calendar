import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { JwtResponse } from '../../interfaces/jwt.response.interface';
import { tap } from 'rxjs';
import { UserData } from '../../interfaces/user.data.interface';
import { GlobalResponse } from '../../interfaces/global.responses.interface';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = environment.api;

  constructor(private http: HttpClient) { }

  login(mail: string, password: string) {

    return this.http.post<JwtResponse>(`${this.apiUrl}/user/login`, { mail, password }).pipe(tap((response) => {
      localStorage.setItem('auth-token', response.token)

    }))
  }
  register(name: string, mail: string, password: string) {

    return this.http.post<JwtResponse>(`${this.apiUrl}/user/subscribe`, { name, mail, password }).pipe(tap((response) => {
      localStorage.setItem('auth-token', response.token)

    }))

  }
  getToken(): string | null {
    return localStorage.getItem('auth-token')
  }
  logout() {
    localStorage.removeItem('auth-token')
  }

  getUser() {
    return this.http.get<UserData>(`${this.apiUrl}/user/me`, { headers: { "authorization": `Bearer ${this.getToken()}` } })
  }
  validateMail(token: string) {
    return this.http.get<GlobalResponse>(`${this.apiUrl}/user/validate?token=${token}`, { headers: { "authorization": `Bearer ${this.getToken()}` } })
  }
  updateName(name: string) {
    return this.http.put<GlobalResponse>(`${this.apiUrl}/user/update`, { name }, { headers: { "authorization": `Bearer ${this.getToken()}` } })

  }
  updateProfileUser(file: File) {
    const formData = new FormData();

    formData.append("file", file);

    return this.http.put<GlobalResponse>(`${this.apiUrl}/user/update/profile`, formData, { headers: { "authorization": `Bearer ${this.getToken()}` } })
  }


}
