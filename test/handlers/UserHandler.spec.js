const chai = require('chai');
const sandbox = require('sinon').createSandbox();
const expect = require('chai').expect;

chai.should();
chai.use(require('chai-as-promised'));

const UserHandler = require('../../src/UserHandler');

describe('tests for UserHandler.js', function () {
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
    this.handler = new UserHandler(this.event);
  });

  afterEach(function () {
    sandbox.restore();
  });

  describe('helper methods', function () {
    it('strips HTML content, also in nested properties', function () {
      this.args.id = '<script>10</script>';
      this.args.prop = { nested: '<script>xhr</script>' }
      this.handler._sanitizeData(this.args);

      expect(this.args.id).to.equal('10');
      expect(this.args.prop).to.deep.equal({ nested: 'xhr' });
    });

    it('throws HTTP 400 if name contains illegal characters', function () {
      this.args.name = 'Firstname n0tl4stn4m3';
      return expect(() => {
        this.handler._sanitizeData(this.args)
      }).to.throw('Illegal characters in name')
        .that.has.property('statusCode')
        .that.is.equal(400);
    });

    it('ignores any word except first and second', function () {
      this.args.name = 'FirstName LastName ThirdName';
      this.handler._formatData(this.args);

      expect(this.args.last_name).to.exist;
      expect(this.args.last_name).to.equal('LastName');
      expect(this.args.name).to.equal('FirstName');
    });

    it('transforms the gender property into a numeric value', function () {
      this.handler._formatData(this.args);
      expect(this.args.gender).to.be.equal(0);

      this.args.gender = 'female';
      this.handler._formatData(this.args);
      expect(this.args.gender).to.be.equal(1);

      this.args.gender = 'unknown';
      this.handler._formatData(this.args);
      expect(this.args.gender).to.be.equal(3);
    });
  });
});