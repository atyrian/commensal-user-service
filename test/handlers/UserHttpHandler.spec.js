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
      const spy = sinon.spy(this.handler, "_validatePathParameters");

      delete this.event.pathParameters;
      try {
        this.handler._validatePathParameters();
      } catch (e) { }
      return sinon.assert.threw(spy);
    });

    it('throws an error if pathParameters.id is falsy', function () {
      const spy = sinon.spy(this.handler, "_validatePathParameters");

      this.event.pathParameters.id = undefined;
      try {
        this.handler._validatePathParameters();
      } catch (e) { }
      return sinon.assert.threw(spy);
    });

    it('throws an error if pathParameters.id is NaN', function () {
      const spy = sinon.spy(this.handler, "_validatePathParameters");

      this.event.pathParameters.id = "not a numeric value";
      try {
        this.handler._validatePathParameters();
      } catch (e) { }
      return sinon.assert.threw(spy);
    });
  });

  describe('_validatePostParameters()', function () {
    it('returns id, name, birthday, gender', function () {
      const params = { id: '10', name: 'FirstName LastName', birthday: '08/11/1990', gender: 'male' };
      const value = this.handler._validatePostParameters();

      expect(value).to.deep.equal(params);
    });

    it('throws an error if there is no event.body', function () {
      const spy = sinon.spy(this.handler, "_validatePostParameters");
      delete this.event.body
      try { this.handler._validatePostParameters(); }
      catch (e) { }

      return sinon.assert.threw(spy);
    });

    it('throws an error if event.body is undefined', function () {
      const spy = sinon.spy(this.handler, "_validatePostParameters");
      this.event.body = undefined
      try { this.handler._validatePostParameters(); }
      catch (e) { }

      return sinon.assert.threw(spy);
    });

    it('throws an error if event.body: name is missing', function () {
      const spy = sinon.spy(this.handler, "_validatePostParameters");
      this.event.body = '{ "gender": "male", "birthday": "08/11/1990", "id": "10" }';
      try { this.handler._validatePostParameters(); }
      catch (e) { }

      return sinon.assert.threw(spy);
    });

    it('throws an error if event.body: gender is missing', function () {
      const spy = sinon.spy(this.handler, "_validatePostParameters");
      this.event.body = '{ "name": "FirstName LastName","birthday": "08/11/1990", "id": "10" }';
      try { this.handler._validatePostParameters(); }
      catch (e) { }

      return sinon.assert.threw(spy);
    });

    it('throws an error if event.body: birthday is missing', function () {
      const spy = sinon.spy(this.handler, "_validatePostParameters");
      this.event.body = '{ "name": "FirstName LastName", "gender": "male", "id": "10" }';
      try { this.handler._validatePostParameters(); }
      catch (e) { }

      return sinon.assert.threw(spy);
    });

    it('throws an error if event.body: id is missing', function () {
      const spy = sinon.spy(this.handler, "_validatePostParameters");
      this.event.body = '{ "name": "FirstName LastName", "gender": "male", "birthday": "08/11/1990" }';
      try { this.handler._validatePostParameters(); }
      catch (e) { }

      return sinon.assert.threw(spy);
    });

    it('throws an error if event.body.id !== pathParameters.id', function () {
      const spy = sinon.spy(this.handler, "_validatePostParameters");
      this.event.pathParameters.id = 'not 10';
      try { this.handler._validatePostParameters(); }
      catch (e) { }

      return sinon.assert.threw(spy);
    });
  });

  describe('get()', function () {
    it('returns an object containing the user with requested id and a statusCode 200', function () {
      const handlerResp = { _entityRepository: {}, _id: '1', _loaded: true, _exists: true, Items: [{ id: '1' }], Count: 1, ScannedCount: 1 };
      const userHandlerStub = sinon.stub(UserHandler.prototype, 'getUser').returns(handlerResp);

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
});
