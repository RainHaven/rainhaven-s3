Package.describe({
  name: 'rainhaven:s3',
  summary: 'S3 and knox for Meteor',
  version: '1.0.1',
  git: 'https://github.com/RainHaven/rainhaven-s3.git'
});

Npm.depends({
  knox: "0.9.2"
});

Package.onUse(function(api) {
  api.versionsFrom('1.0.2.1');

  api.addFiles('client/s3.js', 'client');
  api.addFiles('server/s3.js', 'server');

  api.export('S3', ['client', 'server']);
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('rainhaven:s3');
  api.addFiles('rainhaven:s3-tests.js');
});
