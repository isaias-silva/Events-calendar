import { Injectable } from '@angular/core';
import { UserService } from './user.service';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Event } from '../../interfaces/event.interface';

@Injectable({
  providedIn: 'root'
})
export class EventsService {
  private apiUrl = environment.api;

  constructor(private userService: UserService, private http: HttpClient) {

  }
  getEvents(type: 'me' | 'all') {
    return this.http.get<Event[]>(`${this.apiUrl}/events/${type}`, { headers: { "authorization": `Bearer ${this.userService.getToken()}` } })
  }
}
