
fs = require "fs"
util = require "util"
glob = util.promisify require "glob"

FileHandler = require "./FileHandler"
  .FileHandler

describe "FileHandler", ->
  testedHandler = null

  describe "after creation", ->
    prefix = "/tmp/aono-file-handler/test.log"

    beforeEach ->
      testedHandler = new FileHandler prefix
      glob "#{prefix}*"
        .then (files) -> files.forEach (file) -> fs.unlinkSync file

    it "contains passed parameters", ->
      testedHandler.prefix.should.equal prefix
    it "contains properly set bytesWritten", ->
      testedHandler.bytesWritten.should.equal 0

    describe "when after handling log entry", ->
      entry =
        timestamp: 0
        logger: "test"
        level: "good"
        message: "hello, file!"
        meta:
          number: 1

      beforeEach ->
        testedHandler.handle [ entry ]

      it "contains properly set currentFile", ->
        testedHandler.currentFile.should.equal "#{prefix}.1970-01-01_00:00:00.000"

      it "contains properly set bytesWritten", ->
        testedHandler.bytesWritten.should.equal 97

      it "wrote log entry to a log file", ->
        contents = fs.readFileSync testedHandler.currentFile
          .toString "utf-8"
        contents.should.equal '{ '+
          '"@timestamp": 0, '+
          '"logger": "test", '+
          '"level": "good", '+
          '"message": "hello, file!", '+
          '"»number": 1'+
        ' }\n'

