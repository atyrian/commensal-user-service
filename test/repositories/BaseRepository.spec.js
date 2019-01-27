const chai = require('chai');
const sandbox = require('sinon').createSandbox();
const expect = require('chai').expect;

const BaseRepository = require('../../src/repositories/BaseRepository');

chai.should();
chai.use(require('chai-as-promised'));

describe.only('tests for BaseRepository.js', function () {
  beforeEach(function () {
    this.event = {
      headers: { Authorization: ' Bearer 12345' },
      multiValueHeaders: { Authorization: [' Bearer EAADv5fB3gpQBADn4iMTbQMuxdM'] },
      pathParameters: { id: '10' },
      body: '{ "name": "FirstName LastName", "gender": "male", "birthday": "08/11/1990", "id": "10" }'
    }
    this.args = {
      id: '10',
      name: 'FirstName LastName ',
      birthday: '08/11/1990',
      gender: 'male'
    };
  });

  afterEach(function () {
    sandbox.restore();
  });

  describe('create()', function () {
    it('resolves a promise containing the user returned from the repository', function () {
      const newUser = { newUserName: 'newUser', id: 10 }
      baseRepo = new BaseRepository('User', {
        hashKey: 'id',
        rangeKey: 'geohash',
        timestamps: true,
        createdAt: 'created_at',
      }, { tableName: 'commensal-user' })

      sandbox.stub(baseRepo, '_db').value({
        create: function (entity, callback) {
          return callback(null, entity);
        }
      });

      return expect(baseRepo.create(newUser))
        .to.eventually.be.fulfilled
        .then((data) => {
          expect(data).to.deep.equal(newUser);
        });
    });

    it('rejects a promise with: Error saving user to database HTTP 500', function () {
      const newUser = { newUserName: 'newUser', id: 10 }
      baseRepo = new BaseRepository('User', {
        hashKey: 'id',
        rangeKey: 'geohash',
        timestamps: true,
        createdAt: 'created_at',
      }, { tableName: 'commensal-user' })

      sandbox.stub(baseRepo, '_db').value({
        create: function (entity, callback) {
          return callback('some error', null);
        }
      });

      return expect(baseRepo.create(newUser))
        .to.eventually.be.rejectedWith('Error saving user to database')
        .that.has.property('statusCode')
        .that.is.equal(500);
    });
  });

  describe('_validate()', function () {
    it('deletes properties of keys starting with underscore', function () {
      const newUser = { name: 'name', id: 10, _entityRepository: {}, _logging: {}, _someThing: 'someThing' }

      baseRepo._validate(newUser);
      expect(newUser).not.to.have.property('_entityRepository');
      expect(newUser).not.to.have.property('_logging');
      expect(newUser).not.to.have.property('_someThing');
      expect(newUser).to.have.property('name', 'name');
      expect(newUser).to.have.property('id', 10);
    });
  });
});

