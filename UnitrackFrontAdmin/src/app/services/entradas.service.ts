import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.prod';
import { Observable } from 'rxjs';
import { Reporte } from './reporte';

@Injectable({ providedIn: 'root' })
export class EntradaService {
  private apiUrl = environment.apiUrl;
  constructor(private httpClient: HttpClient) {}

  public entradas(): Observable<Reporte[]> {
    return this.httpClient.get<Reporte[]>(`${this.apiUrl}historial/entradas`);
  }

  public salidas(): Observable<Reporte[]> {
    return this.httpClient.get<Reporte[]>(`${this.apiUrl}historial/salidas`);
  }
}
