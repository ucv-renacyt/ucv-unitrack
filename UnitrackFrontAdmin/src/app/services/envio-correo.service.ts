import { Injectable } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class EnvioCorreoService {
  private apiUrl = environment.correoApiUrl; // URL de tu API
  public currentUser: any = null;
  public currentEmail: string = '';

  constructor(private http: HttpClient, private navCtrl: NavController) {}
  // Envía el código de verificación al correo del usuario
  sendVerificationCodee(correo: string): Observable<any> {
    return this.http.post(`${this.apiUrl}admin/forgot-password`, {
      correo: correo,
    });
  }

  // Verifica el código de verificación
  verifyVerificationCode(code: number): Observable<any> {
    return this.http.post(`${this.apiUrl}admin/verify-code`, {
      code,
      email: this.currentEmail,
    });
  }
  // Restablece la contraseña del usuario
  resetPassword(
    correo: string,
    code: string,
    newPassword: string
  ): Observable<any> {
    const body = { correo, code, newPassword };
    return this.http.post(`${this.apiUrl}admin/reset-password`, body);
  }
}
