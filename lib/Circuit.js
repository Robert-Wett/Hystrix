import EventEmitter from 'events';
import crypto from 'crypto';
import Circuits from './Circuits';
import ExecutorPool from './pool';
import Metrics from 'metrics';

export default class CircuitBreaker extends EventEmitter {
 constructor(opts){
  super();
  this.setDefaults(opts);
 }


 setDefaults(opts = {}){
   this.name = opts.name || crypto.randomBytes(256);
   this.open = opts.open || false;
   this.forceOpen = opts.forceOpen || false;
   this.executorPool = opts.executorPool || new ExecutorPool(this.name);
   this.metrics = opts.metrics || new Metrics(this.name);
   this.openOrLastTimeTested = 0;
 }

 /**
  * @description Finds a circuit in the Circuits Map{}.
  * If its not found it will create a new one and return it.
  * @param{String} The key name of the circuit
  * @returns {Object} The circuit instance. 
  */
 getCircuit(name) {
   const circuit = Circuits.findOne(name);
   if(!circuit) {
     return Circuits.append(name);
   }
   return circuit;
 }

 /**
  * @description The Flush method will clear out all metrics information
  * for all circuits
  * @returns{Object}
  */
 flush(){
   const circuits = Circuits.get();
   const newCircuits = _.reduce(circuits,(_acc,val,idx) => {
     const acc = _acc;
     val.metrics.reset();
     val.executorPool.metrics.reset();
     acc[idx] = val;
     return acc;
   },{});
   Circuits.set(newCircuits);
   return Circuits.get();
 }

}

