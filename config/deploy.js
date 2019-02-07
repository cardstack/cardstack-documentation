/* jshint node: true */

module.exports = function(deployTarget) {
  var ENV = {
    build: {
      environment: "production"
    },
    pipeline: {
      // This setting runs the ember-cli-deploy activation hooks on every deploy
      // which is necessary in order to run ember-cli-deploy-cloudfront.
      // To disable CloudFront invalidation, remove this setting or change it to `false`.
      // To disable ember-cli-deploy-cloudfront for only a particular environment, add
      // `ENV.pipeline.activateOnDeploy = false` to an environment conditional below.
      activateOnDeploy: true
    },
    "revision-data": {
      "type": "version-commit"
    },
    s3: {
      filePattern: '**/*.{js,css,png,gif,ico,jpg,map,xml,txt,svg,swf,eot,ttf,woff,woff2,otf,wasm,json,html}'
    },
    's3-index': {},
  };

  if (deployTarget === 'production') {
    ENV.s3.accessKeyId = process.env.AWS_ACCESS_KEY_ID;
    ENV.s3.secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
    ENV.s3.bucket = 'cardstack-docs';
    ENV.s3.region = 'ap-southeast-1';
    ENV["s3-index"].accessKeyId = process.env.AWS_ACCESS_KEY_ID;
    ENV["s3-index"].secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
    ENV["s3-index"].bucket = 'cardstack-docs';
    ENV["s3-index"].region = 'ap-southeast-1';
    ENV.cloudfront = {
      distribution: 'E2TZ3PLCL45IAQ',
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      objectPaths: [ '/', '/*', '/**/*', '/index.html' ]
    }
  }

  // Note: if you need to build some configuration asynchronously, you can return
  // a promise that resolves with the ENV object instead of returning the
  // ENV object synchronously.
  return ENV;
};
