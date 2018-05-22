import { FileHandler } from './FileHandler';
/**
 * @author Maciej Chalapuk (maciej@chalapuk.pl)
 */
export declare class Builder {
    private _prefix;
    private _rotationBytesThreshold;
    construtor(): void;
    prefix(prefixArg: string): this;
    rotationBytesThreshold(thresholdArg: number): this;
    build(): FileHandler;
}
export default Builder;
