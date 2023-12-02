import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatGateway } from './chat/chat.gateway';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { PrismaService } from './prisma.service';
import { MessageController } from './controllers/message.controller';
import { MessageService } from './services/message.service';

@Module({
	imports: [],
	controllers: [AppController, UserController, MessageController],
	providers: [
		AppService,
		ChatGateway,
		UserService,
		PrismaService,
		MessageService,
	],
})
export class AppModule {}
