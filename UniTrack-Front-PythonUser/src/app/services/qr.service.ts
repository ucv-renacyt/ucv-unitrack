import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class QrService {
  private apiUrl = `${environment.ApiBackEndUrl}/qr`;

  constructor(private http: HttpClient) {}

  getQrUrlByUserId(idUsuario: number): Observable<{ qrUrl: string }> {
    return this.http.post<{ qrUrl: string }>(`${this.apiUrl}/usuario-por-qr`, {
      idUsuario,
    });
  }

  getLatestQrTypeByUserId(idUsuario: number): Observable<{ tipo: string }> {
    return this.http.post<{ tipo: string }>(`${this.apiUrl}/latest-qr-type`, {
      idUsuario,
    });
  }

  generateQrCode(hash: string, tipo: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/generar?hash=${hash}&tipo=${tipo}`);
  }

  verificarQr(hash: string, tipo: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/verificarExpiracion`, { hash, tipo });
  }

  registrarQr(
    hash: string,
    idUsuario: number,
    tipo: string,
    url: string
  ): Observable<any> {
    return this.http.post(`${this.apiUrl}/registrar`, {
      hash,
      idUsuario,
      tipo,
      url,
    });
  }
}
