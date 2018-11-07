
import { Entry } from 'aono';

import { Formatter } from './Formatter';

/**
 * @author Maciej Chałapuk (maciej@chalapuk.pl)
 */
export class LogstashFormatter implements Formatter {
  constructor(readonly consts : any = {}) {
  }
  format(entry : Entry) {
    const date = new Date();
    date.setTime(entry.timestamp);
    const formattedDate = date.toISOString();

    const message = '{ '+
      `"timestamp": ${safeJsonStringify(formattedDate)}, `+
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

    const entityEncoded = message.replace(/[\u00A0-\u9999<>\&]/gim, i => `&#${i.charCodeAt(0)};`);
    return entityEncoded;
  }
}

export default LogstashFormatter;

function safeJsonStringify(obj : any) {
  try {
    if (obj instanceof Error && obj.stack) {
      // Errors are stringified to arrays containing stack trace
      // which will render nicely in Kibana.
      return JSON.stringify(obj.stack.split('\n'));
    } else {
      return JSON.stringify(obj);
    }
  } catch(e) {
    return `["### Error while stringifying object of type ${typeof obj} ###","${e.message}"]`
  }
}

