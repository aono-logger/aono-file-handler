
fs = require "fs"
util = require "util"
glob = util.promisify require "glob"

FileHandler = require "./FileHandler"
  .FileHandler
LogstashFormatter = require "./LogstashFormatter"
  .LogstashFormatter

describe "FileHandler", ->
  prefix = "/tmp/aono-file-handler/test.log"

  testedHandler = null

  beforeEach ->
    glob "#{prefix}*"
      .then (files) -> files.forEach (file) -> fs.unlinkSync file

  describe "after creation", ->
    beforeEach ->
      testedHandler = new FileHandler prefix

    it "contains passed parameters", ->
      testedHandler.prefix.should.equal prefix
    it "contains default rotation threshold", ->
      testedHandler.rotationBytesThreshold.should.equal 104857600

    it "contains null currentFile", ->
      (should testedHandler.currentFile).equal null
    it "contains zeroed currentFileSize", ->
      (should testedHandler.currentFileSize).equal null
    it "contains zero bytesWritten", ->
      testedHandler.bytesWritten.should.equal 0

    describe "when after handling log entry without meta", ->
      entry =
        timestamp: 0
        logger: "test"
        level: "good"
        message: "hello, file!"
        meta: {}

      beforeEach ->
        testedHandler.write [ entry ]

      it "contains properly set currentFile", ->
        testedHandler.currentFile.should.equal "#{prefix}.1970-01-01_00:00:00.000"
      it "contains properly set currentFileSize", ->
        testedHandler.currentFileSize.should.equal 106
      it "contains properly set bytesWritten", ->
        testedHandler.bytesWritten.should.equal 106

      it "wrote log entry to a log file", ->
        contents = fs.readFileSync testedHandler.currentFile
          .toString "utf-8"
        contents.should.equal '{ '+
          '"timestamp": "1970-01-01T00:00:00.000Z", '+
          '"logger": "test", '+
          '"level": "good", '+
          '"message": "hello, file!"'+
        ' }\n'

    describe "when after handling log entry with meta", ->
      entry =
        timestamp: 0
        logger: "test"
        level: "good"
        message: "hello, file!"
        meta:
          number: 1

      beforeEach ->
        testedHandler.write [ entry ]

      it "contains properly set currentFile", ->
        testedHandler.currentFile.should.equal "#{prefix}.1970-01-01_00:00:00.000"
      it "contains properly set currentFileSize", ->
        testedHandler.currentFileSize.should.equal 124
      it "contains properly set bytesWritten", ->
        testedHandler.bytesWritten.should.equal 124

      it "wrote log entry to a log file", ->
        contents = fs.readFileSync testedHandler.currentFile
          .toString "utf-8"
        contents.should.equal '{ '+
          '"timestamp": "1970-01-01T00:00:00.000Z", '+
          '"logger": "test", '+
          '"level": "good", '+
          '"message": "hello, file!", '+
          '"aono_number": 1'+
        ' }\n'

  describe "after creation with small rotation threshold", ->
    smallThreshold = 16

    beforeEach ->
      testedHandler = new FileHandler prefix, new LogstashFormatter, smallThreshold

    it "contains properly set rotation threshold", ->
      testedHandler.rotationBytesThreshold.should.equal smallThreshold

    describe "when after handling first log entry", ->
      entry0 =
        timestamp: 0
        logger: "test"
        level: "good"
        message: "hello, file!"
        meta: {}

      beforeEach ->
        testedHandler.write [ entry0 ]

      it "contains null currentFile", ->
        (should testedHandler.currentFile).equal null
      it "contains zeroed currentFileSize", ->
        (should testedHandler.currentFileSize).equal null

      describe "and after adding second log entry", ->
        entry1 =
          timestamp: 1
          logger: "test"
          level: "bad"
          message: "it's you again"
          meta: {}

        beforeEach ->
          testedHandler.write [ entry1 ]

        it "contains null currentFile", ->
          (should testedHandler.currentFile).equal null
        it "contains zeroed currentFileSize", ->
          (should testedHandler.currentFileSize).equal null

        it "contains properly set bytesWritten", ->
          testedHandler.bytesWritten.should.equal 213

        it "wrote first log entry to first file", ->
          contents = fs.readFileSync "#{prefix}.1970-01-01_00:00:00.000"
            .toString "utf-8"
          contents.should.equal '{ '+
            '"timestamp": "1970-01-01T00:00:00.000Z", '+
            '"logger": "test", '+
            '"level": "good", '+
            '"message": "hello, file!"'+
          ' }\n'

        it "wrote second log entry to second file", ->
          contents = fs.readFileSync "#{prefix}.1970-01-01_00:00:00.001"
            .toString "utf-8"
          contents.should.equal '{ '+
            '"timestamp": "1970-01-01T00:00:00.001Z", '+
            '"logger": "test", '+
            '"level": "bad", '+
            '"message": "it\'s you again"'+
          ' }\n'

