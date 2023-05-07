import { Injectable } from '@angular/core';
import axios from 'axios';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  constructor() { }


  getCurrentDateTime(): string {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = this.padZero(currentDate.getMonth() + 1);
    const day = this.padZero(currentDate.getDate());
    const hours = this.padZero(currentDate.getHours());
    const minutes = this.padZero(currentDate.getMinutes());
    const seconds = this.padZero(currentDate.getSeconds());

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  private padZero(num: number): string {
    return num < 10 ? `0${num}` : `${num}`;
  }

  async  readNotification(notificationID:string, userID:string, sessionID:string)
  {
    // Define the data you want to send in the request body
const data = {
  notificationID: notificationID
};


// Define the Axios PUT request config
const config = {
  headers: {
    'Content-Type': 'application/json'
  }
};

// Send the Axios PUT request using Angular's HttpClient
await axios.put(environment.API_URL+`notifications?userID=${userID}&sessionID=${sessionID}`, data, config)
  .then(response => {
    console.log(response.data);
  })
  .catch(error => {
    console.error(error);
  });
  }
}
