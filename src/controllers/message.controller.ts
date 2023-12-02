import { Controller, Get, Query } from '@nestjs/common';
import { MessageService } from 'src/services/message.service';

@Controller()
export class MessageController {
	constructor(private messageService: MessageService) {}

	@Get('messages')
	getChatMessages(
		@Query('receiverId') receiverId: string,
		@Query('senderId') senderId: string,
	) {
		return this.messageService.getChatMessages({ receiverId, senderId });
	}
}
