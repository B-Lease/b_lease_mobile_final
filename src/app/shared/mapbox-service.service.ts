import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';


export interface MapboxOutput{
  attribution: string;
  features:Feature[];
  query: [];
}

export interface Feature{
  place_name:string;
}
@Injectable({
  providedIn: 'root'
})
export class MapboxServiceService {

  constructor(private http:HttpClient) {

   }

   search_word(query:string){
    const url = 'https://api.mapbox.com/geocoding/v5/mapbox.places/';
    return this.http.get(url+query+'.json?access_token='+environment.mapbox.accessToken+'&bbox=117.174274,5.581003,126.537423,18.505227')
    .pipe(map((res:MapboxOutput) =>{
      return res.features;
    }));
   }

   getAddress(latitude:number,longitude:number) {
    const accessToken = environment.mapbox.accessToken;
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${accessToken}`;
     this.http.get(url).subscribe((res: any) => {
      if (res.features && res.features.length > 0) {
      
        return res.features[0].place_name;
      } else {
        return '';
      }
    });
  }
}
