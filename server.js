import { WebSocketServer } from "ws";
import { stringUtils } from "./utils/index.js";

let server = new WebSocketServer({ port: process.env.PORT || 3000 });
let rooms = {};

const createRoom = (clientSocket) => {
  const roomId = stringUtils.genRandomID();
  rooms[roomId] = [clientSocket];

  keepSocketAlive(clientSocket);
  stringifyAndSend(clientSocket, { data: roomId });
};

const checkRoomsAndJoin = (clientSocket, { roomId }) => {
  if (roomDontExists(roomId))
    return stringifyAndSend(clientSocket, { error: "sala não encontrada" });

  joinRoom(clientSocket, roomId);
};

const joinRoom = (clientSocket, roomId) => {
  rooms[roomId].push(clientSocket);
  keepSocketAlive(clientSocket);

  const userId = stringUtils.genRandomID();
  stringifyAndSend(clientSocket, { data: userId });
};

const leaveRoom = (clientSocket, { roomId }) => {
  rooms[roomId] = rooms[roomId].filter(
    (roomSocket) => roomSocket !== clientSocket
  );

  if (roomIsEmpty(roomId)) closeRoom(roomId);
};

const sendMessage = (clientSocket, event) => {
  const { roomId, ...message } = event;

  rooms[roomId].forEach((clientSocket) =>
    stringifyAndSend(clientSocket, message)
  );
};

const roomIsEmpty = (roomId) => rooms[roomId].length == 0;
const roomDontExists = (roomId) => !Object.keys(rooms).includes(roomId);
const closeRoom = (roomId) => delete rooms[roomId];
const stringifyAndSend = (socket, obj) => socket.send(JSON.stringify(obj));
const keepSocketAlive = (clientSocket) =>
  (clientSocket._socket.server.keepAlive = true);

const EVENT_TYPES = {
  create: createRoom,
  join: checkRoomsAndJoin,
  leave: leaveRoom,
  message: sendMessage,
};

server.on("connection", (clientSocket) => {
  clientSocket.on("message", (message) => {
    const event = JSON.parse(message);
    EVENT_TYPES[event.type](clientSocket, event);
  });
});
