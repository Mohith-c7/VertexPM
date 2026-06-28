import { Socket } from "socket.io";

export class RoomManager {
  static getWorkspaceRoom(workspaceId: string) {
    return `workspace:${workspaceId}`;
  }

  static getProjectRoom(projectId: string) {
    return `project:${projectId}`;
  }

  static getBoardRoom(boardId: string) {
    return `board:${boardId}`;
  }

  static joinWorkspace(socket: Socket, workspaceId: string) {
    const room = this.getWorkspaceRoom(workspaceId);
    socket.join(room);
    return room;
  }

  static leaveWorkspace(socket: Socket, workspaceId: string) {
    socket.leave(this.getWorkspaceRoom(workspaceId));
  }

  static joinProject(socket: Socket, projectId: string) {
    const room = this.getProjectRoom(projectId);
    socket.join(room);
    return room;
  }

  static leaveProject(socket: Socket, projectId: string) {
    socket.leave(this.getProjectRoom(projectId));
  }

  static joinBoard(socket: Socket, boardId: string) {
    const room = this.getBoardRoom(boardId);
    socket.join(room);
    return room;
  }

  static leaveBoard(socket: Socket, boardId: string) {
    socket.leave(this.getBoardRoom(boardId));
  }
}
