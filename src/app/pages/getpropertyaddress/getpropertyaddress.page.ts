import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { Geolocation } from '@capacitor/geolocation';
import { MapboxServiceService, Feature } from 'src/app/shared/mapbox-service.service';
import { features } from 'process';
import { environment } from 'src/environments/environment.prod';
import { HttpClient } from '@angular/common/http';
import { LoadingService } from 'src/app/shared/loading.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';


@Component({
  selector: 'app-getpropertyaddress',
  templateUrl: './getpropertyaddress.page.html',
  styleUrls: ['./getpropertyaddress.page.scss'],
})
export class GetpropertyaddressPage implements OnInit {

  private getpropertyaddressmap: L.Map;
  private marker: L.Marker;
  private self_latitude: number;
  private self_longitude: number;




  location: { lat: number, lng: number };
  addresses: string[] = [];
  selectedAddress = null;
  isSubmitDisabled: boolean = true;

  pinned_lat: number;
  pinned_lng: number;

  private propertyLandSize: string;
  private propertyLandSizeUnit: string;
  private legalLandDescription: string;
  private price: string;
  private propertyType: string;
  private moreDetails: string;
  constructor(
    private geolocation: Geolocation,
    private mapboxService: MapboxServiceService,
    private http: HttpClient,
    private loading: LoadingService,
    private router: Router,
    private navCtrl: NavController,
    private activatedRoute: ActivatedRoute
  ) {

    this.propertyLandSize = this.activatedRoute.snapshot.paramMap.get('propertyLandSize');
    this.propertyLandSizeUnit = this.activatedRoute.snapshot.paramMap.get('propertyLandSizeUnit');
    this.legalLandDescription = this.activatedRoute.snapshot.paramMap.get('legalLandDescription');
    this.price = this.activatedRoute.snapshot.paramMap.get('price');
    this.propertyType = this.activatedRoute.snapshot.paramMap.get('propertyType');
    this.moreDetails = this.activatedRoute.snapshot.paramMap.get('moreDetails');
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


  onSelect(address: string) {
    this.selectedAddress = address;
    this.getLatLongAddress();
    this.addresses = [];
    this.selectedAddress = "";
  }
  async ngOnInit() {
    await this.loading.present('Loading Maps');
    await this.getCurrentLocation();
    await this.loading.dismiss();
    this.getpropertyaddressmap = await L.map('getpropertymapId').setView([this.self_latitude, this.self_longitude], 18);
    this.getpropertyaddressmap.zoomControl.remove();
    if (L.Browser.retina) {
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
        maxZoom: 20,
        tileSize: 512,
        zoomOffset: -1,
        detectRetina: true
      }).addTo(this.getpropertyaddressmap);
    } else {
      L.tileLayer('https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}{r}.png', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
        maxZoom: 18
      }).addTo(this.getpropertyaddressmap);
    }

    const customIcon = L.icon({
      iconUrl: 'assets/icon/b_lease_marker.svg',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [0, -35],
    });


    this.getpropertyaddressmap.on('click', (e: L.LeafletMouseEvent) => {
      if (this.marker) {
        this.getpropertyaddressmap.removeLayer(this.marker);
        this.marker = null;
        this.isSubmitDisabled = true;
      } else {
        this.marker = L.marker(e.latlng, { icon: customIcon }).addTo(this.getpropertyaddressmap);
        console.log(e.latlng);

        this.pinned_lat = e.latlng.lat;
        this.pinned_lng = e.latlng.lng;

        console.log('pinned lat: ' + this.pinned_lat);
        console.log('pinned lng: ' + this.pinned_lng);

        this.isSubmitDisabled = false;
      }
    });
  }




  async ionViewDidEnter() {
  


  }

  updateMap(lat: number, lng: number) {
    // Set the view of the map to the new coordinates and zoom level
    this.getpropertyaddressmap.setView([lat, lng], 16);
  }

  async getCurrentLocation() {
    const coordinates: GeolocationPosition = await Geolocation.getCurrentPosition();
    this.self_latitude = coordinates.coords.latitude;
    this.self_longitude = coordinates.coords.longitude;
    console.log('Latitude: ' + this.self_latitude + ', Longitude: ' + this.self_longitude);
  }

  async getLatLongAddress() {
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
  //   if (this.getpropertyaddressmap) {
  //     this.getpropertyaddressmap.remove();
  //   }
  // }

  submitPin() {
    this.navCtrl.navigateBack(['/addlisting', {
      lat: this.pinned_lat,
      lng: this.pinned_lng,
      propertyLandSize :  this.propertyLandSize,
      propertyLandSizeUnit :  this.propertyLandSizeUnit,
      legalLandDescription :  this.legalLandDescription,
      price : this.price,
      propertyType : this.propertyType,
      moreDetails : this.moreDetails
    }]);
  }
  cancelPin() {
    this.navCtrl.navigateBack(['/addlisting', {
      propertyLandSize :  this.propertyLandSize,
      propertyLandSizeUnit :  this.propertyLandSizeUnit,
      legalLandDescription :  this.legalLandDescription,
      price : this.price,
      propertyType : this.propertyType,
      moreDetails : this.moreDetails
    }]);
  }
}
