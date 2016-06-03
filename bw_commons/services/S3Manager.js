import fs from 'fs';
import util from 'util';
import AWS from 'aws-sdk';
import debug from 'debug';
const log = debug('bw:AWS');

AWS.config.update({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const Bucket = 'bw-uploads-dev';

// var params = {
//   Bucket: 'bw-uploads-dev', /* required */
//   Key: 'test', /* required */
//   PartNumber: 0, /* required */
//   UploadId: 'uploadId', /* required */
//   Body: new Buffer(file),
// };
// s3.uploadPart(params, function(err, data) {
//   if (err) console.log(err, err.stack); // an error occurred
//   else     console.log(data);           // successful response
// });

export const upload = function(file, path = "") {
  log('uploading to S3:', file.filename)
  var s3obj = new AWS.S3({params: {Bucket, Key: path}});
  return new Promise((resolve, reject) => {
    s3obj.upload({Body: file})
      .on('httpUploadProgress', function(evt) { log(evt); })
      .on('httpUploadProgress', function(evt) { log(evt); })
      .send(function(err, data) {
        if (err) {
          log(`Error while saving ${file.filename} to S3: `, err);
          reject(err);
        };
        log('Succesfully uploaded file to S3: ', data)
        resolve(data);
      });
    })
}


export const deleteObject = function(path, next) {
  var s3obj = new AWS.S3();
  let Delete = {};
  Delete.Objects = [{"Key": path}];
  return new Promise((resolve, reject) => {
    s3obj.deleteObjects({Bucket, Delete}, function(err, data) {
      if (err) reject(err);
      resolve(path);
      return log(`Succesfully deleted ${path}`)
    });
  })
}

export const deleteDirectory = function(path, next, errCb) {
  if (!path) throw new Error('No path was specified');
  var s3obj = new AWS.S3();
  s3obj.listObjects({Bucket, Prefix: path}, function(err, data) {
    if (err) return console.log(err);
    let Delete = {};
    Delete.Objects = [];
    if (data.Contents.length === 0) return log(`Nothing to delete in ${path}`);

    data.Contents.forEach(function(content) {
      Delete.Objects.push({Key: content.Key});
    });

    s3obj.deleteObjects({Bucket, Delete}, function(err, data) {
      if (err) return console.log(err);
      return log(`Succesfully deleted ${data.Deleted.length} object(s) from ${path}`)
    });
  });
}


export const moveDirectory = function(from, to, next, errCb) {
  if (!from) throw new Error('No path was specified');
  var s3obj = new AWS.S3();
  s3obj.listObjects({Bucket, Prefix: from}, function(err, data) {
    if (err) return console.log(err);

    data.Contents.forEach(function(content) {
      let params = {
        Bucket,
        CopySource: Bucket + '/' + content.Key,
        Key: content.Key.replace(from, to)
      }

      s3obj.copyObject(params, function(err, data) {
          if (err) return console.log(err);
          console.log('Coppied:', data)
          //deleteObject(from)
          // s3obj.deleteObjects({Bucket, Delete}, function(err, data) {
          //   if (err) return console.log(err);
          //   return log(`Succesfully deleted ${data.Deleted.length} object(s) from ${path}`)
          // });
      });
    });


  });
}


