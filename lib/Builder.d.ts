import { FileHandler } from './FileHandler';
/**
 * @author Maciej Chalapuk (maciej@chalapuk.pl)
 */
export declare class Builder {
    private _prefix;
    construtor(): void;
    prefix(prefixArg: string): this;
    build(): FileHandler;
}
export default Builder;
