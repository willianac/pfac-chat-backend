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
import { MessageService } from 'src/services/message.service';

@WebSocketGateway({ cors: true })
export class ChatGateway implements OnGatewayDisconnect {
	constructor(private messageService: MessageService) {}

	@WebSocketServer()
	server: Server;

	handleConnection(client: Socket) {
		console.log('conectou')
	}

	handleDisconnect(client: any) {
		console.log('desconectou');
	}

	@SubscribeMessage('message')
	handleMessage(
		@MessageBody() data: { receiverId: string; message: string },
		@ConnectedSocket() client: Socket,
	) {
		this.messageService.postMessage({
			senderId: client.handshake.auth.userid,
			receiverId: data.receiverId,
			text: data.message,
		});

		this.server.emit('message', {
			senderId: client.handshake.auth.userid,
			receiverId: data.receiverId,
			text: data.message,
		});
		return data;
	}
}
