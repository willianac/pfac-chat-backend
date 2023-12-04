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
				OR: [
					{
						sender_id: getMessages.senderId,
						receiver_id: getMessages.receiverId,
					},
					{
						sender_id: getMessages.receiverId,
						receiver_id: getMessages.senderId,
					},
				],
			},
			include: {
				sender: {
					select: {
						name: true,
						profile_url: true,
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
