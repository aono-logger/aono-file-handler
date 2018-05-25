
Builder = require "./Builder"
  .Builder
LogstashFormatter = require "./LogstashFormatter"
  .LogstashFormatter

describe "Builder", ->
  testedBuilder = null
  testedHandler = null

  beforeEach ->
    testedBuilder = new Builder

  describe "when built with default parameters", ->
    beforeEach ->
      testedHandler = testedBuilder.build()

    it "handler contains default prefix", ->
      testedHandler.prefix.should.equal "./logs/configure-me.log"
    it "handler contains default rotation threshold", ->
      testedHandler.rotationBytesThreshold.should.equal 104857600
    it "handler contains default formatter", ->
      testedHandler.formatter.should.be.instanceOf LogstashFormatter

  describe "when build with custom filePrefix", ->
    prefix = "./tmp/#{new Date().getTime()}/test-"
    rotationThreshold = 123444
    formatter = format: (entry) -> 'test'

    beforeEach ->
      testedHandler = testedBuilder
        .prefix prefix
        .rotationBytesThreshold rotationThreshold
        .formatter formatter
        .build()

    it "contains properly set prefix", ->
      testedHandler.prefix.should.equal prefix
    it "contains properly set rotation threshold", ->
      testedHandler.rotationBytesThreshold.should.equal rotationThreshold
    it "contains properly set formatter", ->
      testedHandler.formatter.should.equal formatter

