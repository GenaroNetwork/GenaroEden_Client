<style scoped>
.files {
    position: relative;
}
.overlay {
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: rgba(117, 190, 218, 0.5);;
    top: 0;
    left: 0;
}
</style>

<template>
    <div id="list" class="fullheight">
        <div id="file-list">
            <div class="filecard">
                <span class="folder-name-id">Folder Info:{{ folderName }} | {{ folderId }}</span>
                <span class="file-info">
                    <el-dropdown @on-click="bucketAction" class="folder-action">
                        <span class="el-dropdown-link">
                            Actions<i class="el-icon-arrow-down el-icon--right"></i>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item>Delete Folder</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </span>
                <router-link to="/folders">Back</router-link>
                <el-button type="primary" @click="upload">上传<i class="el-icon-upload el-icon--right"></i></el-button>
                <div class="files" @dragover.stop.prevent="fileDragOver" @dragleave.stop.prevent="fileDragLeave" @drop.stop.prevent="fileDrop">
                    <el-table :data="fileList" style="width: 100%">
                        <el-table-column prop="filename" label="File Name" width="180"></el-table-column>
                        <el-table-column prop="date" label="Size" width="180"></el-table-column>
                        <el-table-column prop="date" label="Time" width="180"></el-table-column>
                        <el-table-column prop="id" label="File ID" width="180"></el-table-column>
                    </el-table>
                    <div class="overlay" v-if="dragging">
                        <h2>drop to upload your files to {{folderName}}</h2>
                    </div>
                </div>
            </div>
        </div>
        <!-- 显示receipt的modal -->
        <el-dialog :visible.sync="show_receipt_modal" width="500" :close-on-click-modal="false">
            <div style="text-align:center">
                <div>
                    <div span="4"><h4>Filename:</h4></div>
                    <div span="20">{{ selected.selectFileName }}</div>
                </div>
                <div>
                    <div span="4"><h4>File Id:</h4></div>
                    <div span="20">{{ selected.selectFileId }}</div>
                </div>
                <div>
                    <div span="4"><h4>GNX Paid:</h4></div>
                    <div span="20">0 (free for beta testing)</div>
                </div>
                <div>
                    <div span="4"><h4>QR Code:</h4></div>
                    <div span="20"><img :src="fileQrCode"></div>
                </div>
            </div>
            <div slot="footer">
                <input id="fileDialog" type="file" nwsaveas hidden/>
                <el-button type="primary" size="large"  @click="downloadFile">Download File</el-button>
                <el-button type="error" size="large"  @click="show_del_file_modal = true">Delete File</el-button>
            </div>
        </el-dialog>
        
        <el-dialog :visible.sync="show_del_bucket_modal" ok-text="OK" cancel-text="Cancel" :close-on-click-modal="false">
            <div style="height:40px; margin-top: 20px">
                <h4>Confirm Delete Folder: {{ selected.selectBucketName }}</h4>
                <p>All your files in this folder will be deleted. This action cannot be undone.</p>
            </div>
            <div slot="footer">
                <el-button type="primary" size="large"  @click="show_del_bucket_modal = false">Cancel</el-button>
                <el-button type="error" size="large"  @click="deleteBucket">Delete</el-button>
            </div>
        </el-dialog>

        <!-- 删除File确认框 -->
        <el-dialog :visible.sync="show_del_file_modal" :close-on-click-modal="false">
            <div style="height:40px; margin-top: 5px; margin-bottom:10px;">
                <h3>Confirm Delete File?</h3>
                    <h4>BucketName:</h4>
                <div span="16">
                    {{ selected.selectBucketName }}
                </div>
                <div span="8">
                    <h4>FileName:</h4>
                </div>
                <div span="16">
                    {{ selected.selectFileName }}
                </div>
            </div>
            <div slot="footer">
                <el-button type="primary" size="large"  @click="show_del_file_modal = false">Cancel</el-button>
                <el-button type="error" size="large"  @click="deleteFile">Delete</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import STROJ_CLIENT from '../../utils/StorjApiClient'
    import QR_CODE from '../../utils/QrCodeUtil'
    import ELECTRON_DIALOG from '../../utils/ElectronDialog'
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
                selected: {
                    selectBucketName: '',
                    selectBucketId: '',
                    selectFileName: '',
                    selectFileId: ''
                },
                dragging: false
            }
        },
        created: function () {
            this.folderId = this.$route.params.folderId
            this.$store.dispatch('initBucketData', {bucketId: this.$route.params.folderId})
        },
        mounted: function (){
            stepReady('new-folder')
        },
        computed: {
            fileList() {
                return this.$store.state.CurrentBucket.fileList
            },
            fileQrCode() {
                return this.$store.state.File.fileQrCode
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
            },
            // 文件删除操作
            deleteFile() {
                alert('deleteFile')
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
                ELECTRON_DIALOG.showSaveDialog(options, function(filePath) {
                    iView.Message.info('File Downloading...');
                    var downloadNoticeArgs = {
                        desc: 'Source File: ' + downSelect.selectFileName + ' <br>Folder: ' + downSelect.selectBucketName + ' <br>Target: ' + filePath,
                        duration: 5
                    }

                    store.dispatch('fireDownload', {
                        folderId: this2.folderId, 
                        fileId: downSelect.selectFileId, 
                        filePath
                    }).then(() => {
                        this.$message.success('File Download Success')
                    }).catch((err) => {
                        this.$message.error('File Download Error: ' + err)
                    })
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

                this.$store.dispatch('deleteBucket', {selectBucketId: this.selected.selectBucketId}).then(data => {
                    iView.Message.info('Folder Delete Success');
                }).catch( e => {
                    
                })

                this.selected.selectBucketId = ''
                this.show_del_bucket_modal = false
            },
            fileDragOver(e) {
                this.dragging = true
            },
            fileDrop(e) {
                this.dragging = false
                let this2 = this
                for (let f of e.dataTransfer.files) {
                    console.log('File(s) you dragged here: ', f.path)
                    store.dispatch('fireUpload', {
                        filePath: f.path,
                        bucketId: this2.folderId
                    }).then(() => {
                        this.$notify({
                            title: 'success',
                            message: 'File Uploaded',
                            type: 'success'
                        })
                    }).catch((err) => {
                        alert(err)
                        console.error(err)
                    })
                }
            },
            fileDragLeave(e) {
                this.dragging = false
            },
            upload() {
                let this2 = this
                const {dialog} = require('electron').remote
                const files = dialog.showOpenDialog({properties: ['openFile', 'multiSelections']})

                if (files && files.length > 0) {
                    store.dispatch('fireUpload', {
                        filePath: files[0],
                        bucketId: this2.folderId
                    }).then(() => {
                        this.$notify({
                            title: 'success',
                            message: 'File Uploaded',
                            type: 'success'
                        })
                    }).catch((err) => {
                        this.$notify({
                            title: 'success',
                            message: 'File Uploaded',
                            type: 'error'
                        })
                    })
                }
            }
        }
    }
</script>