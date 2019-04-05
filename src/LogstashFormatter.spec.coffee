
LogstashFormatter = require "./LogstashFormatter"
  .LogstashFormatter

describe "LogstashFormatter", ->
  testedFormatter = null

  describe "when created without any consts", ->
    beforeEach ->
      testedFormatter = new LogstashFormatter "test_"

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
        '"timestamp": "1970-01-01T00:00:00.000Z", '+
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
        '"timestamp": "1970-01-01T00:00:00.000Z", '+
        '"logger": "test", '+
        '"level": "good", '+
        '"message": "hello, file!", '+
        '"test_number": 1'+
      ' }\n'

    it "formats an entry with Error in meta", ->
      entry =
        timestamp: 0
        logger: "test"
        level: "good"
        message: "hello, file!"
        meta:
          error: new Error
      entry.meta.error.stack = "a\na\na"

      formatted = testedFormatter.format entry

      formatted.should.equal '{ '+
        '"timestamp": "1970-01-01T00:00:00.000Z", '+
        '"logger": "test", '+
        '"level": "good", '+
        '"message": "hello, file!", '+
        '"test_error": ["a","a","a"]'+
      ' }\n'

    it "formats an entry containing utf character", ->
      entry =
        timestamp: 10
        logger: "test"
        level: "good"
        message: "☃"
        meta: {}

      formatted = testedFormatter.format entry

      formatted.should.equal '{ '+
        '"timestamp": "1970-01-01T00:00:00.010Z", '+
        '"logger": "test", '+
        '"level": "good", '+
        '"message": "\\u2603"'+
      ' }\n'

  describe "when created with some consts", ->
    consts = author: "Maciej"

    beforeEach ->
      testedFormatter = new LogstashFormatter "test_", consts

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
        '"timestamp": "1970-01-01T00:00:00.000Z", '+
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
        '"timestamp": "1970-01-01T00:00:00.000Z", '+
        '"logger": "test", '+
        '"level": "good", '+
        '"message": "hello, file!", '+
        '"author": "Maciej", '+
        '"test_number": 1'+
      ' }\n'

