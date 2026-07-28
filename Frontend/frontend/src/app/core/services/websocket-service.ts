import { Injectable } from '@angular/core';
import { Client } from '@stomp/stompjs';


@Injectable({
  providedIn: 'root'
})
export class WebSocketService {


  private client!: Client;



  connect(callback: (message: any) => void) {


    this.client = new Client({

      brokerURL: 'ws://localhost:8080/ws',

      reconnectDelay: 5000,


      debug: (message) => {

        console.log(message);

      }

    });



    this.client.onConnect = () => {


      console.log('WebSocket connected');



      this.client.subscribe(
        '/topic/announcements',

        message => {


          const data = JSON.parse(message.body);


          callback(data);


        }

      );


    };



    this.client.onStompError = (frame) => {

      console.error(
        'STOMP error:',
        frame
      );

    };



    this.client.activate();


  }


}