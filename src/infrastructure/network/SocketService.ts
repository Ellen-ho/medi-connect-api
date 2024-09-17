import { ISocketService } from '../../domain/interface/network/ISocketService'
import { Server, Socket } from 'socket.io'

class SocketService implements ISocketService {
  private readonly io: Server
  private readonly userSockets: Map<string, string>

  constructor(server: Server) {
    this.io = server
    this.userSockets = new Map()

    this.io.on('connection', (socket: Socket) => {
      const userId = socket.handshake.query.userId as string
      this.userSockets.set(userId, socket.id)

      socket.on('disconnect', () => {
        this.userSockets.delete(userId)
      })
    })
  }

  sendToUser(userId: string, event: string, message: any): void {
    const socketId = this.userSockets.get(userId)
    if (socketId != null) {
      this.io.to(socketId).emit(event, message)
    }
  }
}

export default SocketService
