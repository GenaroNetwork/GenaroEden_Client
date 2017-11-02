const {
    Environment
} = require('storj');

const storj = new Environment({
    bridgeUrl: 'https://api.storj.io',
    bridgeUser: 'gencodettt@gmail.com',
    bridgePass: '*****',
    encryptionKey: 'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about',
    logLevel: 0
});

/* delete bucket */
storj.getBuckets(function (err, result) {
    if (err) {
        return console.error(err);
    }
    console.log('get-buckets:', result);
    var testBucketId = result[0].id;
    storj.deleteBucket(testBucketId,function (err,result) {
        if(err){
            return console.error(err);
        }
        console.log('delete-bucket:',result);
        storj.destroy();
    })
});
