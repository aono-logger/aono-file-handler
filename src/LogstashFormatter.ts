
import { Entry } from 'aono';

import { Formatter } from './Formatter';

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export class LogstashFormatter implements Formatter {
  constructor(readonly consts : any = {}) {
  }
  format(entry : Entry) {
    return '{ '+
      `"timestamp": ${entry.timestamp}, `+
      `"logger": ${safeJsonStringify(entry.logger)}, `+
      `"level": ${safeJsonStringify(entry.level)}, `+
      `"message": ${safeJsonStringify(entry.message)}`+
      Object.keys(this.consts)
        .map(key => `, "${key}": ${safeJsonStringify(this.consts[key])}`)
        .join('')+
      Object.keys(entry.meta)
        .map(key => `, "»${key}": ${safeJsonStringify(entry.meta[key])}`)
        .join('')+
      ' }\n';
  }
}

export default LogstashFormatter;

function safeJsonStringify(obj : any) {
  try {
    return JSON.stringify(obj);
  } catch(e) {
    return `"### Error while stringifying object of type ${typeof obj}: ${e.message}"`
  }
}

