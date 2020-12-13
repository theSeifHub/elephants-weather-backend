import { Controller, Get, Param  } from '@nestjs/common';
import { WeatherService } from './weather.service';

@Controller()
export class AppController {
  constructor(private readonly weatherService: WeatherService) {};

    // Returns an object of multiple values & variations of dates used as requests' parameters 
    createDatesPack(dateInMilliseconds: string) {
      const dateMs = parseInt(dateInMilliseconds),
            requestDayStr = new Date(dateMs).toDateString(),
            requestDayMs = new Date(requestDayStr).getTime(),
            requestDaySec = Math.round(requestDayMs / 1000),
            todayStr = new Date().toDateString(),
            todayMs = new Date(todayStr).getTime(),
            firstAvailableDay = new Date(todayMs - 518400000).getTime(),
            lastAvailableDay = new Date(todayMs + 691200000).getTime();
      return {
        requestDayStr,
        requestDayMs,
        requestDaySec,
        todayStr,
        todayMs,
        firstAvailableDay,
        lastAvailableDay
      }
    }

  @Get(':location/:dateMs')
  async getWeather(@Param() params): Promise<any> {
    const datePack = this.createDatesPack(params.dateMs);

    if (datePack.requestDayMs === datePack.todayMs) {
      // Get today weather
      console.log("\nGETTING TODAY\n#############\n");//! Server Logging
      const todayWeather =  await this.weatherService.getToday(params.location);
      if (todayWeather.requestSuccess) {
        return todayWeather;
      }
      // In case of any error
      return {
        message: "Failure"
      }


    } else if (datePack.requestDayMs < datePack.todayMs && datePack.requestDayMs >= datePack.firstAvailableDay ) {
      // Get History
      console.log("\nGETTING HISTORY\n###############\n");//! Server Logging
      const coords =  await this.weatherService.getCoords(params.location);
      if (coords.requestSuccess) {
        const {lat, lon, city} = coords;
        const history =  await this.weatherService.getHistory(lat, lon, datePack.requestDaySec);
        if (history.requestSuccess) {
          const {day, description, icon} = history;
          return {
            message: "Success",
            city,
            day,
            description,
            icon
          }
        }
      }
      // In case of any error
      return {
        message: "Failure"
      }


    } else if (datePack.requestDayMs > datePack.todayMs && datePack.requestDayMs <= datePack.lastAvailableDay ) {
      // Get future forecast
      console.log("\nGETTING FORECAST\n################\n");//! Server Logging
      const coords =  await this.weatherService.getCoords(params.location);
      if (coords.requestSuccess) {
        const {lat, lon, city} = coords;
        const forecast =  await this.weatherService.getForecast(lat, lon, datePack.requestDayStr);
        if (forecast.requestSuccess) {
          const {day, description, icon} = forecast;
          return {
            message: "Success",
            city,
            day,
            description,
            icon
          }
        }
      }
      // In case of any error
      return {
        message: "Failure"
      }


    } else {
      // In case of any error
      console.log("\nWeather unavailable\n###################\n");//! Server Logging
      return {
        message: "Failure"
      }
    }
  }
}
