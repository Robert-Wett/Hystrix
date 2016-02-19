import _ from 'lodash';
import moment from 'moment';

export function createBuckets(stoppingNum,now){
 let stubs = {};
 const unix = moment.unix(now).valueOf();
 _.each(_.range(1,stoppingNum),function(val,idx){
   stubs[unix+val] = { value: idx };
 });
 return stubs;
}

