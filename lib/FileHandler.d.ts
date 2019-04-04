import { Handler, Entry } from 'aono';
import { Builder } from './Builder';
import { Formatter } from './Formatter';
/**
 * @author Maciej Chalapuk (maciej@chalapuk.pl)
 */
export declare class FileHandler implements Handler {
    readonly prefix: string;
    readonly formatter: Formatter;
    readonly rotationBytesThreshold: number;
    static builder(): Builder;
    private _bytesWritten;
    private _currentFile;
    private _currentFileSize;
    private _fd;
    private _format;
    constructor(prefix: string, formatter?: Formatter, rotationBytesThreshold?: number);
    readonly currentFile: string | null;
    readonly currentFileSize: number | null;
    readonly bytesWritten: number;
    handle(entries: Entry[]): Promise<void>;
    private _createFilePath;
}
export default FileHandler;
