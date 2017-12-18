<style scoped>

    .layout-file-qr {
        height: 170px;
        width: 170px;
    }

    .ivu-card-head p, .ivu-card-head-inner {
        height: 25px;
    }

</style>

<template>
    <div id="list">
         <div id="bucket-list" style="background:#eee">
            <Card :bordered="false" dis-hover>
                <p slot="title" id="add-bucket-title">Buckets</p> 
                <Row type="flex" justify="start">
                    <Col span="8" style="padding-top:3px" v-for="item in showBucketList">
                        <Button type="ghost" style="width:195px" @click="bucketBtnClick({label: item.name, value: item.id})">{{ item.name }}</Button>
                    </Col>
                    <Col v-if="bucketList.length >= 5" span="8" style="padding-top:3px">
                        <Select style="width:195px" placeholder="More Bucket" @on-change="bucketBtnClick" label-in-value>
                            <Option v-for="item in moreBucketList" :value="item.id" :label="item.name">{{ item.name }}</Option>
                        </Select>
                    </Col>
                    <Col span="8" style="padding-top:3px">
                        <Button type="dashed" style="width:195px" @click="add_bucket_modal=true">Add Bucket</Button>
                    </Col>
                </Row>
            </Card>
        </div>
        <div id="file-list" style="background:#eee">
            <Card v-if="selected.selectBucketName != '' && selected.selectBucketId != ''" :bordered="false" dis-hover>
                <p slot="title">Files</p>
                Bucket Info:{{ selected.selectBucketName }} | {{ selected.selectBucketId }} 
                <Dropdown @on-click="bucketAction">
                    <a href="javascript:void(0)">
                        Action
                        <Icon type="arrow-down-b"></Icon>
                    </a>
                    <DropdownMenu slot="list">
                        <DropdownItem name="delete">Delete</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
                <Table :loading="fileListLoading" no-data-text="No Data" height="260" :columns="fileTableColums" :data="bucketFileList"></Table>
            </Card>
        </div>
            <template>
                <!-- 添加bucket的modal -->
                <Modal 
                    v-model="add_bucket_modal" title="Add Bucket" 
                    @on-ok="addBucketOk" @on-cancel="addBucketCancel"
                    ok-text="OK" cancel-text="Cancel" :closable="false">
                    <!-- <Form :model="addBucketItem" :label-width="100">
                        <FormItem label="Bucket Name">
                            <Input v-model="addBucketItem.bucketName" placeholder="Input Bucket Name" v-on:on-enter="addBucketOk"></Input>
                        </FormItem>
                    </Form> -->
                    <Row>
                            <Col span="5"><h4>Bucket Name:</h4></Col>
                            <Col span="19"><Input v-model="addBucketItem.bucketName" placeholder="Input Bucket Name" v-on:on-enter="addBucketOk"></Input></Col>
                        </Row>
                </Modal>

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
                            <Col span="20">0</Col>
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
                        <Row>
                            <Col span="8">
                                <h4>Confrim Delete Bucket:</h4>
                            </Col>
                            <Col span="16">
                                {{ selected.selectBucketName }}
                            </Col>
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
            // 页面初始化,获取bucketList
            FILEINDEX_JS.initBucketList(this.username, this.password)
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
            // 添加Bucket 确认按钮事件
            addBucketOk() {
                if (this.addBucketItem.bucketName != '') {
                    var bucketName = this.addBucketItem.bucketName
                    var bridgeUser = this.username
                    var bridgePass = this.password

                    // iView.Message.info('Add Bucket Waiting');

                    // 调用创建Bucket Api
                    STROJ_CLIENT.createBucket(bucketName, bridgeUser, bridgePass,
                        function(err) {
                            // 显示错误Notice
                            var noticeArgs = {
                                title: 'Create Bucket Error',
                                desc: 'Bucket Name: ' + bucketName,
                                err: err,
                                duration: 5
                            }
                            IVIEW_UTIL.showErrNotice(noticeArgs)
                        }, function(result) {
                            iView.Message.info('Add Bucket Success');

                            // 添加完成后 刷新Bucket列表
                            FILEINDEX_JS.initBucketList(bridgeUser, bridgePass)
                        }
                    )
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
                this.selected.selectBucketName = bucket.label
                this.selected.selectBucketId = bucket.value

                // 获取文件列表
                FILEINDEX_JS.initFileList(this.username, this.password, bucket.value)
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
                FILEINDEX_JS.deleteFile(this.username, this.password, 
                    this.selected.selectBucketId, this.selected.selectFileId)
                this.show_del_file_modal = false
                this.show_receipt_modal = false
            },
            // 文件下载
            downloadFile() {
                // 弹出保存对话框配置
                var options = {
                    title: 'Save File',
                    defaultPath: './' + this.selected.selectFileName
                }
                var downSelect = this.selected
                var bridgeUser = this.username
                var bridgePass = this.password                
                // 校验文件是否已经下载
                FILEINDEX_JS.checkFileDownload(this.selected.selectBucketId, this.selected.selectFileId, function(result) {
                    if(result.length == 0) {
                        // 显示保存对话框
                        ELECTRON_DIALOG.showSaveDialog(options, function(filepath) {
                            iView.Message.info('File Downloading...');
                            var downloadNoticeArgs = {
                                desc: 'Source File: ' + downSelect.selectFileName + ' <br>Bucket: ' + downSelect.selectBucketName + ' <br>Target: ' + filepath,
                                duration: 5
                            }

                            // 修改文件下载状态 = true
                            store.commit('updateFileDownloadFlag', true)
                            STROJ_CLIENT.downloadFile(downSelect.selectBucketId, downSelect.selectFileId,
                                filepath, bridgeUser, bridgePass, function(err) {
                                    downloadNoticeArgs['title'] = 'File Download Error'
                                    downloadNoticeArgs['err'] = err
                                    IVIEW_UTIL.showErrNotice(downloadNoticeArgs)
                                }, function() {
                                    downloadNoticeArgs['title'] = 'File Download Success'
                                    IVIEW_UTIL.showSuccessNotice(downloadNoticeArgs)
                                    
                                    // 更新文件下载列表
                                    store.commit('updateDownloadFileList', {
                                        filename: downSelect.selectFileName,
                                        filepath : filepath,
                                        bucketName: downSelect.selectBucketName
                                    })

                                    // 保存文件记录
                                    FILEINDEX_JS.saveDownloadFile(downSelect.selectBucketId, downSelect.selectFileId, function() {})
                                }, function(progress, downloadedBytes, totalBytes) {}
                            )
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
                            iView.Message.info('Bucket Delete Success');
                            FILEINDEX_JS.initBucketList(bridgeUser, bridgePass)
                        }
                )

                this.selected.selectBucketId = ''
                this.show_del_bucket_modal = false
            }
        }
    }
</script>