
import { Entry } from 'aono';

import Builder from './Builder';
import LogstashFormatter from './LogstashFormatter'
import FileHandler from './FileHandler';

describe('Builder', () => {
  let testedBuilder : Builder;
  let testedHandler : FileHandler;

  beforeEach(() => {
    testedBuilder = new Builder();
  });

  describe('when built with default parameters', () => {
    beforeEach(() => {
      testedHandler = testedBuilder.build();
    });

    it('handler contains default prefix', () => {
      testedHandler.prefix.should.equal('./logs/configure-me.log');
    });
    it('handler contains default rotation threshold', () => {
      testedHandler.rotationBytesThreshold.should.equal(104857600);
    });
    it('handler contains default formatter', () => {
      testedHandler.formatter.should.be.instanceOf(LogstashFormatter);
    });
  });

  describe('when build with custom filePrefix', () => {
    const prefix = `./tmp/${new Date().getTime()}/test-`;
    const rotationThreshold = 123444;
    const formatter = { format: (entry : Entry) => 'test' };

    beforeEach(() => {
      testedHandler = testedBuilder
        .prefix(prefix)
        .rotationBytesThreshold(rotationThreshold)
        .formatter(formatter)
        .build()
      ;
    });

    it('contains properly set prefix', () => {
      testedHandler.prefix.should.equal(prefix);
    });
    it('contains properly set rotation threshold', () => {
      testedHandler.rotationBytesThreshold.should.equal(rotationThreshold);
    })
    it('contains properly set formatter', () => {
      testedHandler.formatter.should.equal(formatter);
    });
  });
});

