import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

type CreateMessageDTO = {
	senderId: string;
	receiverId: string;
	text: string;
};

type GetChatMessagesDTO = {
	senderId: string;
	receiverId: string;
};

@Injectable()
export class MessageService {
	constructor(private prisma: PrismaService) {}

	async postMessage(messageCreateInput: CreateMessageDTO) {
		const message = await this.prisma.message.create({
			data: {
				sender: {
					connect: {
						id: messageCreateInput.senderId,
					},
				},
				receiver: {
					connect: {
						id: messageCreateInput.receiverId,
					},
				},
				text: messageCreateInput.text,
			},
		});
		return message;
	}

	async getChatMessages(getMessages: GetChatMessagesDTO) {
		const messages = await this.prisma.message.findMany({
			where: {
				sender_id: getMessages.senderId,
				receiver_id: getMessages.receiverId,
			},
			include: {
				sender: {
					select: {
						name: true,
					},
				},
				receiver: {
					select: {
						name: true,
					},
				},
			},
		});

		return messages;
	}
}
