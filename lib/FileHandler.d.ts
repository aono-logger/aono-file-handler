import { Handler, Entry } from 'aono';
import { Builder } from './Builder';
import { Formatter } from './Formatter';
/**
 * @author Maciej Chalapuk (maciej@chalapuk.pl)
 */
export declare class FileHandler implements Handler {
    readonly prefix: string;
    readonly rotationBytesThreshold: number;
    readonly formatter: Formatter;
    static builder(): Builder;
    private _bytesWritten;
    private _currentFile;
    private _currentFileSize;
    private _fd;
    private _format;
    constructor(prefix: string, rotationBytesThreshold?: number, formatter?: Formatter);
    readonly currentFile: string | null;
    readonly currentFileSize: number;
    readonly bytesWritten: number;
    handle(entries: Entry[]): Promise<void>;
    private _createFilePath(timestamp);
}
export default FileHandler;
