
import { Entry } from 'aono';

import LogstashFormatter from './LogstashFormatter';

describe('LogstashFormatter', () => {
  let testedFormatter : LogstashFormatter;

  describe('when created without any consts', () => {
    beforeEach(() => {
      testedFormatter = new LogstashFormatter('test_');
    });

    it('contains no consts', () => {
      testedFormatter.consts.should.eql({});
    });

    it('formats an entry without meta', () => {
      const entry : Entry = {
        timestamp: 0,
        logger: 'test',
        level: 'info',
        message: 'hello, file!',
        meta: {},
      };

      const formatted = testedFormatter.format(entry);

      formatted.should.equal('{ '+
        '"timestamp": "1970-01-01T00:00:00.000Z", '+
        '"logger": "test", '+
        '"level": "info", '+
        '"message": "hello, file!"'+
        ' }\n')
      ;
    });

    it('formats an entry with meta', () => {
      const entry : Entry = {
        timestamp: 0,
        logger: 'test',
        level: 'debug',
        message: 'hello, file!',
        meta: {
          number: 1,
        },
      };

      const formatted = testedFormatter.format(entry);

      formatted.should.equal('{ '+
        '"timestamp": "1970-01-01T00:00:00.000Z", '+
        '"logger": "test", '+
        '"level": "debug", '+
        '"message": "hello, file!", '+
        '"test_number": 1'+
        ' }\n')
      ;
    });

    it('formats an entry with Error in meta', () => {
      const entry : Entry = {
        timestamp: 0,
        logger: 'test',
        level: 'trace',
        message: 'hello, file!',
        meta: {
          error: new Error(),
        },
      };
      (entry.meta as any).error.stack = 'a\na\na';

      const formatted = testedFormatter.format(entry);

      formatted.should.equal('{ '+
        '"timestamp": "1970-01-01T00:00:00.000Z", '+
        '"logger": "test", '+
        '"level": "trace", '+
        '"message": "hello, file!", '+
        '"test_error": ["a","a","a"]'+
        ' }\n')
      ;
    });

    it('formats an entry containing utf character', () => {
      const entry : Entry = {
        timestamp: 10,
        logger: 'test',
        level: 'warn',
        message: '☃',
        meta: {},
      };

      const formatted = testedFormatter.format(entry);

      formatted.should.equal('{ '+
        '"timestamp": "1970-01-01T00:00:00.010Z", '+
        '"logger": "test", '+
        '"level": "warn", '+
        '"message": "\\u2603"'+
        ' }\n')
      ;
    });
  });

  describe('when created with some consts', () => {
    const consts = {
      author: 'Maciej',
    };

    beforeEach(() => {
      testedFormatter = new LogstashFormatter('test_', consts);
    });

    it('contains proper consts', () => {
      testedFormatter.consts.should.eql(consts);
    });

    it('formats an entry without meta', () => {
      const entry : Entry = {
        timestamp: 0,
        logger: 'test',
        level: 'error',
        message: 'hello, file!',
        meta: {},
      };

      const formatted = testedFormatter.format(entry);

      formatted.should.equal('{ '+
        '"timestamp": "1970-01-01T00:00:00.000Z", '+
        '"logger": "test", '+
        '"level": "error", '+
        '"message": "hello, file!", '+
        '"author": "Maciej"'+
        ' }\n')
      ;
    });

    it('formats an entry with meta', () => {
      const entry : Entry = {
        timestamp: 0,
        logger: 'test',
        level: 'info',
        message: 'hello, file!',
        meta: {
          number: 1,
        },
      };

      const formatted = testedFormatter.format(entry);

      formatted.should.equal('{ '+
        '"timestamp": "1970-01-01T00:00:00.000Z", '+
        '"logger": "test", '+
        '"level": "info", '+
        '"message": "hello, file!", '+
        '"author": "Maciej", '+
        '"test_number": 1'+
        ' }\n')
      ;
    });
  });
});

