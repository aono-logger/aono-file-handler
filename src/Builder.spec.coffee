
Builder = require "./Builder"
  .Builder

describe "Builder", ->
  testedBuilder = null
  testedHandler = null

  beforeEach ->
    testedBuilder = new Builder

  describe "when built with default parameters", ->
    beforeEach ->
      testedHandler = testedBuilder.build()

    it "handler contains default parameters", ->
      testedHandler.prefix.should.equal "./logs/configure-me.log"

  describe "when build with custom filePrefix", ->
    prefix = "./tmp/#{new Date().getTime()}/test-"

    beforeEach ->
      testedHandler = testedBuilder
        .prefix prefix
        .build()

    it "contains properly set parameters", ->
      testedHandler.prefix.should.equal prefix

