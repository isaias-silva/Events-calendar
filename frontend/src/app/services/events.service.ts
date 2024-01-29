import { Injectable } from '@angular/core';
import { UserService } from './user.service';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Event } from '../../interfaces/event.interface';
import { EventCreate } from '../../interfaces/event.create.interface';
import { GlobalResponse } from '../../interfaces/global.responses.interface';

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

  createEvent(event: EventCreate) {
    return this.http.post<GlobalResponse>(`${this.apiUrl}/events/create`, event, { headers: { "authorization": `Bearer ${this.userService.getToken()}` } })

  }
}
