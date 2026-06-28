import { Socket } from "socket.io";
import { verifyAccessToken } from "../../utils/jwt";

export function socketAuthMiddleware(socket: Socket, next: (err?: Error) => void) {
  const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization?.replace("Bearer ", "");
  
  if (!token) {
    return next(new Error("Unauthorized: Token missing"));
  }

  try {
    const decoded = verifyAccessToken(token);
    socket.data.userId = decoded.userId;
    next();
  } catch (error) {
    next(new Error("Unauthorized: Invalid or expired token"));
  }
}
