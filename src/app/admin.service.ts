import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http:HttpClient) { }
  getAdminDetails(){
    return this.http.get(" https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json");
  }
}
