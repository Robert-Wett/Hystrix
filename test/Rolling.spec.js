import { expect } from 'chai';
import sinon from 'sinon';
import _ from 'lodash';
import moment from 'moment';
import { createBuckets } from './helpers/helpers';
import Rolling from '../lib/rolling/Rolling';
const context = describe;

describe('Command: ', () => {
  let rolling;
  let sandbox;
  beforeEach( () => {
    rolling = new Rolling();
    sandbox = sinon.sandbox.create(); 
  });
  afterEach(() => {
    rolling = null;
    sandbox.restore();
  });
  context('Basic Assertions: ',() => {
    it('should be an object', () => {
      expect(rolling).to.be.an('object');
    });
    it('should be an instance of the Command Constructor', () => {
      expect(rolling).to.be.an.instanceof(Rolling);
    });
  });
  context('Interface: ',() => {
    it('should have a getCurrentBucket() method', () => {
      expect(rolling).to.respondTo('getCurrentBucket');
    });
    it('should have a removeOldBuckets() method', () => {
      expect(rolling).to.respondTo('removeOldBuckets');
    });
    it('should have a increment() method', () => {
      expect(rolling).to.respondTo('increment');
    });
    it('should have a updateMax() method', () => {
      expect(rolling).to.respondTo('updateMax');
    });
    it('should have a sum() method', () => {
      expect(rolling).to.respondTo('sum');
    });
    it('should have a max() method', () => {
      expect(rolling).to.respondTo('max');
    });
    it('should have a avg() method', () => {
      expect(rolling).to.respondTo('avg');
    });
  });
  context('Implementation: ',() => {
    it('should get the current bucket', () => {
      // setup:
     const now = new Date();
     const clock = sinon.useFakeTimers(now.getTime());
     const unix = moment.unix(now).valueOf();
     // when:
     const bucket = rolling.getCurrentBucket();
     // then:
     expect(bucket).to.deep.equal({value:0});
     expect(Object.keys(rolling.buckets)).to.deep.equal([unix.toString()]);
     // teardown:
     clock.restore();
   });
   it('should remove old buckets', () => {
     // setup:
     const now = new Date();
     const clock = sinon.useFakeTimers(now.getTime());
     const mockedTimestamp = moment.unix(now).valueOf();
     const past = mockedTimestamp - 11;
     const current = rolling.getCurrentBucket();
     rolling.buckets[past] = {value:0};
     // when:
     const buckets = rolling.removeOldBuckets();
     // then:
     expect(Object.keys(rolling.buckets)).to.deep.equal([mockedTimestamp.toString()]);
     //it returns the new buckets obj
     expect(rolling.buckets).to.deep.equal(buckets);
     // teardown:
     clock.restore();
   });
   it('should increment the value of a rolling number', () => {
     // setup:
     const now = new Date();
     const clock = sinon.useFakeTimers(now.getTime());
     const unix = moment.unix(now).valueOf();
     const spy = sandbox.spy(rolling,'removeOldBuckets');
     // when:
     rolling.getCurrentBucket();
     const bucket = rolling.increment(1);
     // then:
     expect(bucket.value).to.equal(1);
     expect(spy.callCount).to.equal(1);
     // teardown:
     clock.restore();
   });

   it('increment() should throw an error if given a wrong type', () => {
     // setup:
     const now = new Date();
     const clock = sinon.useFakeTimers(now.getTime());
     const unix = moment.unix(now).valueOf();
     const spy = sandbox.spy(rolling,'removeOldBuckets');
     // when:
     const bucket = rolling.getCurrentBucket();
     // then:
     expect(rolling.increment.bind('a')).to.throw('Wrong type to increment by');
     expect(bucket.value).to.equal(0);
     expect(spy.callCount).to.equal(0);
     // teardown:
     clock.restore();
   });

   it('should update the max value of a rolling number', () => {
     // setup:
     const now = new Date();
     const clock = sinon.useFakeTimers(now.getTime());
     const unix = moment.unix(now).valueOf();
     const spy = sandbox.spy(rolling, 'removeOldBuckets');
     // when:
     rolling.getCurrentBucket();
     const bucket = rolling.updateMax(10);
     // then:
     expect(bucket.value).to.equal(10);
     expect(spy.callCount).to.equal(1);
     // teardown:
     clock.restore();
   });
   it('updateMax() should throw if given a wrong type', () => {
     // setup:
     const now = new Date();
     const clock = sinon.useFakeTimers(now.getTime());
     const unix = moment.unix(now).valueOf();
     const spy = sandbox.spy(rolling,'removeOldBuckets');
     // when:
     const bucket = rolling.getCurrentBucket();
     // then:
     expect(rolling.updateMax.bind('a')).to.throw('Wrong type to update by');
     expect(bucket.value).to.equal(0);
     expect(spy.callCount).to.equal(0);
     // teardown:
     clock.restore();
   });
   it('should return the sum of all buckets', () => {
     // setup:
     const now = new Date();
     const clock = sinon.useFakeTimers(now.getTime());
     const unix = moment.unix(now).valueOf();
     rolling.buckets = createBuckets(11,now);
     // when:
     let sum = rolling.sum(now);
     // then:
     expect(sum).to.equal(45);
     // teardown:
     clock.restore();
   });
   
   it('sum() should throw an error if give a invaild date type', () => {
     // setup:
     const now = new Date();
     const clock = sinon.useFakeTimers(now.getTime());
     const unix = moment.unix(now).valueOf();
     // when:
     rolling.buckets = createBuckets(11, now);
     // then:
     expect(rolling.sum.bind(rolling,'oops')).to.throw("Invaild Date");
     // teardown:
     clock.restore();
   });

   it('should update the max value for a rolling window', () => {
     // setup:
     const now = new Date();
     const clock = sinon.useFakeTimers(now.getTime());
     const unix = moment.unix(now).valueOf();
     rolling.buckets = createBuckets(11, now);
     // when:
     const max = rolling.max(now);
     // then:
     expect(max).to.equal(9);
     // teardown:
     clock.restore();
   });

   it('max() should throw an error if give a invaild date type', () => {
     // setup:
     const now = new Date();
     const clock = sinon.useFakeTimers(now.getTime());
     const unix = moment.unix(now).valueOf();
     // when:
     rolling.buckets = createBuckets(11, now);
     // then:
     expect(rolling.max.bind(rolling,'oops')).to.throw("Invaild Date");
     // teardown:
     clock.restore();
   });

   it('avg() should throw an error if give a invaild date type', () => {
     // setup:
     const now = new Date();
     const clock = sinon.useFakeTimers(now.getTime());
     const unix = moment.unix(now).valueOf();
     // when:
     rolling.buckets = createBuckets(11, now);
     // then:
     expect(rolling.avg.bind(rolling,'oops')).to.throw("Invaild Date");
     // teardown:
     clock.restore();
   });
   it('avg() should return the avg value for all buckets in the 10sec window', () => {
     // setup:
     const now = new Date();
     const clock = sinon.useFakeTimers(now.getTime());
     const unix = moment.unix(now).valueOf();
     rolling.buckets = createBuckets(11, now);
     // when:
     const avg = rolling.avg(now);
     // then:
     expect(avg).to.equal(4.5);
     // teardown:
     clock.restore();
   });
  });
});
