```sh
$ meteor add rainhaven:s3
```
# Example and Setup

The first step is to ensure that you have the correct permissions on your s3 bucket to allow public access.

#### Bucket policy:

```json
{
	"Version": "2008-10-17",
	"Statement": [
		{
			"Sid": "AllowPublicRead",
			"Effect": "Allow",
			"Principal": {
				"AWS": "*"
			},
			"Action": "s3:GetObject",
			"Resource": "arn:aws:s3:::your-buckets-name/*"
		}
	]
}
```

#### CORS Config:

```json
<?xml version="1.0" encoding="UTF-8"?>
<CORSConfiguration xmlns="http://s3.amazonaws.com/doc/2006-03-01/">
    <CORSRule>
        <AllowedOrigin>*</AllowedOrigin>
        <AllowedMethod>GET</AllowedMethod>
        <AllowedMethod>PUT</AllowedMethod>
        <AllowedMethod>POST</AllowedMethod>
        <AllowedMethod>DELETE</AllowedMethod>
        <MaxAgeSeconds>3000</MaxAgeSeconds>
        <ExposeHeader>Accept-Ranges</ExposeHeader>
        <ExposeHeader>Content-Encoding</ExposeHeader>
        <ExposeHeader>Content-Length </ExposeHeader>
        <ExposeHeader>Content-Range</ExposeHeader>
        <AllowedHeader>*</AllowedHeader>
    </CORSRule>
</CORSConfiguration>
```

From there you can set up a settings.json file in your app and set the s3 key and secret. If you don't already have your IAM user set up, you can do that [here](https://console.aws.amazon.com/iam/)

In the example app, there's a settings file: example/test-s3/config/development/settings.json:

```json
{
  "s3": {
    "key": "<Access-Key-ID>",
    "secret": "<Secret-Access-Key>"
  }
}
```

The next step is to start your app with the settings flag:
```sh
$ meteor --settings /config/development/settings.json
```


# Usage

This package wraps the [knox](https://www.npmjs.com/package/knox) api in Meteors wrapasync functions to provide a synchronous style api.

## putBuffer

rainhaven:s3 includes a helper to read the file data from an input change event:
#### html
```html
<input type="file" id="upload-to-s3">
```

#### Client
```js
'change #upload-to-s3': function (e) {
	S3.callUpload('uploadFile', e.currentTarget.files, function (error, result) {
	  if (!error) {
	    Session.set('url', result.url);
	    Session.set('path', result.path);
	  } else {
	    console.log(error);
	  }
	});
}
```

#### Server
```js
Meteor.methods({
    uploadFile: function (file) {
      var s3 = new S3('meteor-test-bucket');
      return s3.putBuffer(file, '/subfolder/');
    },
})
```
putBuffer also accepts an optional 3rd "fileName" parameter. By default, putBuffer will use Meteor.uuid() to create a unique file name.


## deleteFile

#### Client
```js
'click .delete': function (e) {
  Meteor.call('deleteFile', this.url, function(error, result) {
    if (!error)
      ...
  })
},
```

#### Server
```js
Meteor.methods({
  deleteFile: function (fileUrl) {
    var s3 = new S3('meteor-test-bucket');
    return s3.deleteFile(fileUrl, '/subfolder/');
  }
})
```

## putFile

If you already have the file access to file, you can use putFile:
#### Server
```js
Meteor.methods({
	uploadStaticFile: function () {
	  var file = process.env.PWD + '/public/public-image.png';
		var s3 = new S3('meteor-test-bucket');
		return s3.putFile(file, '/subfolder/');
	}
});
```

# TODO
- change S3.callUpload to handle form submissions
- finish wrapping knox with Meteor wrapasync
