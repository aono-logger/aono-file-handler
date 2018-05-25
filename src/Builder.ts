
import { FileHandler } from './FileHandler';
import { Formatter } from './Formatter';
import { LogstashFormatter } from './LogstashFormatter';

const HUNDRED_MEGS = 100 * 1024 * 1024;
const LOGSTASH_FORMATTER = new LogstashFormatter();

/**
 * @author Maciej Chalapuk (maciej@chalapuk.pl)
 */
export class Builder {
  private _prefix : string = './logs/configure-me.log';
  private _rotationBytesThreshold : number = HUNDRED_MEGS;
  private _formatter : Formatter = LOGSTASH_FORMATTER;

  construtor() {
  }

  prefix(prefixArg : string) : this {
    this._prefix = prefixArg;
    return this;
  }
  rotationBytesThreshold(thresholdArg : number) : this {
    this._rotationBytesThreshold = thresholdArg;
    return this;
  }
  formatter(formatterArg : Formatter) : this {
    this._formatter = formatterArg;
    return this;
  }

  build() : FileHandler {
    return new FileHandler(
      this._prefix,
      this._rotationBytesThreshold,
      this._formatter
    );
  }
}

export default Builder;

