import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = environment.api;

  constructor(private http: HttpClient) { }

  login(mail: string, password: string) {

   return this.http.post(`${this.apiUrl}/user/login`, { mail, password })
  }
}
