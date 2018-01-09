<style scoped>
    #bucket-list {
        display: flex;
        flex-wrap: wrap;
    }
</style>

<template>
    <div class="fullheight">

        <p class="folderstext">Folders <a @click="add_bucket_modal=true">+</a></p> 
        <div id="bucket-list">
            <div v-for="item in showBucketList">
                <Button type="ghost" style="width:195px" @click="bucketBtnClick({label: item.name, value: item.id})">{{ item.name }}</Button>
            </div>
        </div>
        <template>
            <!-- 添加bucket的modal -->
            <Modal 
                v-model="add_bucket_modal" title="Add Folder" 
                @on-ok="addBucketOk" @on-cancel="addBucketCancel"
                ok-text="OK" cancel-text="Cancel" :closable="false">
                <Row>
                    <Col span="5"><h4>Folder Name:</h4></Col>
                    <Col span="19"><Input v-model="addBucketItem.bucketName" placeholder="Input Folder Name" v-on:on-enter="addBucketOk"></Input></Col>
                </Row>
            </Modal>

            <!-- 删除Bucket确认框-->
            <Modal v-model="show_del_bucket_modal" ok-text="OK" cancel-text="Cancel" :closable="false">
                <div style="height:40px; margin-top: 20px">
                        <h4>Confirm Delete Folder: {{ selected.selectBucketName }}</h4>
                        <p>All your files in this folder will be deleted. This action cannot be undone.</p>
                    </Row>
                </div>
                <div slot="footer">
                    <Button type="primary" size="large"  @click="show_del_bucket_modal = false">Cancel</Button>
                    <Button type="error" size="large"  @click="deleteBucket">Delete</Button>
                </div>
            </Modal>
        </template>
    </div>
</template>

<script>
    import STROJ_CLIENT from '../../utils/StorjApiClient'
    import QR_CODE from '../../utils/QrCodeUtil'
    import ELECTRON_DIALOG from '../../utils/ElectronDialog'
    import IVIEW_UTIL from '../../utils/IviewUtil'
    import FILEINDEX_JS from '../../js/FileIndexJs'
    import iView from 'iview';
    import store from '../../store'
    import {stepReady} from "../../utils/guide"

    export default {
        data() {
            return {
                add_bucket_modal: false,
                show_buckets_modal: false,
                show_receipt_modal: false,
                show_del_bucket_modal: false,
                show_del_file_modal: false,
                addBucketItem: {
                    bucketName: ''
                },
                selected: {
                    selectBucketName: '',
                    selectBucketId: '',
                    selectFileName: '',
                    selectFileId: ''
                }
            }
        },
        created: function () {
            this.$store.dispatch('fetchBucketList')
        },
        mounted: function (){
            stepReady('new-folder')
        },
        computed: {
            showBucketList() {
                return this.$store.state.Bucket.bucketList
            },
            username() {
                return this.$store.state.User.username
            },
            password() {
                return this.$store.state.User.password
            },
            bucketList() {
                return this.$store.state.Bucket.bucketList
            },
            moreBucketList() {
                return this.$store.state.Bucket.moreBucketList
            },
            bucketFileList() {
                return this.$store.state.File.bucketFileList
            },
            fileListLoading() {
                return this.$store.state.File.fileListLoading
            },
            fileQrCode() {
                return this.$store.state.File.fileQrCode
            },
            fileDownloadFlag() {
                return this.$store.state.File.fileDownloadFlag
            }
        },
        methods: {
            // 添加Bucket 确认按钮事件
            addBucketOk() {
                if (this.addBucketItem.bucketName != '') {
                    var bucketName = this.addBucketItem.bucketName
                    var bridgeUser = this.username
                    var bridgePass = this.password

                    // iView.Message.info('Add Folder Waiting');

                    this.$store.dispatch('createBucket', {bucketName}).then(data => {
                        iView.Message.info('Add Folder Success')
                    }).catch( e => {
                        var noticeArgs = {
                            title: 'Create Folder Error',
                            desc: 'Folder Name: ' + bucketName,
                            err: err,
                            duration: 5
                        }
                        IVIEW_UTIL.showErrNotice(noticeArgs)
                    })
                    this.addBucketItem.bucketName = ''
                    this.add_bucket_modal=false
                }
            },
            // 添加Bucket 取消按钮事件
            addBucketCancel() {
                this.addBucketItem.bucketName=''
            },
            // Bucket按钮单击事件
            bucketBtnClick(bucket) {
                this.$router.push({ path: '/folder/' + bucket.value, query: { folderName: bucket.label }})
            },
            // 显示文件Receipt模态框事件
            showReceipt(filename, fileId) {
                this.selected.selectFileName = filename
                this.selected.selectFileId = fileId
                this.show_receipt_modal = true

                // 生成文件二维码
                QR_CODE.createQrCodeStr(fileId, function(error) {}, function(result) {
                    store.commit('updateFileQrCode', result)
                })

                // 检查文件是否已经下载
                FILEINDEX_JS.checkFileDownload(this.selected.selectBucketId, this.selected.selectFileId, function(result) {
                    if(result.length > 0)
                        store.commit('updateFileDownloadFlag', true)
                    else 
                        store.commit('updateFileDownloadFlag', false)
                })
            },
            // 文件删除操作
            deleteFile() {
                FILEINDEX_JS.deleteFile(this.username, this.password, this.selected.selectBucketId, this.selected.selectFileId)
                this.show_del_file_modal = false
                this.show_receipt_modal = false
            },
            // Bucket Action的操作
            bucketAction(name) {
                if (name === 'delete') {
                    this.show_del_bucket_modal = true
                }
            },
            // Bucket 删除操作
            deleteBucket() {
                var bridgeUser = this.username
                var bridgePass = this.password

                this.$store.dispatch('deleteBucket', {selectBucketId}).then(data => {
                    iView.Message.info('Folder Delete Success');
                }).catch( e => {
                    
                })
                this.selected.selectBucketId = ''
                this.show_del_bucket_modal = false
            }
        }
    }
</script>