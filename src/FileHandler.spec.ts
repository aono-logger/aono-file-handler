
import * as fs from 'fs';
import * as util from 'util';
import { glob } from 'glob';

import * as should from 'should';

import { Entry } from 'aono';

import FileHandler from './FileHandler';
import LogstashFormatter from './LogstashFormatter';

describe('FileHandler', () => {
  const prefix = '/tmp/aono-file-handler/test.log';

  let testedHandler : FileHandler;

  beforeEach(done => {
    glob(`${prefix}*`)
      .then(files => {
        files.forEach(file => fs.unlinkSync(file));
        done();
      }).catch(err => {
        done(err)
      })
    ;
  });

  describe('after creation', () => {
    beforeEach(() => {
      testedHandler = new FileHandler(prefix);
    });

    it('contains passed parameters', () => {
      testedHandler.prefix.should.equal(prefix);
    });
    it('contains default rotation threshold', () => {
      testedHandler.rotationBytesThreshold.should.equal(104857600);
    });

    it('contains null currentFile', () => {
      should(testedHandler.currentFile).equal(null);
    });
    it('contains zeroed currentFileSize', () => {
      should(testedHandler.currentFileSize).equal(null);
    });
    it('contains zero bytesWritten', () => {
      testedHandler.bytesWritten.should.equal(0);
    });

    describe('when after handling log entry without data', () => {
      const entry : Entry = {
        timestamp: 0,
        logger: 'test',
        level: 'info',
        message: 'hello, file!',
        data: {},
      };

      beforeEach(() => {
        return testedHandler.write([ entry ]);
      });

      it('contains properly set currentFile', () => {
        should(testedHandler.currentFile).equal(`${prefix}.1970-01-01_00:00:00.000`);
      });
      it('contains properly set currentFileSize', () => {
        should(testedHandler.currentFileSize).equal(106);
      });
      it('contains properly set bytesWritten', () => {
        testedHandler.bytesWritten.should.equal(106);
      });

      it('wrote log entry to a log file', () => {
        const contents = fs.readFileSync(testedHandler.currentFile as string)
          .toString('utf-8')
        ;
        contents.should.equal('{ '+
          '"timestamp": "1970-01-01T00:00:00.000Z", '+
          '"logger": "test", '+
          '"level": "info", '+
          '"message": "hello, file!"'+
          ' }\n')
        ;
      });
    });

    describe('when after handling log entry with data', () => {
      const entry : Entry = {
        timestamp: 0,
        logger: 'test',
        level: 'info',
        message: 'hello, file!',
        data: {
          number: 1,
        },
      };

      beforeEach(() => {
        return testedHandler.write([ entry ]);
      });

      it('contains properly set currentFile', () => {
        should(testedHandler.currentFile).equal(`${prefix}.1970-01-01_00:00:00.000`);
      });
      it('contains properly set currentFileSize', () => {
        should(testedHandler.currentFileSize).equal(124);
      });
      it('contains properly set bytesWritten', () => {
        testedHandler.bytesWritten.should.equal(124);
      });

      it('wrote log entry to a log file', () => {
        const contents = fs.readFileSync(testedHandler.currentFile as string)
          .toString('utf-8')
        ;
        contents.should.equal('{ '+
          '"timestamp": "1970-01-01T00:00:00.000Z", '+
          '"logger": "test", '+
          '"level": "info", '+
          '"message": "hello, file!", '+
          '"data_number": 1'+
          ' }\n'
        );
      });
    });
  });

  describe('after creation with small rotation threshold', () => {
    const smallThreshold = 16;

    beforeEach(() => {
      testedHandler = new FileHandler(prefix, new LogstashFormatter(), smallThreshold);
    });

    it('contains properly set rotation threshold', () => {
      testedHandler.rotationBytesThreshold.should.equal(smallThreshold);
    });

    describe('when after handling first log entry', () => {
      const entry0 : Entry = {
        timestamp: 0,
        logger: 'test',
        level: 'info',
        message: 'hello, file!',
        data: {},
      };

      beforeEach(() => {
        return testedHandler.write([ entry0 ]);
      });

      it('contains null currentFile', () => {
        should(testedHandler.currentFile).equal(null);
      });
      it('contains zeroed currentFileSize', () => {
        should(testedHandler.currentFileSize).equal(null);
      });

      describe('and after adding second log entry', () => {
        const entry1 : Entry = {
          timestamp: 1,
          logger: 'test',
          level: 'error',
          message: 'it\'s you again',
          data: {},
        };

        beforeEach(() => {
          return testedHandler.write([ entry1 ]);
        });

        it('contains null currentFile', () => {
          should(testedHandler.currentFile).equal(null);
        });
        it('contains zeroed currentFileSize', () => {
          should(testedHandler.currentFileSize).equal(null);
        });

        it('contains properly set bytesWritten', () => {
          testedHandler.bytesWritten.should.equal(215);
        });

        it('wrote first log entry to first file', () => {
          const contents = fs.readFileSync(`${prefix}.1970-01-01_00:00:00.000`)
            .toString('utf-8')
          ;
          contents.should.equal('{ '+
            '"timestamp": "1970-01-01T00:00:00.000Z", '+
            '"logger": "test", '+
            '"level": "info", '+
            '"message": "hello, file!"'+
            ' }\n')
          ;
        });

        it('wrote second log entry to second file', () => {
          const contents = fs.readFileSync(`${prefix}.1970-01-01_00:00:00.001`)
            .toString('utf-8')
          ;
          contents.should.equal('{ '+
            '"timestamp": "1970-01-01T00:00:00.001Z", '+
            '"logger": "test", '+
            '"level": "error", '+
            '"message": "it\'s you again"'+
            ' }\n')
          ;
        });
      });
    });
  });
});

