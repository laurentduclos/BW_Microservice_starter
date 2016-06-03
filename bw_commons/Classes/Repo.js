'use strict';
import {ObjectID} from 'mongodb';
import {ValidationError} from '../errors';
import Promise from 'bluebird';
import { utils as fp } from 'jsfp';

class Repo {
  /**
   * [constructor description]
   * @param  {function} getMongoPool   Retreived the mongo connection
   * @param  {string} collectionName Name of the mongo collection
   */
  constructor(getMongoPool, collectionName) {
    this.collectionName = collectionName;
    this.getMongoPool = getMongoPool;
    this.errors = [];
  }

  get db() {
    return this.getMongoPool();
  }

  get collection() {
    return this.getMongoPool().collection(this.collectionName);
  }

  all() {
    return this.collection.find({}).toArray();
  }

  count() {
    return this.collection.count();
  }

  findOne(query) {
    return this.collection.findOne(query);
  }

  remove(query) {
    query = query || {};
    return this.collection.remove(query);
  }

  /**
   * [getProjectionObject description]
   * @return Object
   */
  getProjectionObject() {
    // return this.fields.reduce((acc, field )=> {
    //   if(this.hidden && this.hidden.indexOf(field) === -1 ) {
    //     acc[field] = 1;
    //     return acc;
    //   }
    //   return acc
    // }, {});

    return this.hidden.reduce((acc, field) => {
      acc[field] = 0;
      return acc;
    }, {})
  }

  findById(id) {
    const idO = new ObjectID(id);
    return this.collection.findOne({_id: idO}, this.getProjectionObject());
  }

  getField(id, fieldName) {
    const idO = new ObjectID(id);
    return this.collection.findOne({_id: idO}, {[fieldName]: 1, "_id": 0});
  }

  pushToArray( query, value, fieldName, updateTime = true ) {
    return this._pushToArray(this.collection, query, value, fieldName, updateTime)
  }

  _pushToArray( collection, query, value, fieldName, updateTime = false) {
    query = typeof query == 'object' ? query : {'_id': new ObjectID(query) };
    const data = {
      $push: { [fieldName]: value },
      $currentDate: { updated_at: updateTime }
    }
    return collection.findAndModify(query, [['_id',1]], data, {new:true});
  }

  pullFromArray( query, removalQuery, fieldName ) {
    query = typeof query == 'object' ? query : {'_id': new ObjectID(query) };
    const data = {
      $pull: { [fieldName]: removalQuery },
      $currentDate: { updated_at: true }
    }
    return this.collection.findAndModify(query, [['_id',1]], data, {new:true});
  }

  removeExperience( query, experienceID ) {
    query = typeof query == 'object' ? query : {'_id': new ObjectID(query) };
    const data = {
      $pull: { experiences: { id: experienceID} },
      $currentDate: { updated_at: true }
    }
    return this.collection.findAndModify(query, [['_id',1]], data, {new:true});
    //return this.collection.update(query, repalce);
  }

  insert(data, noGuard) {
    return this._insert(this.collection, data, false, noGuard);
  }

  _insert(collection, data, fieldsOveride, noGuard) {
    const fields = fieldsOveride ? fieldsOveride : this.fields;

    let guarded = noGuard ? data : fp.filtero((v, k) => {
      return fields.indexOf(k) > -1
    }, data);

    if (Object.keys(guarded).length === 0)
      return Promise.reject(`Can not save resources, either ${this.constructor.name} repo was not specified a 'fields' property either no data was passed`);

    return collection.insert(guarded)
      .then((res) => new Promise ((resolve, reject) => {
        if (res.ops && res.ops[0] && res.ops[0]._id ) {
          return resolve(res.ops[0])
        }
        else {
          return reject('Response could not be parsed');
        }
      })
    )
  }

  update(query, replace, updateTime = true, noGard) {
    return this._update(this.collection, query, replace, updateTime, noGard?[]:false );
  }

