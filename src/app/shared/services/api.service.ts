import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl: string;

  constructor(
    private http: HttpClient,
    private notification: NotificationService
  ) {
    this.baseUrl = environment.backendUrl;
  }

  get = (endpoint: string, data?) => {
    return this.http.get(`${this.baseUrl}${endpoint}`)
      .pipe(
        map(response => this.checkError(response, data?.allowedErrors)),
        catchError(this.handleError)
      );
  }

  post = (endpoint: string, data) => {
    return this.http.post(`${this.baseUrl}${endpoint}`, data)
      .pipe(
        map(response => this.checkError(response)),
        catchError(this.handleError)
      );
  }

  put = (endpoint: string, data) => {
    return this.http.put(`${this.baseUrl}${endpoint}`, data)
      .pipe(
        map(response => this.checkError(response)),
        catchError(this.handleError)
      );
  }

  delete = (endpoint: string) => {
    return this.http.delete(`${this.baseUrl}${endpoint}`)
      .pipe(
        map(response => this.checkError(response)),
        catchError(this.handleError)
      );
  }

  // The server always responds in JSON format.
  // If the response has a 'status' field, with the value 'error', we handle it here automatically.
  // We can whitelist errors to skip that step.
  private checkError = (response: any, allowedErrors?: [string]) => {
    if (response.status === 'error') {
      if (allowedErrors?.indexOf(response.message) >= 0) {
        return response;
      }

      this.notification.add({
        message: response.message,
        status: 'warn'
      });
    }

    return response;
  }

  // stolen from angular.io
  private handleError = (error: HttpErrorResponse) => {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);

      this.notification.add({
        message: JSON.stringify(error.error),
        status: 'warn'
      });
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  }
}
