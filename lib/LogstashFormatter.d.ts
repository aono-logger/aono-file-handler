import { Entry } from 'aono';
import { Formatter } from './Formatter';
/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export declare class LogstashFormatter implements Formatter {
    readonly consts: any;
    constructor(consts?: any);
    format(entry: Entry): string;
}
export default LogstashFormatter;
