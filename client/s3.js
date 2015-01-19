// S3 = function (bucket, subFolder) {
//   this.bucket = bucket;
//   this.subFolder = subFolder;
// }

S3 = {

  callUpload: function (method, files, cb) {
    _.each(files, function(file) {
      var reader = new FileReader;
      var fileData = {
        name: file.name,
        size: file.size,
        type: file.type
      };

      reader.onload = function () {
        fileData.data = new Uint8Array(reader.result);
        Meteor.call(method, fileData, function(error, result) {
          if (_.isFunction(cb))
            cb(error, result)
        });
      };

      reader.readAsArrayBuffer(file);
    });
  }
}

