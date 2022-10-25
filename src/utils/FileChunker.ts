import assert from 'assert';

import fs from 'fs-extra';

export class FileChunker {
  filePath: string;
  chunkSize: number;
  fileDescriptor: any;
  fileSize: any;
  nextChunkNumber: number;
  isFinished: boolean;
  constructor({ filePath, chunkSize }) {
    assert(
      typeof chunkSize === 'number',
      `chunkSize ${chunkSize} is not a number`
    );
    assert(
      typeof filePath === 'string',
      `filePath ${filePath} is not a string`
    );
    this.filePath = filePath;
    this.chunkSize = chunkSize;
    this.fileDescriptor = fs.openSync(filePath, 'r');
    this.fileSize = fs.statSync(filePath).size;
    this.nextChunkNumber = 0;
    this.isFinished = false;
  }

  getChunk(chunkNumber) {
    assert(
      typeof chunkNumber === 'number',
      `chunk number ${chunkNumber} is not a number`
    );
    const chunk = Buffer.alloc(this.chunkSize);
    const offset = 0;
    const length = this.chunkSize;
    const position = this.chunkSize * chunkNumber;
    const bytesRead = fs.readSync(
      this.fileDescriptor,
      chunk,
      offset,
      length,
      position
    );
    if (bytesRead !== this.chunkSize) {
      this.isFinished = true;
      return chunk.slice(0, bytesRead);
    }
    return chunk;
  }

  getNextChunk() {
    return this.getChunk(this.nextChunkNumber++);
  }

  getLastChunkOffset() {
    if (this.nextChunkNumber === 0) {
      return 0;
    }
    const lastChunkOffset = (this.nextChunkNumber - 1) * this.chunkSize;
    if (lastChunkOffset > this.fileSize) {
      return this.fileSize;
    }
    return lastChunkOffset;
  }

  close() {
    fs.closeSync(this.fileDescriptor);
  }
}
