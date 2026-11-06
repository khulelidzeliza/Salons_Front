import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SalonPayload, UpdateSalonPayload } from '../../../store/salon-state/salon-actions';
import { SalonType } from '../../../store/salon-state/salon-modal';

@Injectable({ providedIn: 'root' })
export class SalonService {
  private addSalonUrl = `/Salons/add-salon`;
  private updateSalonUrl = `/Salons/update-salon`;
  private deleteSalonUrl = `/Salons/delete-salon`;
 
  constructor(private http: HttpClient) {}

  addSalon(payload: SalonPayload, pictures: File[]): Observable<SalonType> {
    const fd = new FormData();
    fd.append('EnglishName', payload.englishName);
    fd.append('GeorgianName', payload.georgianName);
    fd.append('Location', payload.location);
    fd.append('Price', String(payload.price));
    if (payload.phoneNumber)   fd.append('PhoneNumber', payload.phoneNumber);
    if (payload.email)         fd.append('Email', payload.email);
    if (payload.facebookLink)  fd.append('FacebookLink', payload.facebookLink);
    if (payload.instagramLink) fd.append('InstagramLink', payload.instagramLink);
    if (payload.workingHours)  fd.append('WorkingHours', payload.workingHours);
    if (payload.description)   fd.append('description', payload.description);
    pictures.forEach(file => fd.append('Pictures', file)); 
    return this.http.post<SalonType>(this.addSalonUrl, fd);
  }
  updateSalon(body: UpdateSalonPayload): Observable<string> {
    return this.http.put(this.updateSalonUrl, body, { responseType: 'text' });
  }
 
  deleteSalon(userid: number, salonId: number): Observable<string> {
    return this.http.delete(this.deleteSalonUrl, {
      body: { userid, salonId },
      responseType: 'text',
    });
  }
}