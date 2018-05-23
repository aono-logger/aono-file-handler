import { Entry } from 'aono';
/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export interface Formatter {
    format(entry: Entry): string;
}
export default Formatter;
