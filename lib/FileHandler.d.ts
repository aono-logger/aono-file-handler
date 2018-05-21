import { Handler, Entry } from 'aono';
/**
 * @author Maciej Chalapuk (maciej@chalapuk.pl)
 */
export declare class FileHandler implements Handler {
    readonly prefix: string;
    private _bytesWritten;
    private _currentFile;
    private _fd;
    constructor(prefix: string);
    readonly currentFile: string | null;
    readonly bytesWritten: number;
    handle(entries: Entry[]): Promise<void>;
    private filePath(timestamp);
    private stringify(entry);
}
export default FileHandler;
