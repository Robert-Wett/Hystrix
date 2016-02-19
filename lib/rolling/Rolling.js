
class Rolling {

  constructor() {
    this.buckets = {};
    return this;
  };
 
 getCurrentBucket(){
  const timeStamp = Math.floor(Date.now() / 1000);
  let bucket = this.buckets[timestamp]);
  if (!bucket) {
   this.buckets[timestamp] = { value: 0 };
  }
  
  return bucket;
 }
}


export default Rolling;
