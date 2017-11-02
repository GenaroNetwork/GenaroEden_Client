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

const testBucketName = 'test-bucket-for-genaro';
/* 创建Bucket */
storj.createBucket(testBucketName, function (err, result) {
    if (err) {
        return console.error(err);
    }
    console.log('create-bucket:', result);
    /* 获取 api 信息 */
    storj.getInfo(function (err, result) {
        if (err) {
            return console.error(err);
        }
        console.log('get-info:', result);
        /* 获取 list of available buckets */
        storj.getBuckets(function (err, result) {
            if (err) {
                return console.error(err);
            }
            console.log('get-buckets:', result);
            /*
            for(var bucket in result){
                var testBucketId = bucket.id;
                var testBucketName = bucket.name;
            }
            */
            var testBucketId = result[0].id;
            var testBucketName = result[0].name;
            var uploadFilePath = './test-upload.json';
            var downloadFilePath = './test-download.json';
            var fileName = 'test-upload.json';
            /* upload file */
            storj.storeFile(testBucketId, uploadFilePath, {
                filename: fileName,
                progressCallback: function (progress, uploadedBytes, totalBytes) {
                    console.log('Progress: %d, uploadedBytes: %d, totalBytes: %d', progress, uploadedBytes, totalBytes);
                },
                finishedCallback: function (err, fileId) {
                    if (err) {
                        return console.error(err);
                    }
                    console.log('File upload complete:', fileId);
                    /* list files */
                    storj.listFiles(testBucketId, function (err, result) {
                        if (err) {
                            return console.error(err);
                        }
                        console.log('lsit-files:', result);
                        /* download file */
                        storj.resolveFile(testBucketId, fileId, downloadFilePath, {
                            progressCallback: function (progress, downloadedBytes, totalBytes) {
                                console.log('Progress: %d, downloadedBytes: %d, totalBytes: %d', progress, downloadedBytes, totalBytes);
                            },
                            finishedCallback: function (err) {
                                if (err) {
                                    return console.error(err);
                                }
                                console.log('File download complete');
                                storj.destroy();
                            }
                        });
                    });
                }
            });
        });
    });
});

