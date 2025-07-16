import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { NavController } from '@ionic/angular';
import { environment } from '../../environments/environment';
import { Preferences } from '@capacitor/preferences';
import { HttpHeaders } from '@angular/common/http';

interface UserProfile {
  idUsuario?: number;
  nombres: string;
  apellidos: string;
  correo: string;
  codigoEstudiante: string;
  correoA?: string;
  carrera: string;
  ciclo: string;
  edad: string;
  sexo: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private ApiBackEndUrl = environment.ApiBackEndUrl;
  public currentUser: any = null;
  private _accessToken: string | null = null;

  constructor(private http: HttpClient, private navCtrl: NavController) {
    this.loadUserFromPreferences().then(() => {
      if (!this.currentUser) {
        this.getProfile().subscribe({
          next: (user) => {
            this.setCurrentUser(user);
          },
          error: (err) => {
            console.error('Error loading user profile on service init:', err);
          },
        });
      }
    });
  }

  public async loadUserFromPreferences() {
    const { value: userValue } = await Preferences.get({ key: 'currentUser' });
    if (userValue) {
      this.currentUser = JSON.parse(userValue);
    }
    const { value: tokenValue } = await Preferences.get({
      key: 'access_token',
    });
    if (tokenValue) {
      this._accessToken = tokenValue;
    }
  }

  async setPreferences(key: string, value: string) {
    if (key === 'access_token') {
      this._accessToken = value;
    }
    await Preferences.set({ key, value });
  }

  async getPreferences(key: string): Promise<string | null> {
    if (key === 'access_token' && this._accessToken) {
      return this._accessToken;
    }
    const { value } = await Preferences.get({ key });
    return value;
  }

  async removePreferences(key: string) {
    if (key === 'access_token') {
      this._accessToken = null;
    }
    await Preferences.remove({ key });
  }

  // Crear un nuevo usuario
  createUser(
    nombres: string,
    apellidos: string,
    correo: string,
    codigo_estudiante: string,
    contrasena: string,
    correoA: string,
    carrera: string,
    ciclo: string,
    edad: string,
    sexo: string
  ): Observable<any> {
    const body = {
      nombres,
      apellidos,
      correo,
      codigoEstudiante: codigo_estudiante,
      contrasena,
      correoA,
      carrera,
      ciclo,
      edad,
      sexo,
    };
    return this.http.post(`${this.ApiBackEndUrl}/users`, body);
  }

  // Iniciar sesión de usuario
  loginUser(correo: string, contrasena: string): Observable<any> {
    const body = { correo, contrasena };
    return this.http.post(`${this.ApiBackEndUrl}/users/login`, body);
  }

  // Establecer el usuario actual
  async setCurrentUser(user: any) {
    this.currentUser = user;
  }

  getProfile(): Observable<any> {
    return new Observable((observer) => {
      this.getPreferences('access_token')
        .then((token) => {
          if (token) {
            this.http
              .get(`${this.ApiBackEndUrl}/users/profile`, {
                headers: { Authorization: `Bearer ${token}` },
              })
              .subscribe({
                next: (response) => {
                  observer.next(response);
                  observer.complete();
                },
                error: (error) => {
                  observer.error(error);
                },
              });
          } else {
            observer.error('No access token found');
          }
        })
        .catch((error) => {
          observer.error(error);
        });
    });
  }

  getHistory(idUsuario: number): Observable<any> {
    return new Observable((observer) => {
      this.getPreferences('access_token')
        .then((token) => {
          if (token) {
            this.http
              .get(`${this.ApiBackEndUrl}/historial/historial/${idUsuario}`, {
                headers: { Authorization: `Bearer ${token}` },
              })
              .subscribe({
                next: (response) => {
                  observer.next(response);
                  observer.complete();
                },
                error: (error) => {
                  observer.error(error);
                },
              });
          } else {
            observer.error('No access token found');
          }
        })
        .catch((error) => {
          observer.error(error);
        });
    });
  }

  updateProfile(userData: UserProfile): Observable<any> {
    return new Observable<any>((observer) => {
      this.getPreferences('access_token').then((token) => {
        if (token) {
          const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          });
          this.http
            .put<any>(
              `${this.ApiBackEndUrl}/users/${this.currentUser.idUsuario}`,
              userData,
              { headers }
            )
            .subscribe({
              next: (response) => observer.next(response),
              error: (err) => observer.error(err),
            });
        } else {
          observer.error('No token found');
        }
      });
    });
  }

  forgotPassword(correo: string): Observable<any> {
    const body = { correo };
    return this.http.post(`${this.ApiBackEndUrl}/users/forgot-password`, body);
  }

  resetPassword(
    correo: string,
    code: string,
    newPassword: string
  ): Observable<any> {
    const body = { correo, code, newPassword };
    return this.http.post(`${this.ApiBackEndUrl}/users/reset-password`, body);
  }
}
