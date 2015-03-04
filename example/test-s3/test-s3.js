if (Meteor.isClient) {
  Session.setDefault('url', '');
  Session.setDefault('path', '');
  Template.S3Upload.events({
    'change #upload-to-s3': function (e) {

      S3.callUpload('uploadFile', e.currentTarget.files, function (error, result) {
        if (!error) {
          Session.set('url', result.url);
          Session.set('path', result.path);
        } else {
          console.log(error);
        }
      });
    },
    'click .delete': function (e) {
      Meteor.call('deleteFile', this.url, this.path, function(error, result) {
        if (!error)
          Session.set('url', '');
          Session.set('path', '');
      })
    },
  });

  Template.S3Upload.helpers({
    file: function () {
      if (Session.get('url'))
        return { url: Session.get('url'), path: Session.get('path') };
    },

  });
}

if (Meteor.isServer) {
  Meteor.methods({
    uploadFile: function (file) {
      console.log("file: ", file.data);
      var s3 = new S3('meteor-test-bucket');
      return s3.putBuffer(file, '/subfolder/');
    },


    deleteFile: function (fileUrl) {
      var s3 = new S3('meteor-test-bucket');
      return s3.deleteFile(fileUrl, '/subfolder/');
    },


    uploadStaticFile: function () {
      var file = process.env.PWD + '/public/rainhaven.png';
      var s3 = new S3('meteor-test-bucket');
      return s3.putFile(file, '/subfolder/');
    }
  })

}
