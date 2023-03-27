import { Component, OnInit, ViewChild } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Router,ActivatedRoute } from '@angular/router';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { ToastController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { NavController } from '@ionic/angular';
import { IonContent } from '@ionic/angular';
@Component({
  selector: 'app-chatroom',
  templateUrl: './chatroom.page.html',
  styleUrls: ['./chatroom.page.scss'],
})

export class ChatroomPage implements OnInit { 
  nickname = '';
  leasingID = '';
  userID = '';
  msg_senderID = '';
  msg_receiverID = '';
  user_fname = '';
  lessorID = '';

  message = '';
  messages = [];
  response: any[];

  hidden = false;

  @ViewChild('myContent', { static: true }) content: IonContent;

  // Call this method to scroll to the bottom of the page

  constructor(
    private http: HttpClient, 
    private activatedroute: ActivatedRoute, 
    public toastCtrl: ToastController, 
    private socket:Socket,
    private navCtrl: NavController
    ) {

    }


  ngOnInit() {
    const data = this.activatedroute.snapshot.queryParams['data'];
    this.leasingID = data['leasingID'];
    console.log('leasing ID: '+this.leasingID)
    
    this.userID = data['userID'];
    this.msg_senderID = data['msg_senderID'];     //user 
    
    this.msg_receiverID = data['msg_receiverID']
    
    this.user_fname = data['user_fname'];

    this.lessorID = data['lessorID']

    if (this.lessorID == this.msg_senderID){
      this.hidden = true;
    }

    this.getCurrentMessages(this.leasingID);

    this.getMessages().subscribe( message => {
      this.messages.push(message);
      console.log(this.messages)
    });
  }
  
  ionViewDidEnter(){
    this.content.scrollToBottom(0);
  }
  

  openInbox(){
    const data = {
      userID : this.userID
    };
    
    this.navCtrl.navigateBack('/home/inbox', { queryParams: { data } });
  }

  async getCurrentMessages(leasingID:string){
      //make a request and assign the value of the response to the messages array
      console.log('request')
      const response = await this.http.get(`http://localhost:5000/messages?leasingID=${leasingID}`).subscribe((data) => {
        if (typeof data === 'string') {
          this.response = JSON.parse(data);

        } else {
          this.response = Object.values(data);

        }
        this.messages = this.response;
      });

  }

  sendMessage(){
    const currentDateTime: string = this.getCurrentDateTime();

    this.socket.emit('add-message', { leasingID: this.leasingID, msg_senderID: this.msg_senderID, msg_receiverID: this.msg_receiverID, msg_content: this.message, sent_at: currentDateTime});
    //calls function that sends POST request)
    this.saveMessage(this.leasingID, this.message, this.msg_senderID, this.msg_receiverID, currentDateTime);
    this.message = '' //clears input after sending

  }

  getMessages(){
    let observable = new Observable(observer => {
      this.socket.on('message', data => {
        observer.next(data);
      })
    });

    return observable;
  }

  getUsers(){
    let observable = new Observable(observer => {
      this.socket.on('users-changed', data => {
        observer.next(data);
      })
    });
    return observable;
  }

  async showToast(msg){
    let toast = await this.toastCtrl.create({
      message: msg,
      duration: 2000

    });
    toast.present();
  }
  
  async saveMessage(leasingID: string, message: string, msg_senderID: string, msg_receiverID: string, currentDateTime: string) {
    const body = { 
      'leasingID': leasingID,
      'msg_content': message,  
      'msg_senderID': msg_senderID, 
      'msg_receiverID': msg_receiverID,
      'sent_at': currentDateTime
    };

    try {
      const response: HttpResponse<any> = await this.http.post('http://192.168.1.2:5000/messages', body, { observe: 'response' }).toPromise();
      if(response.status === 201){
        console.log(response)
      } else {
      }
    } catch (error) {
      console.log(error);
      // Handle the error
    }
  }

  getCurrentDateTime(): string {
    const currentDate = new Date();
  
    const year = currentDate.getFullYear().toString().padStart(4, '0');
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const day = currentDate.getDate().toString().padStart(2, '0');
    const hours = currentDate.getHours().toString().padStart(2, '0');
    const minutes = currentDate.getMinutes().toString().padStart(2, '0');
    const seconds = currentDate.getSeconds().toString().padStart(2, '0');
  
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }
  
  setContract(){
    console.log("okay")
  }
  

}












