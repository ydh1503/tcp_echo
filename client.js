import net from 'net';
import { readHeader, writeHeader } from './utils.js';
import { HANDLER_ID, TOTAL_LENGTH_SIZE } from './constants.js';

const HOST = 'localHost';
const PORT = 5555;

const client = new net.Socket();

client.connect(PORT, HOST, () => {
  console.log('Connected to the Server...');

  const message = 'Hello';
  const buffer = Buffer.from(message);

  //   const longMessage = 'V'.repeat(1024);
  //   const buffer = Buffer.from(longMessage);

  const header = writeHeader(buffer.length, 11);
  const packet = Buffer.concat([header, buffer]);

  client.write(packet);
});

client.on('data', (data) => {
  const buffer = Buffer.from(data); // slice 메서드로 헤더를 잘라내기 위함
  const { length, handlerId } = readHeader(buffer);
  console.log('length:', length, 'handlerId:', handlerId);

  const headerSize = TOTAL_LENGTH_SIZE + HANDLER_ID; // 6
  const message = buffer.slice(headerSize);

  console.log(`server 에게 받은 메세지: ${message}`);
});

client.on('close', () => {
  console.log(`Connection closed`);
});

client.on('error', (err) => {
  console.log(`Client error, ${err}`);
});
