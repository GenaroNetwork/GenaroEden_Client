<style scoped>

</style>

<template>
    <div id="list" class="fullheight">
        <div id="file-list">
            <div class="filecard">
                <span class="folder-name-id">Folder Info:{{ folderName }} | {{ folderId }}</span>
                <span class="file-info">
                    <Dropdown @on-click="bucketAction" class="folder-action">
                        <a href="javascript:void(0)">
                            Action
                            <Icon type="arrow-down-b"></Icon>
                        </a>
                        <DropdownMenu slot="list">
                            <DropdownItem name="delete">Delete Folder</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </span>
                <router-link to="/folders">Back</router-link>
                <div class="files">
                    <Table :loading="fileListLoading" no-data-text="No Data" :columns="fileTableColums" :data="bucketFileList"></Table>
                </div>
            </div>
        </div>
        <template>
            <!-- 显示receipt的modal -->
            <Modal v-model="show_receipt_modal" width="500" :closable="false">
                <div style="text-align:center">
                    <Row>
                        <Col span="4"><h4>Filename:</h4></Col>
                        <Col span="20">{{ selected.selectFileName }}</Col>
                    </Row>
                    <Row>
                        <Col span="4"><h4>File Id:</h4></Col>
                        <Col span="20">{{ selected.selectFileId }}</Col>
                    </Row>
                    <Row>
                        <Col span="4"><h4>GNX Paid:</h4></Col>
                        <Col span="20">0 (free for beta testing)</Col>
                    </Row>
                    <Row>
                        <Col span="4"><h4>QR Code:</h4></Col>
                        <Col span="20"><img :src="fileQrCode"></Col>
                    </Row>
                </div>
                <div slot="footer">
                    <input id="fileDialog" type="file" nwsaveas hidden/>
                    <Button v-if="!fileDownloadFlag" type="primary" size="large"  @click="downloadFile">Download File</Button>
                    <Button type="error" size="large"  @click="show_del_file_modal = true">Delete File</Button>
                </div>
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

            <!-- 删除File确认框 -->
            <Modal v-model="show_del_file_modal" :closable="false">
                <div style="height:40px; margin-top: 5px; margin-bottom:10px;">
                    <Row>
                        <h3>Confirm Delete File?</h3>
                    </Row>
                    <Row>
                        <Col span="8">
                            <h4>BucketName:</h4>
                        </Col>
                        <Col span="16">
                            {{ selected.selectBucketName }}
                        </Col>
                    </Row>
                    <Row>
                        <Col span="8">
                            <h4>FileName:</h4>
                        </Col>
                        <Col span="16">
                            {{ selected.selectFileName }}
                        </Col>
                    </Row>
                </div>
                <div slot="footer">
                    <Button type="primary" size="large"  @click="show_del_file_modal = false">Cancel</Button>
                    <Button type="error" size="large"  @click="deleteFile">Delete</Button>
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
                folderId: '',
                folderName: '',
                add_bucket_modal: false,
                show_buckets_modal: false,
                show_receipt_modal: false,
                show_del_bucket_modal: false,
                show_del_file_modal: false,
                addBucketItem: {
                    bucketName: ''
                },
                fileTableColums: [{
                    title: 'File Name',
                    key: 'filename',
                },
                {
                    title: 'File Id',
                    key: 'id',
                    width: 220
                },
                {
                    title: 'Action',
                    key: 'action',
                    align: 'center',
                    width: 230,
                    render: (h, params) => {
                        return h('div', [
                            h('a', {
                                props: {
                                    type: 'primary',
                                    size: 'small'
                                },
                                style: {
                                    marginLeft: '23px',
                                    marginRight: '3px'
                                },
                                on: {
                                    click: () => {
                                        this.showReceipt(params.row.filename, params.row.id)
                                    }
                                }
                            },'Receipt'),
                            h('a', {
                                props: {
                                    type: 'primary',
                                    size: 'small'
                                },
                                style: {
                                    marginRight: '3px'
                                },
                                on: {
                                    click:() => {
                                        this.selected.selectFileName = params.row.filename
                                        this.selected.selectFileId = params.row.id
                                        this.downloadFile()
                                    }
                                }
                            }, 'Download'),
                            h('a', {
                                props: {
                                    type: 'primary',
                                    size: 'small'
                                },
                                style: {
                                    marginRight: '3px'
                                },
                                on: {
                                    click:() => {
                                        this.selected.selectFileName = params.row.filename
                                        this.selected.selectFileId = params.row.id
                                        this.show_del_file_modal = true
                                    }
                                }
                            }, 'Delete')
                        ])
                    }
                }],
                selected: {
                    selectBucketName: '',
                    selectBucketId: '',
                    selectFileName: '',
                    selectFileId: ''
                }
            }
        },
        created: function () {
            this.folderId = this.$route.params.folderId
            this.folderName = this.$route.query.folderName
            FILEINDEX_JS.initFileList(this.username, this.password, this.folderId)
        },
        mounted: function (){
            stepReady('new-folder')
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
            showBucketList() {
                return this.$store.state.Bucket.showBucketList
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
                FILEINDEX_JS.checkFileDownload(this.folderId, this.selected.selectFileId, function(result) {
                    if(result.length > 0)
                        store.commit('updateFileDownloadFlag', true)
                    else 
                        store.commit('updateFileDownloadFlag', false)
                })
            },
            // 文件删除操作
            deleteFile() {
                FILEINDEX_JS.deleteFile(this.username, this.password, 
                    this.folderId, this.selected.selectFileId)
                this.show_del_file_modal = false
                this.show_receipt_modal = false
            },
            // 文件下载
            downloadFile() {
                // 弹出保存对话框配置
                let this2 = this
                var options = {
                    title: 'Save File',
                    defaultPath: './' + this.selected.selectFileName
                }
                var downSelect = this.selected
                var bridgeUser = this.username
                var bridgePass = this.password                
                // 校验文件是否已经下载
                FILEINDEX_JS.checkFileDownload(this2.folderId, this.selected.selectFileId, function(result) {
                    if(result.length == 0) {
                        // 显示保存对话框
                        ELECTRON_DIALOG.showSaveDialog(options, function(filepath) {
                            iView.Message.info('File Downloading...');
                            var downloadNoticeArgs = {
                                desc: 'Source File: ' + downSelect.selectFileName + ' <br>Folder: ' + downSelect.selectBucketName + ' <br>Target: ' + filepath,
                                duration: 5
                            }
                            // 修改文件下载状态 = true
                            store.commit('updateFileDownloadFlag', true)
                            let task = STROJ_CLIENT.downloadFile(this2.folderId, downSelect.selectFileId, filepath, bridgeUser, bridgePass, function(err) {
                                downloadNoticeArgs['title'] = 'File Download Error'
                                downloadNoticeArgs['err'] = err
                                IVIEW_UTIL.showErrNotice(downloadNoticeArgs)
                                store.commit('updateDownloadTask', task)
                            }, function() {
                                downloadNoticeArgs['title'] = 'File Download Success'
                                IVIEW_UTIL.showSuccessNotice(downloadNoticeArgs)
                                
                                // 更新文件下载列表
                                store.commit('updateDownloadFileList', {
                                    filename: downSelect.selectFileName,
                                    filepath : filepath,
                                    bucketName: downSelect.selectBucketName
                                })
                                store.commit('updateDownloadTask', task)
                                // 保存文件记录
                                FILEINDEX_JS.saveDownloadFile(this2.folderId, downSelect.selectFileId, function() {})
                            }, function(progress, downloadedBytes, totalBytes) {
                                store.commit('updateDownloadTask', task)
                            })
                        })
                    } else {
                        IVIEW_UTIL.showWarnAlert('File Already Download')
                    }
                })
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

                STROJ_CLIENT.deleteBucket(this.selected.selectBucketId, bridgeUser, bridgePass, 
                        function(err) {}, 
                        function(result) {
                            // 页面初始化,获取bucketList
                            iView.Message.info('Folder Delete Success');
                            FILEINDEX_JS.initBucketList(bridgeUser, bridgePass)
                        }
                )

                this.selected.selectBucketId = ''
                this.show_del_bucket_modal = false
            }
        }
    }
</script>