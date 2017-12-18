<style scoped>
    .demo-upload-list {
        display: inline-block;
        width: 60px;
        height: 60px;
        text-align: center;
        line-height: 60px;
        border: 1px solid transparent;
        border-radius: 4px;
        overflow: hidden;
        background: #fff;
        position: relative;
        box-shadow: 0 1px 1px rgba(0, 0, 0, .2);
        margin-right: 4px;
    }
    .demo-upload-list img {
        width: 100%;
        height: 100%;
    }
    .demo-upload-list-cover {
        display: none;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0, 0, 0, .6);
    }
    .demo-upload-list:hover .demo-upload-list-cover {
        display: block;
    }
    .demo-upload-list-cover i {
        color: #fff;
        font-size: 20px;
        cursor: pointer;
        margin: 0 2px;
    }
</style>

<template>
    <div>
        <Card :bordered="false" dis-hover>
            <p slot="title">
                <Icon type="android-arrow-up" size="20" style="margin-right:20px"></Icon>Upload</p>
            <Row>
                <Col span="24"> Upload to
                <Dropdown @on-click="bucketSelect">
                    <a href="javascript:void(0)">{{ bucketName == null? 'Choose Bucket' : bucketName }}<Icon type="arrow-down-b"></Icon></a>
                    <DropdownMenu slot="list">
                        <DropdownItem v-for="(bucket, index) in bucketList" :name="index">
                            {{ bucket.name }}
                        </DropdownItem> 
                    </DropdownMenu>
                </Dropdown>
                </Col>
            </Row>
            <Row v-if="bucketName != null">
                <Upload
                    ref="upload"
                    :show-upload-list="false"
                    :max-size="40960000000000"
                    :on-exceeded-size="handleMaxSize"
                    :before-upload="handleBeforeUpload"
                    type="drag"
                    action=""
                    style="display: inline-block;width:260px;">
                    <div style="padding: 20px 0">
                        <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                        <p>Click or drag the file to upload here</p>
                    </div>                
                </Upload>
            </Row>
            <Row>
                <template v-if="uploadList.length > 0">
                    <Card :bordered="false">
                        <p slot="title">Upload List</p>
                        <Table height="200" :columns="tableColums" :data="uploadList"></Table>
                    </Card>
                </template>
            </Row>
        </Card>
    </div>
</template>

<script>
    import STROJ_CLIENT from '../../utils/StorjApiClient'
    import iView from 'iview';
    import store from '../../store'

    export default {
        data() {
            return {
                bucketName: null,
                bucketId: null,
                tableColums:[{
                    title: 'File Name',
                    key: 'filename'
                },
                {
                    title: 'Bucket Name',
                    key: 'bucket'
                }]
            }
        },
        created: function () {
            // 页面初始化,获取bucketList
            STROJ_CLIENT.getBucketList(this.username, this.password, function(err) {
                iView.Modal.error({
                    title : 'Obtain Bucket Error',
                    content: 'Obtain Bucket Error :' + err
                });
            }, function(result) {
                store.commit('updateBucketList', result)
            });
        },
        computed: {
            username() {
                return this.$store.state.User.username
            },
            password() {
                return this.$store.state.User.password
            },
            bucketList() {
                return this.$store.state.Bucket.bucketList
            },
            uploadList() {
                return this.$store.state.Upload.uploadList
            }
        },
        methods: {
            handleRemove(file) {
                // 从 upload 实例删除数据
                const fileList = this.$refs.upload.fileList;
                this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
            },
            handleMaxSize(file) {
                this.$Notice.warning({
                    title: 'File Too Large',
                    desc: 'File ' + file.name + ' Too Big'
                });
            },
            handleBeforeUpload(file) {
                console.log("upload-file: " + file.path);
                const bucketCheck = this.bucketName != null && this.bucketId != null
                if(!bucketCheck) {
                    this.$Notice.warning({
                        title: 'Please Choose Bucket Name!'
                    });
                } else {
                    var uploadBucketName = this.bucketName;

                    iView.Message.info('File Uploading...');
                    STROJ_CLIENT.uploadFile(file, this.bucketId, this.username, this.password, function(err) {
                        iView.Notice.error({
                            title: '<b>File Upload Error</b>',
                            desc: 'File: ' + file.path + '<br>Bucket:' + uploadBucketName + '<br>Error:' + err,
                            duration: 0
                        });
                    }, function() {
                        iView.Notice.success({
                            title: '<b>File Upload Success</b>',
                            desc: 'File: ' + file.path + ' <br>Bucket: ' + uploadBucketName,
                            duration: 0
                        });

                        store.commit('addFile', {filename: file.path, bucket: uploadBucketName})
                    }, function(progress, uploadedBytes, totalBytes) {
                    })
                }
            },
            bucketSelect(bucketIndex) {
                this.bucketName = this.bucketList[bucketIndex].name
                this.bucketId = this.bucketList[bucketIndex].id
            }
        }
    }
</script>