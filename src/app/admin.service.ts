import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http:HttpClient) { }
  getAdminDetails(): Observable<any> {
    return this.http.get<any>(" https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json").pipe(
      tap(_ => this.log('fetch Admin info')),
      catchError(this.handleError("getAdmin", ""))
    );
  }
  
  private handleError<T>(operation = 'operation', result?: T) {
    return (e: any): Observable<T> => {
      console.log(e);
      return of(result as T);
    }
  }
  private log(error: any) {
    console.log(error);
  }
}
