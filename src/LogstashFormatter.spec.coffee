
LogstashFormatter = require "./LogstashFormatter"
  .LogstashFormatter

describe "LogstashFormatter", ->
  testedFormatter = null

  describe "when created without any consts", ->
    beforeEach ->
      testedFormatter = new LogstashFormatter

    it "contains no consts", ->
      testedFormatter.consts.should.eql {}

    it "formats an entry without meta", ->
      entry =
        timestamp: 0
        logger: "test"
        level: "good"
        message: "hello, file!"
        meta: {}

      formatted = testedFormatter.format entry

      formatted.should.equal '{ '+
        '"timestamp": 0, '+
        '"logger": "test", '+
        '"level": "good", '+
        '"message": "hello, file!"'+
      ' }\n'

    it "formats an entry with meta", ->
      entry =
        timestamp: 0
        logger: "test"
        level: "good"
        message: "hello, file!"
        meta:
          number: 1

      formatted = testedFormatter.format entry

      formatted.should.equal '{ '+
        '"timestamp": 0, '+
        '"logger": "test", '+
        '"level": "good", '+
        '"message": "hello, file!", '+
        '"»number": 1'+
      ' }\n'

  describe "when created with some consts", ->
    consts = author: "Maciej"

    beforeEach ->
      testedFormatter = new LogstashFormatter consts

    it "contains proper consts", ->
      testedFormatter.consts.should.eql consts

    it "formats an entry without meta", ->
      entry =
        timestamp: 0
        logger: "test"
        level: "good"
        message: "hello, file!"
        meta: {}

      formatted = testedFormatter.format entry

      formatted.should.equal '{ '+
        '"timestamp": 0, '+
        '"logger": "test", '+
        '"level": "good", '+
        '"message": "hello, file!", '+
        '"author": "Maciej"'+
      ' }\n'

    it "formats an entry with meta", ->
      entry =
        timestamp: 0
        logger: "test"
        level: "good"
        message: "hello, file!"
        meta:
          number: 1

      formatted = testedFormatter.format entry

      formatted.should.equal '{ '+
        '"timestamp": 0, '+
        '"logger": "test", '+
        '"level": "good", '+
        '"message": "hello, file!", '+
        '"author": "Maciej", '+
        '"»number": 1'+
      ' }\n'

