import bcrypt from 'bcrypt';

export function checkHash( clear, hash ) {
	return new Promise(function(resolve,reject){
		bcrypt.compare(clear, hash, function(err, res) {
        if (err) return reject(err);
        return resolve(res)
		});
	})
}

export function hashPass( pass ) {
  return new Promise(function(resolve,reject){
    bcrypt.genSalt(10, function(err, salt) {
      if (err) return reject(err);
      bcrypt.hash(pass, salt, function(err, hash) {
        if (err) return reject(err);
        return resolve(hash)
      });
    });
  });
}