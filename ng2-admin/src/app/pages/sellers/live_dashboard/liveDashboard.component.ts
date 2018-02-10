import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { setTimeout } from 'timers';

import {DateService} from '../../services/date.service'




@Component({
  selector: 'live-dashboard',
  templateUrl: './liveDashboard.component.html',
  providers: [DateService ],
  styles:[ ]
})
export class LiveDashboardComponent {

  public currentDate=new Date();

  public day = this.currentDate.getDate();
  public month = this.currentDate.getMonth() + 1;
  public year = this.currentDate.getFullYear();
  public hour = this.currentDate.getHours();
  public minutes = this.currentDate.getMinutes();


  constructor(private dateService:DateService){

    

    this.updateDate();

  }

  updateDate(){
    this.dateService.getServerDate().subscribe(data=>{
      
      setTimeout(()=>{
        this.currentDate=new Date(Number(data.server_date));
        this.day = this.currentDate.getDate();
        this.month = this.currentDate.getMonth() + 1;
        this.year = this.currentDate.getFullYear();
        this.hour = this.currentDate.getHours();
        this.minutes = this.currentDate.getMinutes();
        this.updateDate();
  
      },30000);
    });

    

      
  }



}