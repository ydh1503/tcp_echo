import net from 'net';
import { readHeader, writeHeader } from './utils.js';
import { HANDLER_ID, MAX_MESSAGE_LENGTH, TOTAL_LENGTH_SIZE } from './constants.js';
import handlers from './handlers/index.js';

const PORT = 5555;

const server = net.createServer((socket) => {
  console.log(`Client connected: ${socket.remoteAddress}:${socket.remotePort}`);

  socket.on('data', (data) => {
    const buffer = Buffer.from(data); // slice 메서드로 헤더를 잘라내기 위함
    const { length, handlerId } = readHeader(buffer);
    console.log('length:', length, 'handlerId:', handlerId);

    if (length > MAX_MESSAGE_LENGTH) {
      console.error(`Error: Message length ${length}`);
      socket.write(`Error: Message too long`);
      socket.end();
      return;
    }

    const handler = handlers[handlerId];

    if (!handler) {
      console.error(`Error: No handler found for ID ${handlerId}`);
      socket.write(`Error: Invalid handler ID ${handlerId}`);
      socket.end();
      return;
    }

    const headerSize = TOTAL_LENGTH_SIZE + HANDLER_ID; // 6
    const message = buffer.slice(headerSize);

    console.log(`client 에게 받은 메세지: ${message}`); // console.log 시 buffer를 자동 변환 -> js 기본설정

    // const responseMessage = 'Hi, There';
    // const responseBuffer = Buffer.from(responseMessage);
    const responseBuffer = handler(message);

    const header = writeHeader(responseBuffer.length, handlerId);
    const packet = Buffer.concat([header, responseBuffer]);

    socket.write(packet);
  });

  socket.on('end', () => {
    console.log(`Client Disconnected: ${socket.remoteAddress}:${socket.remotePort}`);
  });

  socket.on('error', (err) => {
    console.log(`Socket error, ${err}`);
  });
});

server.listen(PORT, () => {
  console.log(`Echo Server listening on port ${PORT}`);
  console.log(server.address());
});
