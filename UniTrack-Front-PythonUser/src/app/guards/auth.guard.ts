import { Injectable } from '@angular/core';
import { CanLoad, Route, UrlSegment, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanLoad {

  constructor(private userService: UserService, private router: Router) {}

  canLoad(
    route: Route,
    segments: UrlSegment[]
  ): Observable<boolean> | Promise<boolean> | boolean {
    return new Observable<boolean>(observer => {
      this.userService.getPreferences('access_token').then(token => {
        if (token) {
          observer.next(true);
          observer.complete();
        } else {
          this.router.navigateByUrl('/login');
          observer.next(false);
          observer.complete();
        }
      }).catch(error => {
        console.error('Error checking access token:', error);
        this.router.navigateByUrl('/login');
        observer.next(false);
        observer.complete();
      });
    });
  }
}
