import { Handler, Entry } from 'aono';
/**
 * @author Maciej Chalapuk (maciej@chalapuk.pl)
 */
export declare class FileHandler implements Handler {
    readonly prefix: string;
    readonly rotationBytesThreshold: number;
    private _bytesWritten;
    private _currentFile;
    private _currentFileSize;
    private _fd;
    constructor(prefix: string, rotationBytesThreshold?: number);
    readonly currentFile: string | null;
    readonly currentFileSize: number;
    readonly bytesWritten: number;
    handle(entries: Entry[]): Promise<void>;
    private filePath(timestamp);
    private stringify(entry);
}
export default FileHandler;
