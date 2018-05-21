
import { FileHandler } from './FileHandler';

/**
 * @author Maciej Chalapuk (maciej@chalapuk.pl)
 */
export class Builder {
  private _prefix : string = './logs/configure-me.log';

  construtor() {
  }

  prefix(prefixArg : string) : this {
    this._prefix = prefixArg;
    return this;
  }

  build() : FileHandler {
    return new FileHandler(this._prefix);
  }
}

export default Builder;

