const chai = require('chai');
const sandbox = require('sinon').createSandbox();
const expect = require('chai').expect;
const sinon = require("sinon");

const User = require('../../src/domain/User');

chai.should();
chai.use(require('chai-as-promised'));

describe('tests for User.js', function () {
  beforeEach(function () {
    this.user = new User('10');
    this.params = {
      name: 'FirstName',
      last_name: 'LastName',
      birthday: '08/11/1990',
      gender: 0,
      geohash: 'ABCD120',
      last_active: 1563432423
    };

    this.referenceObject = {
      geohash: ' ',
      id: ' ',
      last_active: ' ',
      match_id: [' '],
      person:
      {
        bio: ' ',
        birthday: ' ',
        fav_venues: { venue_1: {}, venue_2: {}, venue_3: {} },
        gender: ' ',
        last_name: ' ',
        name: ' ',
        photos: { photo_0: ' ', photo_1: ' ', photo_2: ' ' }
      },
      pref: 0,
      shown_to: [' ']
    }
  });

  afterEach(function () {
    sandbox.restore();
  });
  describe('populateTemplate()', function () {
    it('populates the user template with the supplied parameters', function () {
      const spy = sinon.spy(this.user, "populateTemplate");

      this.user.populateTemplate(this.referenceObject, this.params);

      expect(this.referenceObject.person.name).to.equal(this.params.name);
      expect(this.referenceObject.person.last_name).to.equal(this.params.last_name);
      expect(this.referenceObject.person.birthday).to.equal(this.params.birthday);
      expect(this.referenceObject.person.gender).to.equal(this.params.gender);
      expect(this.referenceObject.geohash).to.equal(this.params.geohash);
      expect(this.referenceObject.last_active).to.equal(this.params.last_active);
    });

    it('ignores parameters that are not in the template', function () {
      this.params.something = 'Not in template';
      this.user.populateTemplate(this.referenceObject, this.params);

      expect(this.referenceObject).to.contain.all.keys('geohash', 'id', 'last_active', 'match_id', 'person', 'pref', 'shown_to');
      expect(this.referenceObject).to.not.have.any.keys('something');
    });
  });
}); 