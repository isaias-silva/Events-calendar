import { Injectable } from '@angular/core';
import { UserService } from './user.service';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Event } from '../../interfaces/event.interface';
import { EventCreate } from '../../interfaces/event.create.interface';
import { GlobalResponse } from '../../interfaces/global.responses.interface';
import { UserData } from '../../interfaces/user.data.interface';

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

  getEvent(id: string) {
    return this.http.get<Event>(`${this.apiUrl}/events/${id}`, { headers: { "authorization": `Bearer ${this.userService.getToken()}` } })

  }
  createEvent(event: EventCreate) {
    return this.http.post<GlobalResponse>(`${this.apiUrl}/events/create`, event, { headers: { "authorization": `Bearer ${this.userService.getToken()}` } })

  }
  getParticipants(id: string) {
    return this.http.get<UserData[]>(`${this.apiUrl}/events/participants/${id}`, { headers: { "authorization": `Bearer ${this.userService.getToken()}` } })

  }
  getApplicants(id: string) {
    return this.http.get<UserData[]>(`${this.apiUrl}/events/applicants/${id}`, { headers: { "authorization": `Bearer ${this.userService.getToken()}` } })

  }
  getGuests(id: string) {
    return this.http.get<UserData[]>(`${this.apiUrl}/events/guests/${id}`, { headers: { "authorization": `Bearer ${this.userService.getToken()}` } })

  }
  getEventWhere(type: 'participate' | 'applicate' | 'guest') {
    return this.http.get<Event[]>(`${this.apiUrl}/events/where/${type}`, { headers: { "authorization": `Bearer ${this.userService.getToken()}` } })

  }

  eventUpdate(id: string, event: EventCreate) {
    return this.http.put<GlobalResponse>(`${this.apiUrl}/events/update/${id}`, event, { headers: { "authorization": `Bearer ${this.userService.getToken()}` } })

  }
  eventUpdateBackground(id: string, file: File) {
    const formData = new FormData();

    formData.append("file", file);

    return this.http.put<GlobalResponse>(`${this.apiUrl}/events/update/background/${id}`, formData, { headers: { "authorization": `Bearer ${this.userService.getToken()}` } })

  }
  deleteEvent(id: string) {
    return this.http.delete<GlobalResponse>(`${this.apiUrl}/events/cancel/${id}`, { headers: { "authorization": `Bearer ${this.userService.getToken()}` } })

  }
  subscribeEvent(_id: string) {
    return this.http.post<GlobalResponse>(`${this.apiUrl}/events/subscribe`, { _id }, { headers: { "authorization": `Bearer ${this.userService.getToken()}` } })

  }
  unsubscribeEvent(_id: string) {
    return this.http.post<GlobalResponse>(`${this.apiUrl}/events/unsubscribe`, { _id }, { headers: { "authorization": `Bearer ${this.userService.getToken()}` } })

  }
  approveApplicant(_id: string, user: string) {
    return this.http.post<GlobalResponse>(`${this.apiUrl}/events/approve`, { _id, user }, { headers: { "authorization": `Bearer ${this.userService.getToken()}` } })

  }
  recuseApplicant(_id: string, user: string) {
    return this.http.post<GlobalResponse>(`${this.apiUrl}/events/reject`, { _id, user }, { headers: { "authorization": `Bearer ${this.userService.getToken()}` } })

  }
  sendInvite(_id: string, user: string) {
    return this.http.post<GlobalResponse>(`${this.apiUrl}/events/send/invite`, { _id, user }, { headers: { "authorization": `Bearer ${this.userService.getToken()}` } })

  }
  acceptInvite(_id: string, accept: boolean) {
    return this.http.post<GlobalResponse>(`${this.apiUrl}/events/accept/invite`, { _id, accept }, { headers: { "authorization": `Bearer ${this.userService.getToken()}` } })

  }

}
