'use strict'
import Repo from '../bw_commons/Classes/Repo';


/**
 * Example Repository
 *
 * All Repo must extend the Repo class from the BW_commons
 */
class Example extends Repo {
  constructor(getMongoPool, collectionName) {
    super(getMongoPool, collectionName);
    this.rules =  {
    };

    this.fields =  [
    ];

    this.hidden = [
    ]
  }
}


export default Example;