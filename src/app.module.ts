import { Module, HttpModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { WeatherService } from './weather.service';

@Module({
  imports: [HttpModule],
  controllers: [AppController],
  providers: [WeatherService],
})
export class AppModule {}
