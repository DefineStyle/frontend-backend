import { Injectable, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { WebSocketService } from './websocket-service';


export interface NotificationMessage {

  title: string;

  message: string;

}



@Injectable({
  providedIn: 'root'
})
export class NotificationService {


  private websocketService = inject(WebSocketService);



  private notificationsSubject =
    new BehaviorSubject<NotificationMessage[]>([]);



  private unreadSubject =
    new BehaviorSubject<boolean>(false);




  notifications$ =
    this.notificationsSubject.asObservable();



  unread$ =
    this.unreadSubject.asObservable();





  constructor() {


    this.websocketService.connect(
      (notification: NotificationMessage) => {


        const current =
          this.notificationsSubject.value;



        this.notificationsSubject.next([

          notification,

          ...current

        ]);



        this.unreadSubject.next(true);


      }
    );


  }





  markAsRead() {

    this.unreadSubject.next(false);

  }





  clearNotifications() {

    this.notificationsSubject.next([]);

  }


}