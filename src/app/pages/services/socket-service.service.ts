import { Injectable } from '@angular/core';
import io from 'socket.io-client';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SocketServiceService {
  private socket: any;
  private messagesUrl = 'http://192.168.1.2:5000/message'; // replace with your API endpoint

  constructor(private http: HttpClient) { }

  // connect to the socket and fetch previous messages
  public connect(): Observable<any> {
    // create a new socket connection
    this.socket = io('http://192.168.1.2:5000/');

    // fetch previous messages using a GET request
    return this.http.get(this.messagesUrl);
  }

  // send a message over the socket
  public sendMessage(message: string): void {
    this.socket.emit('message', message);
  }

  // receive messages over the socket
  public onMessage(): Observable<any> {
    return new Observable<any>(observer => {
      this.socket.on('message', (data: any) => {
        observer.next(data);
      });
    });
  }
}



