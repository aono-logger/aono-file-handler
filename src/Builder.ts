
import { FileHandler } from './FileHandler';

const HUNDRED_MEGS = 100 * 1024 * 1024;

/**
 * @author Maciej Chalapuk (maciej@chalapuk.pl)
 */
export class Builder {
  private _prefix = './logs/configure-me.log';
  private _rotationBytesThreshold = HUNDRED_MEGS;

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

  build() : FileHandler {
    return new FileHandler(this._prefix, this._rotationBytesThreshold);
  }
}

export default Builder;

