import {mongoInit, mongoClose} from '../middlewares/mongodb';
import migrate from 'migrate';
import Promise from 'bluebird';
import {TEST_NUM_VALID} from "../services/SMSProvider";
import {ObjectID} from 'mongodb';
const set = migrate.load('migrations/.migrate-tests', 'migrations');
export const userId = 'test_user_id';
export const cookie =
'jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiJ0ZXN0X3VzZXJfaWQiLCJuaWNrbmFtZSI6InRlc3QtdXNlciIsImlhdCI6MTQ1MjU4MTcwNywiZXhwIjoxNDUyNTkxNzA3fQ.lS0jYD98TqLCEpTzFNAVK4wKzUh48gWoKg_UvkTjKnI;'

export const seedUserData = {
  _id: new ObjectID(userId),
  mobile_number: {
    prefix: '111',
    number: '123123123'
  },
  gender: 'male',
  nickname: 'test-user',
  password: '$2a$10$WYBi7O/RvyfM.48uh2zu/O2t0T2eXI1C8Xrx2cJW0V0lMxsxfPu6m', // -> 123
  birthdate: new Date()
};

export function prepareMongo(done) {
  set.up(function (err) {
    if (err) throw done(err);
    done();
  });
}
export function cleanupMongo(done) {
  set.down(function (err) {
    if (err) throw done(err);
  });
  done();
}

export function cleanupCollections(collections, cb) {
  mongoInit().then((db) => {
    const deletes = collections.map((collection) => {
      return db.collection(collection).remove({});
    });
    Promise.all(deletes).then(function(err, res) {
      db.collection('users').insert(seedUserData);
      cb()
    });
  });
}