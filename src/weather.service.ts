import { Injectable, HttpService } from '@nestjs/common';
@Injectable()
export class WeatherService {
  private readonly apiKey: string;
  constructor(private readonly httpService: HttpService) {
    this.apiKey = "c9661625b3eb09eed099288fbfad560a";
  }

  // Get coordinates of requested location 
  async getCoords(location: string) {
    const res =  await this.httpService.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${this.apiKey}`
    ).toPromise();
    
    if (res.data && res.data.cod === 200) {
      const city = `${res.data.name}, ${res.data.sys.country}`;
      const {lon, lat} = res.data.coord;
      return {
        requestSuccess: true,
        city,
        lat,
        lon
      };
    }
    // if no data is returned
    return {
      requestSuccess: false
    };
  }

  // Get today's weather
  async getToday(location) {
    const res =  await this.httpService.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${this.apiKey}`
    ).toPromise();
    
    if (res.data && res.data.cod === 200) {
      const city = `${res.data.name}, ${res.data.sys.country}`;
      const day = new Date(res.data.dt*1000).toDateString();
      const {description, icon} = res.data.weather[0];
      console.log(description);
      console.log(icon);
      return {
        requestSuccess: true,
        city,
        day,
        description,
        icon
      };
    }
    // if no data is returned
    return {
      requestSuccess: false
    };
  }

  // Get future daily forecast within seven days
  async getForecast(lat: number, lon: number, dayToLook: string) {
    let res =  await this.httpService.get(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${this.apiKey}`
    ).toPromise();
    if (res.data) {
      for (const day of res.data.daily) {
        const dateString = new Date(day.dt*1000).toDateString();
        if (dayToLook === dateString) {
          const {description, icon} = day.weather[0];
          return {
            requestSuccess: true,
            day: dateString,
            description,
            icon
          };
        }
      }
    }
    // if no data is returned
    return {
      requestSuccess: false
    };
  }

  // Get past history of up to 5 days ago
  async getHistory(lat: number, lon: number, daySec: number) {
    let res =  await this.httpService.get(
      `https://api.openweathermap.org/data/2.5/onecall/timemachine?lat=${lat}&lon=${lon}&dt=${daySec}&appid=${this.apiKey}`
    ).toPromise();
    if (res.data) {
      const dayToLook = new Date(daySec*1000).toDateString();
      const dateString = new Date(res.data.current.dt*1000).toDateString();
      if (dayToLook === dateString) {
          const {description, icon} = res.data.current.weather[0];
          return {
            requestSuccess: true,
            day: dateString,
            description,
            icon
          };
        }
      }
      // if no data is returned
      return {
        requestSuccess: false
      };
    }
  }
  