  _update(collection, query, replace, updateTime = true, fieldsOveride ) {
    const fields = fieldsOveride ? fieldsOveride : this.fields;
    let guarded = fp.filtero((v, k) => {
      return fields.indexOf(k) > -1
    }, replace);
    // console.log(query, replace)
    // if (Object.keys(guarded).length === 0)
    //   return Promise.reject(`Can not save resources, either ${this.constructor.name} repo was not specified a 'fields' property either no data was passed`);

    query = typeof query == 'object' ? query : {'_id': new ObjectID(query) };

    updateTime && delete(replace.updated_at);
    replace = {
      $set: replace,
      $currentDate: { updated_at: updateTime }
    }
    return collection.findAndModify(query, [['_id',1]], replace, {upsert: true, new: true});
  }

  unset(query, field) {
    query = typeof query == 'object' ? query : {'_id': new ObjectID(query) };
    replace = {
      $unser: { [field]: "" }
    }
    return this.collection.findAndModify(query, replace);
  }

  fullUpdate(query, replace, updateTime = true) {
    query = typeof query == 'object' ? query : {'_id': new ObjectID(query) };
    replace = {
      replace,
      $currentDate: { updated_at: updateTime }
    }
    return this.collection.findAndModify(query, replace);
  }


  async validate(data, exclude = [], rulesOveride) {
    // Add unique validation rule
    indicative.extend('or', or.bind(this))

    // Add unique validation rule
    indicative.extend('uniquePhone', uniquePhone.bind(this))

    // Add unique validation rule
    indicative.extend('unique', unique.bind(this))
    if (!this.rules && !rulesOveride) throw new Error('No validation rule are present on the model');

    // allow to overide rules
    let rules = rulesOveride ? rulesOveride : this.rules;

    // Exclude some fields from validation. Useful for unique checks when updating a resources
    rules = fp.filtero((v, k) => {
      return exclude.indexOf(k) === -1
    }, rules);

    return indicative
      .validateAll(data, rules)
      .then(() => { console.log('passed'); return true})
      .catch((errors) => {
        this.__errors = errors;
        const error = new ValidationError("notifications.validation_failed");
        error.status = 422;
        error.meta = this.formatErrors();
        throw (error);
      })
  }

  formatErrors() {
    const formated = this.__errors.reduce((prev, next) => {
      prev[next.field] = [next.message];
      return prev;
    }, {})
    return formated;
  }

  getErrors() {
    return this.formatErrors();
  }
}

/**
 * Existance check validator for
 * http://indicative.adonisjs.com/docs/node-validation-rules
 */
var unique = async function (data, field, message, args, get) {
  return new Promise ((resolve, reject) =>  {
    let value = get(data, field);

    if (! field) throw new error('No field was specified for unique checks');
    if (! value) reject(`${field} is required`);


    // if args is we need to change collection
    const collec = args[0] ? this.db.collection(args[0]) : this.collection;

    return collec.findOne({[field]: value})
      .then(res => {

        if (res === null) {
          return resolve('validation passed');
        }

        if (res._id) {
          value = value.number|| value;
          return reject(`${value} is already in use`)
        }

        return reject(`${value} is already in use`)
      })
      .catch(() => {
        throw new error('There was an error when checking for duplicates');
      });
  })
}

/**
 * Or Existance validator
 * http://indicative.adonisjs.com/docs/node-validation-rules
 */
var or = async function (data, field, message, args, get) {
  return new Promise ((resolve, reject) =>  {
    let value = get(data, field);

    if (! field) throw new error('No field was specified for unique checks');

    // if args is specified then check if present on data
    const orField = args.length ? get(data, args[0]) : false;

    if (indicative.is.existy(value)) {
      return resolve('validation passed');
    }
    if (indicative.is.existy(orField)) {
      return resolve('validation passed');
    } else {
      return reject(`Either ${field} or ${orField} should exist`)
    }
  })
}

export default Repo;