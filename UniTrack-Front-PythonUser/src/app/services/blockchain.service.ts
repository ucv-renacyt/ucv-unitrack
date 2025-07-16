import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BlockchainService {
  private apiUrl = `${environment.ApiBackEndUrl}/blockchain`;

  constructor(private http: HttpClient) { }

  addBlock(data: any, idUsuario: number): Observable<{ block: any; qrUrl: string }> {
    return this.http.post<{ block: any; qrUrl: string }>(`${this.apiUrl}/add`, { data, idUsuario });
  }

  getChain() {
    return this.http.get(`${this.apiUrl}`);
  }
}