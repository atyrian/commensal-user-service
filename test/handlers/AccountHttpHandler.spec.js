const sinon = require("sinon");
const chai = require('chai');
const sandbox = require('sinon').createSandbox();
const expect = require('chai').expect;

chai.should();
chai.use(require('chai-as-promised'));

const AccountHttpHandler = require('../../src/httpHandlers/AccountHttpHandler');
const UserHandler = require('../../src/UserHandler');

describe('tests for AccountHttpHandler.js', function () {
  beforeEach(function () {
    this.event = {
      pathParameters: { id: '10' },
      body: '{ "bio": "Hello mangs!","geohash": " ","photo_1": "https://photo1","venue_1": { "venue_name": "tacobell" }, "venue_2": { "venue_name": "mcduck" },"venue_3": { "venue_name": "burgerchef" }, "photo_2": "https://photo2"}'
    }
    this.handler = new AccountHttpHandler(this.event);
  });

  afterEach(function () {
    sandbox.restore();
  });
  describe('_validatePathParameters()', function () {
    it('throws HTTP 400 if path parameters are missing or faulty', function () {
      this.event.pathParameters = { id: 'notId' }
      return expect(() => {
        this.handler._validatePathParameters();
      }).to.throw('Bad request. Missing or malformed path param id')
        .that.has.property('statusCode')
        .that.is.equal(400);
    });
  });
  describe('_validateRequestBody()', function () {
    it('throws HTTP 400 if body contains illegal parameters', function () {
      this.event.body = '{ "someKey":"someValue", "bio": "Hello mangs!","geohash": " ","photo_1": "https://photo1","venue_1": { "venue_name": "tacobell" }, "venue_2": { "venue_name": "mcduck" },"venue_3": { "venue_name": "burgerchef" }, "photo_2": "https://photo2"}';

      return expect(() => {
        this.handler._validateRequestBody(true);
      }).to.throw()
        .that.has.property('statusCode')
        .that.is.equal(400);
    });
    it('throws HTTP 400 if typeof venue_1/2/3 key is not object', function () {
      this.event.body = '{"bio": "Hello mangs!","geohash": " ","photo_1": "https://photo1","venue_1": { "venue_name": "tacobell" }, "venue_2": { "venue_name": "mcduck" },"venue_3": "stringVal", "photo_2": "https://photo2"}';

      return expect(() => {
        this.handler._validateRequestBody(true);
      }).to.throw('Venue parameter must be of type object')
        .that.has.property('statusCode')
        .that.is.equal(400);
    });
  });
  describe('get()', function () {
    it('returns response containing the user account with person, match_id, geohash and id values', function () {
      const handlerResp = {
        _entityRepository: {},
        _id: '10',
        _loaded: true,
        _exists: true,
        Items: [{ attrs: { geohash: 'ABC', match_id: '', person: {} } }],
        Count: 1,
        ScannedCount: 1
      }
      const userHandlerStub = sandbox.stub(UserHandler.prototype, 'getUser').returns(handlerResp);

      return expect(this.handler.get())
        .to.eventually.be.fulfilled
        .then((data) => {
          const resp = JSON.parse(data.body);
          expect(resp.code).to.equal(200);
          expect(resp.data.id).to.exist
          expect(resp.data.geohash).to.exist
          expect(resp.data.person).to.exist
          expect(resp.data.match_id).to.exist
          expect(resp.data._id).not.to.exist
          expect(resp.data._loaded).not.to.exist
          expect(resp.data._entityRepository).not.to.exist
        });
    });
  });
});