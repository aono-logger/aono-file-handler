
import { Handler, Entry } from 'aono';

import * as fs from 'fs';
import { promisify } from 'util';
import { dirname } from 'path';

const open = promisify(fs.open);
const write = promisify(fs.write);
const close = promisify(fs.close);
const exists = promisify(fs.exists);
const mkdir = promisify(fs.mkdir);

const HUNDRED_MEGS = 100 * 1024 * 1024;

/**
 * @author Maciej Chalapuk (maciej@chalapuk.pl)
 */
export class FileHandler implements Handler {
  private _bytesWritten = 0;

  private _currentFile : string | null = null;
  private _currentFileSize = 0;
  private _fd : number;

  constructor(readonly prefix : string, readonly rotationBytesThreshold = HUNDRED_MEGS) {
    this.stringify = this.stringify.bind(this);
  }

  get currentFile() {
    return this._currentFile;
  }
  get currentFileSize() {
    return this._currentFileSize;
  }
  get bytesWritten() {
    return this._bytesWritten;
  }

  async handle(entries : Entry[]) : Promise<void> {
    if (entries.length === 0) {
      return;
    }
    if (this.currentFile === null) {
      this._currentFile = this.filePath((entries[0] as Entry).timestamp);
      await ensureDirectoryExists(this._currentFile);
      this._fd = await open(this._currentFile, 'ax');
    }
    const serializedEntries = entries.map(this.stringify).join('');
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

  private filePath(timestamp : number) {
    return `${this.prefix}.${format(new Date(timestamp))}`;
  }

  private stringify(entry : Entry) {
    return '{ '+
      `"@timestamp": ${entry.timestamp}, `+
      `"logger": "${entry.logger}", `+
      `"level": ${safeJsonStringify(entry.level)}, `+
      `"message": "${entry.message}"`+
      Object.keys(entry.meta)
        .map(key => `, "»${key}": ${safeJsonStringify(entry.meta[key])}`)
        .join('')+
      ' }\n';
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

function format(date : Date) {
  const iso = date.toISOString();
  return `${iso.slice(0, 10)}_${iso.slice(11, 23)}`;
}

function safeJsonStringify(obj : any) {
  try {
    return JSON.stringify(obj);
  } catch(e) {
    return `"### Error while stringifying object of type ${typeof obj}: ${e.message}"`
  }
}

