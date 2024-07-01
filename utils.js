import { HANDLER_ID, TOTAL_LENGTH_SIZE } from './constants.js';

export const readHeader = (buffer) => {
  // 빅인디안 -> 순서대로 읽기, 리틀인디안 -> 역순으로 읽기
  //   const length = buffer.readUInt32BE(0);
  //   const handlerId = buffer.readUInt16BE(TOTAL_LENGTH_SIZE);

  return {
    length: buffer.readUInt32BE(0),
    handlerId: buffer.readUInt16BE(TOTAL_LENGTH_SIZE),
  };
};

export const writeHeader = (length, handlerId) => {
  const headerSize = TOTAL_LENGTH_SIZE + HANDLER_ID; // 6
  const buffer = Buffer.alloc(headerSize);
  buffer.writeUInt32BE(length + headerSize, 0);
  buffer.writeUInt16BE(handlerId, TOTAL_LENGTH_SIZE);

  return buffer;
};
