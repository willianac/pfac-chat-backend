import { Controller, Get, Query, UsePipes } from '@nestjs/common';
import { MessageService } from 'src/services/message.service';
import { ZodValidationPipe, createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

const GetChatMessagesSchema = z.object({
	receiverId: z.string().optional(),
	senderId: z.string().optional(),
});
class GetChatMessagesDTO extends createZodDto(GetChatMessagesSchema) {}

@Controller()
export class MessageController {
	constructor(private messageService: MessageService) {}

	@UsePipes(ZodValidationPipe)
	@Get('messages')
	getChatMessages(@Query() getMessagesQuery: GetChatMessagesDTO) {
		try {
			const { receiverId, senderId } = getMessagesQuery;
			return this.messageService.getChatMessages({ receiverId, senderId });
		} catch (error) {
			return error;
		}
	}
}
