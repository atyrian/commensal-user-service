const sinon = require("sinon");
const chai = require('chai');
const sandbox = require('sinon').createSandbox();
const expect = require('chai').expect;

chai.should();
chai.use(require('chai-as-promised'));

const UserHttpHandler = require('../../src/UserHttpHandler');
const UserHandler = require('../../src/UserHandler');


describe('tests for UserHttpHandler.js', function () {
  beforeEach(function () {
    this.event = {
      headers: { Authorization: ' Bearer 12345' },
      multiValueHeaders: { Authorization: [' Bearer EAADv5fB3gpQBADn4iMTbQMuxdM'] },
      pathParameters: { id: '10' },
      body: '{ "name": "FirstName LastName", "gender": "male", "birthday": "08/11/1990", "id": "10" }'
    }
    this.handler = new UserHttpHandler(this.event);
  });

  afterEach(function () {
    sandbox.restore();
  });

  describe('_validatePathParameters()', function () {
    it('returns the pathParameters id', function () {

      const spy = sinon.spy(this.handler, "_validatePathParameters");

      const value = this.handler._validatePathParameters();

      expect(value).to.equal('10');
      return sinon.assert.calledOnce(spy);
    });

    it('throws an error if there is no pathParameters property', function () {
      delete this.event.pathParameters;
      return expect(() => {
        this.handler._validatePathParameters()
      }).to.throw('Bad request. Missing or malformed path param id')
        .that.has.property('statusCode')
        .that.is.equal(400);
    });

    it('throws an error if pathParameters.id is falsy', function () {
      this.event.pathParameters.id = undefined;
      return expect(() => {
        this.handler._validatePathParameters()
      }).to.throw('Bad request. Missing or malformed path param id')
        .that.has.property('statusCode')
        .that.is.equal(400);
    });

    it('throws an error if pathParameters.id is NaN', function () {
      this.event.pathParameters.id = "not a numeric value";
      return expect(() => {
        this.handler._validatePathParameters()
      }).to.throw('Bad request. Missing or malformed path param id')
        .that.has.property('statusCode')
        .that.is.equal(400);
    });
  });

  describe('_validatePostParameters()', function () {
    it('returns id, name, birthday, gender', function () {
      const params = { id: '10', name: 'FirstName LastName', birthday: '08/11/1990', gender: 'male' };
      const value = this.handler._validatePostParameters();

      expect(value).to.deep.equal(params);
    });

    it('throws an error if there is no event.body', function () {
      delete this.event.body
      return expect(() => {
        this.handler._validatePostParameters()
      }).to.throw('Missing request body')
        .that.has.property('statusCode')
        .that.is.equal(400);
    });

    it('throws an error if event.body is undefined', function () {
      this.event.body = undefined
      return expect(() => {
        this.handler._validatePostParameters()
      }).to.throw('Missing request body')
        .that.has.property('statusCode')
        .that.is.equal(400);
    });

    it('throws an error if event.body: name is missing', function () {
      this.event.body = '{ "gender": "male", "birthday": "08/11/1990", "id": "10" }';
      return expect(() => {
        this.handler._validatePostParameters()
      }).to.throw('Malformed request body')
        .that.has.property('statusCode')
        .that.is.equal(400);
    });

    it('throws an error if event.body: gender is missing', function () {
      this.event.body = '{ "name": "FirstName LastName","birthday": "08/11/1990", "id": "10" }';
      return expect(() => {
        this.handler._validatePostParameters()
      }).to.throw('Malformed request body')
        .that.has.property('statusCode')
        .that.is.equal(400);
    });

    it('throws an error if event.body: birthday is missing', function () {
      this.event.body = '{ "name": "FirstName LastName", "gender": "male", "id": "10" }';
      return expect(() => {
        this.handler._validatePostParameters()
      }).to.throw('Malformed request body')
        .that.has.property('statusCode')
        .that.is.equal(400);
    });

    it('throws an error if event.body: id is missing', function () {
      this.event.body = '{ "name": "FirstName LastName", "gender": "male", "birthday": "08/11/1990" }';
      return expect(() => {
        this.handler._validatePostParameters()
      }).to.throw('Malformed request body')
        .that.has.property('statusCode')
        .that.is.equal(400);
    });

    it('throws an error if event.body.id !== pathParameters.id', function () {
      this.event.pathParameters.id = 'not 10';
      return expect(() => {
        this.handler._validatePostParameters()
      }).to.throw('Body id parameter not matching path parameter')
        .that.has.property('statusCode')
        .that.is.equal(400);
    });
  });

  describe('get()', function () {
    it('returns response containing the user with requested id and a statusCode 200', function () {
      const handlerResp = { _entityRepository: {}, _id: '1', _loaded: true, _exists: true, Items: [{ id: '1' }], Count: 1, ScannedCount: 1 };
      const userHandlerStub = sandbox.stub(UserHandler.prototype, 'getUser').returns(handlerResp);

      return expect(this.handler.get())
        .to.eventually.be.fulfilled
        .then((data) => {
          const resp = JSON.parse(data.body);
          expect(resp.data.Items[0].id).to.equal(handlerResp._id);
          expect(resp.code).to.equal(200);
          expect(resp.data.Count).to.equal(handlerResp.Count);
          expect(resp.data.ScannedCount).to.equal(handlerResp.ScannedCount);

          sinon.assert.calledOnce(userHandlerStub);
        });
    });
  });

  describe('post()', function () {
    it('returns response with newly created user matching post parameters and a status 200', function () {
      const handlerResp = { id: '10', person: { birthday: '08/11/1990', gender: 0, last_name: 'LastName', name: 'FirstName', }, created_at: '2019-01-25T21:22:50.574Z' };
      const userHandlerStub = sandbox.stub(UserHandler.prototype, 'createUser').returns(handlerResp);

      return expect(this.handler.post())
        .to.eventually.be.fulfilled
        .then((data) => {
          const resp = JSON.parse(data.body);
          expect(resp.code).to.equal(200);
          expect(resp.data.id).to.equal(handlerResp.id);
          expect(resp.data.created_at).to.exist;

          sinon.assert.calledOnce(userHandlerStub);
        });
    });
  });
});
