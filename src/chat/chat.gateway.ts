import { PutObjectCommand } from '@aws-sdk/client-s3';
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
import { s3Config } from 'src/configs/multer-config';
import { PrismaService } from 'src/prisma.service';
import { MessageService } from 'src/services/message.service';

@WebSocketGateway({ cors: true })
export class ChatGateway implements OnGatewayDisconnect, OnGatewayConnection {
	constructor(
		private messageService: MessageService,
		private prismaService: PrismaService,
	) {}

	@WebSocketServer()
	server: Server;

	handleConnection(client: Socket) {
		console.log('conectou');
	}

	handleDisconnect(client: Socket) {
		console.log('desconectou');
	}

	@SubscribeMessage('message')
	async handleMessage(
		@MessageBody() data: { receiverId: string; message: string; image: Blob },
		@ConnectedSocket() client: Socket,
	) {
		const key = Date.now().toString();
		const fileLocation =
			'https://pfac-chat.s3.sa-east-1.amazonaws.com/' + key + '.jpg';

		let uploadResponse;
		if (data.image) {
			uploadResponse = await s3Config.send(
				new PutObjectCommand({
					Bucket: 'pfac-chat',
					Key: key + '.jpg',
					Body: data.image,
				}),
			);
		}

		const message = await this.messageService.postMessage({
			senderId: client.handshake.auth.userid,
			receiverId: data.receiverId,
			text: uploadResponse ? null : data.message,
			imageUrl: uploadResponse ? fileLocation : null,
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
				profile_url: sender.profile_url,
			},
		});
		return data;
	}
}
