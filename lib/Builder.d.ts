import { FileHandler } from './FileHandler';
import { Formatter } from './Formatter';
/**
 * @author Maciej Chalapuk (maciej@chalapuk.pl)
 */
export declare class Builder {
    private _prefix;
    private _rotationBytesThreshold;
    private _formatter;
    construtor(): void;
    prefix(prefixArg: string): this;
    rotationBytesThreshold(thresholdArg: number): this;
    formatter(formatterArg: Formatter): this;
    build(): FileHandler;
}
export default Builder;
