
import { Handler, Entry } from 'aono';

import * as fs from 'fs';
import { promisify } from 'util';
import { dirname } from 'path';

import { Builder } from './Builder';
import { Formatter } from './Formatter';
import { LogstashFormatter } from './LogstashFormatter';

const open = promisify(fs.open);
const write = promisify(fs.write);
const close = promisify(fs.close);
const exists = promisify(fs.exists);
const mkdir = promisify(fs.mkdir);

const HUNDRED_MEGS = 100 * 1024 * 1024;
const LOGSTASH_FORMATTER = new LogstashFormatter();

/**
 * @author Maciej Chalapuk (maciej@chalapuk.pl)
 */
export class FileHandler implements Handler {
  static builder() {
    return new Builder();
  }

  private _bytesWritten = 0;

  private _currentFile : string | null = null;
  private _currentFileSize = 0;
  private _fd : number;

  private _format : (entry : Entry) => string;

  constructor(readonly prefix : string,
              readonly formatter : Formatter  = LOGSTASH_FORMATTER,
              readonly rotationBytesThreshold : number = HUNDRED_MEGS) {
    this._format = this.formatter.format.bind(this.formatter);
  }

  get currentFile() {
    return this._currentFile;
  }
  get currentFileSize() {
    return this._currentFile ? this._currentFileSize : null;
  }
  get bytesWritten() {
    return this._bytesWritten;
  }

  async handle(entries : Entry[]) : Promise<void> {
    if (entries.length === 0) {
      return;
    }
    if (this.currentFile === null) {
      this._currentFile = this._createFilePath((entries[0] as Entry).timestamp);
      await ensureDirectoryExists(this._currentFile);
      this._fd = await open(this._currentFile, 'ax');
    }
    const serializedEntries = entries.map(this._format).join('');
    const result = await write(this._fd, serializedEntries);

    this._bytesWritten += result.bytesWritten;
    this._currentFileSize += result.bytesWritten;

    if (this._currentFileSize >= this.rotationBytesThreshold) {
      // New file will be created when handling next batch of entries.
      this._currentFile = null;
      this._currentFileSize = 0;
      await close(this._fd);
    }
  }

  private _createFilePath(timestamp : number) {
    return `${this.prefix}.${dateSuffix(new Date(timestamp))}`;
  }
}

export default FileHandler;

async function ensureDirectoryExists(filePath : string) {
  const dir = dirname(filePath);
  if (await exists(dir)) {
    return;
  }
  ensureDirectoryExists(dir);
  await mkdir(dir);
}

function dateSuffix(date : Date) {
  const iso = date.toISOString();
  return `${iso.slice(0, 10)}_${iso.slice(11, 23)}`;
}

