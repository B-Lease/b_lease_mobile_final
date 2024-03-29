import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { Geolocation } from '@capacitor/geolocation';
import { MapboxServiceService, Feature } from 'src/app/shared/mapbox-service.service';
import { features } from 'process';
import { environment } from 'src/environments/environment.prod';
import { HttpClient } from '@angular/common/http';
import { LoadingService } from 'src/app/shared/loading.service';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import axios from 'axios';
@Component({
  selector: 'app-getaddress',
  templateUrl: './getaddress.page.html',
  styleUrls: ['./getaddress.page.scss'],
})
export class GetaddressPage implements OnInit {
  private map: L.Map;
  private marker: L.Marker;
  private self_latitude: number;
  private self_longitude: number;


  private email:string;
  private first_name:string;
  private middle_name:string;
  private last_name:string;
  private birthdate;
  private phone_number;

  location: { lat: number, lng: number };
  addresses: string[] = [];
  selectedAddress = null;
  isSubmitDisabled:boolean = true;

  pinned_lat:number;
  pinned_lng:number;

  propertyCoordinates:any[] = [];
  constructor(
    private geolocation: Geolocation,
    private mapboxService: MapboxServiceService,
    private http:HttpClient,
    private loading:LoadingService,
    private router:Router,
    private navCtrl:NavController,
    private activatedRoute:ActivatedRoute
  ) {
    this.email = this.activatedRoute.snapshot.paramMap.get('email');
    this.first_name = this.activatedRoute.snapshot.paramMap.get('first_name');
    this.middle_name = this.activatedRoute.snapshot.paramMap.get('middle_name');
    this.last_name = this.activatedRoute.snapshot.paramMap.get('last_name');
    this.birthdate = this.activatedRoute.snapshot.paramMap.get('birthdate');
    this.phone_number = this.activatedRoute.snapshot.paramMap.get('phone_number');

  }

  search(event: any) {
    const searchTerm = event.target.value.toLowerCase();
    if (searchTerm && searchTerm.length > 0) {
      this.mapboxService
        .search_word(searchTerm)
        .subscribe((features: Feature[]) => {
          this.addresses = features.map(feat => feat.place_name);
        });
    } else {
      this.addresses = [];
    }
  }


onSelect(address: string){
  this.selectedAddress = address;
  this.getLatLongAddress();
  this.addresses = [];
  this.selectedAddress = "";
}
ngOnInit() {

}


 

  async ionViewDidEnter(){
  await this.loading.present('Loading Maps');
  await this.getCurrentLocation();
  await this.loading.dismiss();  
  this.map = await L.map('mapId').setView([this.self_latitude, this.self_longitude], 18);
  this.map.zoomControl.remove();
  if (L.Browser.retina) {
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
      maxZoom: 20,
      tileSize: 512,
      zoomOffset: -1,
      detectRetina: true
    }).addTo(this.map);
  } else {
    L.tileLayer('https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}{r}.png', {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
      maxZoom: 18
    }).addTo(this.map);
  }

  const customIcon = L.icon({
    iconUrl: 'assets/icon/b_lease_marker.svg',
    // shadowUrl: 'assets/icon/b_lease_marker-shadow.png',
    iconSize: [25, 41],
    // shadowSize: [35, 41],
    iconAnchor: [12, 41],
    // shadowAnchor: [12, 41],
    popupAnchor: [0, -35],    
  });



  this.map.on('click', (e: L.LeafletMouseEvent) => {
    if (this.marker) {
      this.map.removeLayer(this.marker);
      this.marker = null;
      this.isSubmitDisabled = true;
    } else {
      this.marker = L.marker(e.latlng, { icon: customIcon }).addTo(this.map);
      console.log(e.latlng);
      
      this.pinned_lat = e.latlng.lat;
      this.pinned_lng = e.latlng.lng;

      console.log('pinned lat: '+ this.pinned_lat);
      console.log('pinned lng: '+ this.pinned_lng);
      
      this.isSubmitDisabled = false;
    }
  });


}

updateMap(lat: number, lng: number) {
  // Set the view of the map to the new coordinates and zoom level
  this.map.setView([lat, lng], 16);
}

  async getCurrentLocation() {
  const coordinates: GeolocationPosition = await Geolocation.getCurrentPosition();
  this.self_latitude = coordinates.coords.latitude;
  this.self_longitude = coordinates.coords.longitude;
  console.log('Latitude: ' + this.self_latitude + ', Longitude: ' + this.self_longitude);
}

async getLatLongAddress(){
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(this.selectedAddress)}.json?access_token=${environment.mapbox.accessToken}`;
  await this.http.get(url).subscribe((res: any) => {
    const [lng, lat] = res.features[0].center;
    this.location = { lat, lng };
    this.self_latitude = lat;
    this.self_longitude = lng;
    this.updateMap(this.self_latitude, this.self_longitude);
    console.log(this.location);
  });
}

// ngOnDestroy() {
//   if (this.map) {
//     this.map.remove();
//   }
// }
submitPin(){
  this.router.navigate(['/signup',{
    email:this.email, 
    lat:this.pinned_lat,
    lng:this.pinned_lng,
    first_name: this.first_name,
    middle_name: this.middle_name,
    last_name : this.last_name,
    birthdate:this.birthdate,
    phone_number:this.phone_number
  }]);
}
cancelPin(){
  this.navCtrl.navigateBack(['/signup',{
    email: this.email,
    first_name: this.first_name,
    middle_name: this.middle_name,
    last_name : this.last_name,
    birthdate:this.birthdate,
    phone_number:this.phone_number
    
  }]);
}

async getPropertyCoordinates(){
  await axios.get(`${environment.API_URL}propertyCoordinates`)
  .then(response => {
    console.log(response.data);

    if(response.data.message != "No property coordinates")
    {
      this.propertyCoordinates = response.data;
    }
    // handle the response data here
  })
  .catch(error => {
    console.error(error);
    // handle the error here
  });
}

}
