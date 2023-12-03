import {
	WebSocketGateway,
	WebSocketServer,
	OnGatewayConnection,
	OnGatewayDisconnect,
	SubscribeMessage,
	MessageBody,
	ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { PrismaService } from 'src/prisma.service';
import { MessageService } from 'src/services/message.service';

@WebSocketGateway({ cors: true })
export class ChatGateway implements OnGatewayDisconnect {
	constructor(
		private messageService: MessageService,
		private prismaService: PrismaService,
	) {}

	@WebSocketServer()
	server: Server;

	handleConnection(client: Socket) {
		console.log('conectou');
	}

	handleDisconnect(client: any) {
		console.log('desconectou');
	}

	@SubscribeMessage('message')
	async handleMessage(
		@MessageBody() data: { receiverId: string; message: string },
		@ConnectedSocket() client: Socket,
	) {
		const message = await this.messageService.postMessage({
			senderId: client.handshake.auth.userid,
			receiverId: data.receiverId,
			text: data.message,
		});

		const sender = await this.prismaService.user.findUnique({
			where: {
				id: client.handshake.auth.userid,
			},
		});

		this.server.emit('message', {
			...message,
			sender: {
				name: sender.name,
			},
		});
		return data;
	}
}
