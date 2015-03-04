Knox = Npm.require("knox");
var Future = Npm.require('fibers/future');
var path = Npm.require('path');

S3 = function(bucket, file, options) {
  options = options || {};
  this.bucket = bucket;
  this.file = file;
  this.directory = options.directory || '/';
  this.fileName = options.fileName || Meteor.uuid();
}

S3.prototype.createClient = function () {
  if (_.isEmpty(Meteor.settings) && _.isEmpty(Meteor.settings.s3))
    throw new Meteor.Error('Metoer Settings Error', 'Don\'t forget to set your s3 key and secret in your settings file')

  if (typeof Meteor.settings.s3.key === 'undefined' || typeof Meteor.settings.s3.secret === 'undefined')
    throw new Meteor.Error('Metoer Settings Error', 'Don\'t forget to set your s3 key and secret in your settings file')

  var s3 = Meteor.settings.s3;

  var knox = Knox.createClient({
    key: s3.key,
    secret: s3.secret,
    bucket: this.bucket
  });

  return knox;
}

S3.prototype.getUniqueFileName = function (fileName) {
  var extension = (fileName).match(/\.[0-9a-z]{1,5}$/i);
  return Meteor.uuid() + extension;
}

S3.prototype.putBuffer = function (fileData, folder, fileName) {

  var self = this,
      folder = folder || '/',
      file = fileName || this.getUniqueFileName(fileData.name),
      s3Path = folder + file,
      knox = this.createClient();

  fileData.name = file;

  var buffer = new Buffer(fileData.data);
  var putBufferSync = Meteor.wrapAsync(knox.putBuffer, knox);

  var result = putBufferSync(buffer, s3Path, { "Content-Type": fileData.type, "Content-Length": buffer.length });

  if (result)
    return { url: knox.http(s3Path), path: s3Path };
  else
    throw new Meteor.Error('S3 Error', 'Error calling putBufferSync');

}

S3.prototype.putFile = function (fullFile, folder) {

  var self = this,
      knox = this.createClient(),
      url = fullFile,
      fileName = path.basename(fullFile),
      folder = folder || '/',
      s3Path = path.join(folder, fileName);

  var putFileSync = Meteor.wrapAsync(knox.putFile, knox);

  var result = putFileSync(url, s3Path);

  if (result)
    return { url: knox.http(s3Path), path: s3Path };
  else
    throw new Meteor.Error('S3 Error', 'Error calling putFileSync');

}

S3.prototype.deleteFile = function(fullFile, folder) {

  var self = this,
      knox = this.createClient(),
      url = fullFile,
      fileName = path.basename(fullFile),
      folder = folder || '/',
      s3Path = path.join(folder, fileName);

  var deleteFileSync = Meteor.wrapAsync(knox.deleteFile, knox);

  var result = deleteFileSync(s3Path);

  if (result)
    return s3Path;
  else
    throw new Meteor.Error('S3 Error', 'Error calling deleteFileSync');

}
