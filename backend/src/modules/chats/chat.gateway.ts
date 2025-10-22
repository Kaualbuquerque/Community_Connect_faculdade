import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    OnGatewayConnection,
    OnGatewayDisconnect,
    ConnectedSocket,
    MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessageService } from '../messages/messages.service';

@WebSocketGateway({
    cors: { origin: 'http://localhost:3000' }, // ajuste para seu frontend
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    constructor(private readonly messageService: MessageService) { }

    // ----------------------
    // Conexão / Desconexão
    // ----------------------
    handleConnection(client: Socket) {
        console.log(`Client connected: ${client.id}`);
    }

    handleDisconnect(client: Socket) {
        console.log(`Client disconnected: ${client.id}`);
    }

    // ----------------------
    // Entrar em uma conversa
    // ----------------------
    @SubscribeMessage('joinConversation')
    handleJoinConversation(
        @ConnectedSocket() client: Socket,
        @MessageBody() conversationId: number,
    ) {
        client.join(conversationId.toString());
        console.log(`Client ${client.id} entrou na conversa ${conversationId}`);
    }

    // ----------------------
    // Sair de uma conversa (opcional)
    // ----------------------
    @SubscribeMessage('leaveConversation')
    handleLeaveConversation(
        @ConnectedSocket() client: Socket,
        @MessageBody() conversationId: number,
    ) {
        client.leave(conversationId.toString());
        console.log(`Client ${client.id} saiu da conversa ${conversationId}`);
    }

    // ----------------------
    // Enviar mensagem
    // ----------------------
    @SubscribeMessage('sendMessage')
    async handleMessage(
        @ConnectedSocket() client: Socket,
        @MessageBody() payload: { conversationId: number; senderId: number; content: string },
    ) {
        console.log('Mensagem recebida no gateway:', payload);

        try {
            // salva no banco
            const message = await this.messageService.create({
                conversationId: payload.conversationId,
                senderId: payload.senderId,
                content: payload.content,
            });

            // envia para todos na room da conversa
            this.server.to(payload.conversationId.toString()).emit('message', message);

            // opcional: retorna ao socket que enviou (não é obrigatório)
            return message;
        } catch (error) {
            console.error('Erro ao salvar mensagem:', error);
            client.emit('errorMessage', { error: 'Não foi possível salvar a mensagem' });
        }
    }
}
