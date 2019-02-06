const chai = require('chai');
const sandbox = require('sinon').createSandbox();
const expect = require('chai').expect;

chai.should();
chai.use(require('chai-as-promised'));

const Entity = require('../../src/domain/Entity');
const UserRepository = require('../../src/repositories/UserRepository');
const BaseRepository = require('../../src/repositories/BaseRepository');

describe('tests for Entity.js', function () {
  beforeEach(function () {
    this._exists = true;
  });

  afterEach(function () {
    sandbox.restore();
  });

  describe('load()', function () {
    it('resolves a promise containing the this value of the Entity', function () {
      const entity = new Entity('10', new UserRepository());
      sandbox.stub(Entity.prototype, '_load').returns(Promise.resolve(this._exists));
      return expect(entity.load())
        .to.eventually.be.fulfilled
        .then((data) => {
          expect(data).to.deep.equal(entity);
        });
    });

    it('rejects a promise with Resource not found HTTP 404', function () {
      this._exists = false;
      const entity = new Entity('10', new UserRepository());
      sandbox.stub(Entity.prototype, '_load').returns(Promise.resolve(this._exists));
      return expect(entity.load())
        .to.eventually.be.rejectedWith('Resource not found')
        .that.has.property('statusCode')
        .that.is.equal(404);
    });
  });

  describe('_load()', function () {
    it('resolves a promise with true when user is found', function () {
      const entity = new Entity('10', new UserRepository());
      sandbox.stub(BaseRepository.prototype, 'getById')
        .returns(Promise.resolve({ user: 'dummy user', Count: 1 }));
      return expect(entity._load())
        .to.eventually.be.fulfilled
        .then((data) => {
          expect(data).to.equal(true);
          expect(entity._loaded).to.equal(true);
        });
    });

    it('resolves a promise with false when user does not exist', function () {
      const entity = new Entity('10', new UserRepository());
      sandbox.stub(BaseRepository.prototype, 'getById')
        .returns(Promise.resolve({ Count: 0 }));
      return expect(entity._load())
        .to.eventually.be.fulfilled
        .then((data) => {
          expect(data).to.equal(false);
        });
    });

    it('merges the returned entity with its this value when _exists', function () {
      const entity = new Entity('10', new UserRepository());
      sandbox.stub(BaseRepository.prototype, 'getById')
        .returns(Promise.resolve({ testUser: 'testData', Count: 1 }));
      return expect(entity._load())
        .to.eventually.be.fulfilled
        .then(() => {
          expect(entity).to.have.property('testUser', 'testData');
        });
    });
  });

  describe('_save()', function () {
    it('resolves a promise containing the user returned from the repository', function () {
      const entity = new Entity('10', new UserRepository());
      sandbox.stub(BaseRepository.prototype, 'create')
        .returns(Promise.resolve({
          testUserKey: 'testUserValue'
        }));

      return expect(entity._save())
        .to.eventually.be.fulfilled
        .then((data) => {
          expect(data).to.deep.equal({ testUserKey: 'testUserValue' })
        })
    });

    it('rejects a promise containing the error caught from the repository', function () {
      const entity = new Entity('10', new UserRepository());
      sandbox.stub(BaseRepository.prototype, 'create')
        .returns(Promise.reject(new Error('Some Error')));

      return expect(entity._save())
        .to.eventually.be.rejectedWith('Some Error');
    });
  });
});