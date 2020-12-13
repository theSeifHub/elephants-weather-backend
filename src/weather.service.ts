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
        message: "Success",
        city,
        lat,
        lon
      }
    };
    // if no data is returned
    return {
      message: new Error("Invalid Location")
    };
  }

  // Get today's weather
  async getTodays(location) {
    const res =  await this.httpService.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${this.apiKey}`
    ).toPromise();
    
    if (res.data && res.data.cod === 200) {
      const city = `${res.data.name}, ${res.data.sys.country}`;
      const day = new Date(res.data.dt*1000).toDateString();
      const {description, icon} = res.data.weather;
      return {
        message: "Success",
        city,
        day,
        description,
        icon
      }
    };
    // if no data is returned
    return {
      message: new Error("Invalid Location")
    }
  }

  // Get future forecast up to seven days
  async getForecast(lat: number, lon: number, dayToLook: string){
    let res =  await this.httpService.get(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${this.apiKey}`
    ).toPromise();
    if (res.data) {
      res.data.daily.forEach(day => {
        const dateString = new Date(day.dt*1000).toDateString();
        if (dayToLook === dateString) {
          const {description, icon} = day.weather;
          return {
           message: "Success",
            day: dateString,
            description,
            icon
          }
        }
      });
    }

    // if no data is returned
    return {
      message: new Error("Forecast unavailable for this date")
    }
  }

  // Get past history 
  async getHistory(lat: number, lon: number, dayMs: number) {
    let res =  await this.httpService.get(
      `https://api.openweathermap.org/data/2.5/onecall/timemachine?lat=${lat}&lon=${lon}&dt=${dayMs}&appid=${this.apiKey}`
    ).toPromise();
    if (res.data) {
      const dayToLook = new Date(dayMs).toDateString();
      const dateString = new Date(res.data.current.dt*1000).toDateString();
      if (dayToLook === dateString) {
          const {description, icon} = res.data.current.weather;
          return {
           message: "Success",
            day: dateString,
            description,
            icon
          }
        }
      }
      // if no data is returned
      return {
        message: new Error("History unavailable for this date")
      }
    };
  }


