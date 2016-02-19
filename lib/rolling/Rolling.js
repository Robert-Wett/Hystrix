import moment from 'moment';
import _ from 'lodash';

class Rolling {
  constructor() {
    this.buckets = {};
    return this;
  }
 /**
  * @description Returns the current bucket for the current unix timestamp
  * @returns {Object} Returns an object with a key being a unix timestamp,
  * and a object with value prop starting at 0
  */
 getCurrentBucket(){
   const timeStamp = moment.unix(new Date()).valueOf();
   let bucket = this.buckets[timeStamp];
   if (!bucket) {
     this.buckets[timeStamp] = { value: 0 };
     bucket = this.buckets[timeStamp];
   }
   return bucket;
 }

/**
 * @description Removes expired time buckets from the buckets hash table.
 * @return{Object} Returns the new version of the buckets obj after the modification.
 */
 removeOldBuckets(){
   const now = ( moment.unix(new Date()).valueOf() ) - 10;
   // TODO: configurable rolling window
   this.buckets = _.reduce(this.buckets,(_acc,val,timestampKey) => {
     const acc = _acc;
     if (timestampKey < now) {
       return acc;
     }
     acc[timestampKey] = val;
     return acc;
   },{});
   return this.buckets;
 }
/**
 * @description Increment increments the number in current timeBucket.
 * @param{Number} The number by which to increment the bucket value usually one.
 * @return{Object} The bucket that was modified.
 */
  increment(num){
    if(!_.isNumber(num)){
      throw new Error("Wrong type to increment by");
    }
    const bucket = this.getCurrentBucket();
    bucket.value += num;
    this.removeOldBuckets();
    return bucket;
  }
  /**
  * @description UpdateMax updates the maximum value in the current bucket.
  * @param{Date} Takes in the current date ( new Date() ).
  * @returns{Object} Returns the bucket.
  */
  updateMax(num) {
    if(!_.isNumber(num)){
      throw new Error("Wrong type to update by");
    }
    const bucket = this.getCurrentBucket();
    if (num > bucket.value) {
      bucket.value = num;
    }
    this.removeOldBuckets();
    return bucket;
  }
/**
 * @description Sum sums the values over the buckets in the last 10 seconds.
 * @param{Date} Takes in the current date ( new Date() ).
 * @returns{Number} returns the sum of the values in the last 10 seconds.
 */
  sum(now) {
    if( ! this._dateCheck(now) ) {
      throw new Error("Invaild Date");
    }
    return _.reduce(this.buckets, function SumReduceCb(acc,bucket,timestamp){
      // TODO: configurable rolling window
      if (timestamp >= moment.unix(now).valueOf() - 10) {
        acc += bucket.value;
        return acc;
      }
    },0);
  }
  
  /**
  * @description Returns The maxium value seen for the timestamp given.
  * @param{Date} Takes in the current date ( new Date() ).
  * @returns{Number} The max value.
  */
  max(now){
    if( ! this._dateCheck(now) ) {
      throw new Error("Invaild Date");
    } 
    let max = 0;
    _.forIn(this.buckets, function MaxforInCb(bucket,timestamp) {
      // TODO: configurable rolling window
      if (timestamp >= moment.unix(now) - 10) {
        if (bucket.value > max) {
          max = bucket.value
        }
      }
    },this);
    return max
  }

  /**
  * @description Returns the avg of all buckets for the last 10 seconds since the given time.
  * @param{Date} Takes in the current date ( new Date() ).
  * @returns{Number} The average for the last 10 seconds.
  */
  avg(now) {
    if(! this._dateCheck(now) ) {
      throw new Error("Invaild Date");
    }
    return this.sum(now) / 10;
  }

  _dateCheck(date) {
   return _.isDate(date);
  }

}


export default Rolling;
