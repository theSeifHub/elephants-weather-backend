import { Controller, Get, HttpService, Param  } from '@nestjs/common';
// import { AppService } from './app.service';

@Controller()
export class AppController {
  private readonly apiKey: string;
  constructor(private readonly httpService: HttpService) {
    this.apiKey = 'c9661625b3eb09eed099288fbfad560a';
  }

  @Get(':city/:date')
  async getWeather(@Param() params): Promise<any> {
    console.log(params.city);
    console.log(params.date);
    let res =  await this.httpService.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${params.city}&appid=${this.apiKey}`
    ).toPromise();
    const {lon, lat} = res.data.coord;
    console.log(lon, lat);
    const city = `${res.data.name}, ${res.data.sys.country}`
    res = await this.httpService.get(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${this.apiKey}`
    ).toPromise();
    return {
      city,
      date: `${params.date}`,
      weather: Array.from(res.data.daily, (day:any) => {
        let date = new Date(day.dt*1000).toDateString()
        return {
        date,
        'wthr': day.weather[0]
      }})
    };
  }
}
// One call
// https://api.openweathermap.org/data/2.5/onecall?lat=26.82&lon=30.8&appid=c9661625b3eb09eed099288fbfad560a
// Icon
// https://openweathermap.org/img/wn/13d@4x.png