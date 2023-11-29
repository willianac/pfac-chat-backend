import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CarController } from './controllers/car.controller';
import { ChatGateway } from './chat/chat.gateway';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { PrismaService } from './prisma.service';

@Module({
  imports: [],
  controllers: [AppController, CarController, UserController],
  providers: [AppService, ChatGateway, UserService, PrismaService],
})
export class AppModule {}
