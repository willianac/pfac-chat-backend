/* eslint-disable prettier/prettier */
import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: true })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect{
  @WebSocketServer()
  server: Server;

	handleConnection(client: any) {
    console.log("conectou")
  }

  handleDisconnect(client: any) {
    // Handle disconnection event
  }

	@SubscribeMessage('message')
  handleMessage(@MessageBody() data: string, @ConnectedSocket() client: Socket) {
    console.log(data)
    return "chegou"
  }
}
