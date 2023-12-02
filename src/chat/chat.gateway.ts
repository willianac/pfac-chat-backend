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

@WebSocketGateway({ cors: true })
export class ChatGateway implements OnGatewayDisconnect {
	@WebSocketServer()
	server: Server;

	handleConnection(client: any) {
		
	}

	handleDisconnect(client: any) {
		console.log('desconectou');
	}

	@SubscribeMessage('message')
	handleMessage(
		@MessageBody() data: string,
		@ConnectedSocket() client: Socket,
	) {
		console.log(data);
		this.server.emit("message", "eu, server, recebi isso:" + data);
		return data
	}
}
