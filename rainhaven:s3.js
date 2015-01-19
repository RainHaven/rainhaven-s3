S3 = function (bucket, options) {
  this.bucket = bucket;

  options = options || {};
  this.fileName = options.fileName || Meteor.uuid();
}

S3.prototype.upload = function (bucket, options, cb) {
  var cb = cb;

  Meteor.call('upload', 'stuff', function(error, result) {

    if (_.isFunction(cb))
      cb(error, result);

  });
}
