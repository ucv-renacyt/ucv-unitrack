import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable , throwError } from 'rxjs';
import { Reporte } from './reporte';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment.prod';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = environment.apiUrl; // URL de tu API
  public currentUser: any = null;
  
  constructor(private http: HttpClient, private router: Router) { 
   
  }

  // Obtener un usuario por ID (protegido)
  getUserById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}?id=${id}`, { withCredentials: true }).pipe(
      catchError((error) => throwError({ error: true, message: 'Error al obtener usuario', details: error }))
    );
  }

    // Crear un nuevo administrador
   createAdmin(
    nombres: string,
    apellidos: string,
    correo: string,
    contrasena: string,
    edad: string,
    sexo: string // Debe ser 'M' o 'F'
  ): Observable<any> {
    if (!correo.endsWith('@ucvvirtual.edu.pe')) {
      // Devuelve un error en formato estándar
      return throwError({ error: true, message: 'El correo debe ser de la universidad' });
    }
    const sexoNormalizado = sexo.toLowerCase() === 'hombre' ? 'Male' : (sexo.toLowerCase() === 'mujer' ? 'Female' : sexo);
    const body = { nombres, apellidos, correo, contrasena, edad: `${edad}`, sexo: sexoNormalizado };
    return this.http.post<any>(this.apiUrl+'admin/add', body).pipe(
      catchError((error) => {
        console.error('Error en createAdmin:', error);
        if (error.error && error.error.error) {
          return throwError({ error: true, message: error.error.error });
        }
        return throwError({ error: true, message: 'Error al crear administrador', details: error });
      })
    );
  }

  // Actualizar un usuario (protegido)
  updateAdmin(id: number, nombres: string, apellidos: string, correo: string, codigo_admin: string): Observable<any> {
    const body = { action: 'update', id, nombres, apellidos, correo, codigo_admin };
    return this.http.post(`${this.apiUrl}`, body, { withCredentials: true }).pipe(
      catchError((error) => throwError({ error: true, message: 'Error al actualizar administrador', details: error }))
    );
  }


  // Iniciar sesión de usuario
   loginUser(correo: string, contrasena: string): Observable<any> {
    const body = { correo, contrasena };
    return this.http.post(`${this.apiUrl}admin/login`, body).pipe(
      catchError((error) => throwError({ error: true, message: 'Error al iniciar sesión', details: error }))
    );
  }

  // Cerrar sesión (protegido)
  logoutUser(): Observable<any> {
    const body = { action: 'logout' };
    return this.http.post(`${this.apiUrl}`, body, { withCredentials: true }).pipe(
      catchError((error) => throwError({ error: true, message: 'Error al cerrar sesión', details: error }))
    );
  }
  
  // Establecer el usuario actual
  setCurrentUser(user: any, token: any) {
  this.currentUser = user;
  if (user && token) {
    localStorage.setItem('currentUser', JSON.stringify(user));
    localStorage.setItem('access_token', token);
    
  } else {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('access_token');
  }
}

  // Obtener el usuario actual
  getCurrentUser() {
  if (this.currentUser) {
    return this.currentUser;
  }
  const userStr = localStorage.getItem('currentUser');
  if (userStr) {
    this.currentUser = JSON.parse(userStr);
    return this.currentUser;
  }
  return null;
}
  
   // Obtener reportes (protegido)
  getReportes(): Observable<Reporte[]> {
    const token = localStorage.getItem('access_token');
    if (!token) {
      this.router.navigate(['/login']);
      return throwError(() => new Error('No access token found'));
    }
    return this.http.get<Reporte[]>(`${this.apiUrl}historial/entradas`, { 
      headers: { 'Authorization': `Bearer ${token}` } 
    }).pipe(
      catchError((error) => {
        if (error.status === 401) {
          this.router.navigate(['/login']);
        }
        return throwError(() => ({ error: true, message: 'Error al obtener reportes', details: error }));
      })
    );
  }

  // Obtener reportes de salidas (protegido)
  getReportesSalidas(): Observable<Reporte[]> {
    const token = localStorage.getItem('access_token');
    if (!token) {
      this.router.navigate(['/login']);
      return throwError(() => new Error('No access token found'));
    }
    return this.http.get<Reporte[]>(`${this.apiUrl}historial/salidas`, { 
      headers: { 'Authorization': `Bearer ${token}` } 
    }).pipe(
      catchError((error) => {
        if (error.status === 401) {
          this.router.navigate(['/login']);
        }
        return throwError(() => ({ error: true, message: 'Error al obtener reportes de salidas', details: error }));
      })
    );
  }
 
  editAdmin(id: number, correo: string, edad: string, sexo: string): Observable<any> {
    const body = { correo, edad, sexo };
    const token = localStorage.getItem('access_token');
    if (!token) {
      this.router.navigate(['/login']);
      return throwError(() => new Error('No access token found'));
    }
    return this.http.patch(`${this.apiUrl}admin/${id}`, body,{
      headers: { 'Authorization': `Bearer ${token}` } 
    }).pipe(
      catchError((error) => throwError({ error: true, message: 'Error al actualizar administrador', details: error }))
    );
  }
  
  
  
  
  
}
