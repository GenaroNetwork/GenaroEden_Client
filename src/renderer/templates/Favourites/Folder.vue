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
table {
    margin: 0 auto;
}
td {
    vertical-align: top;
}
td.left-td {
    text-align: right;
}
td.right-td {
    text-align: left;
}
</style>

<template>
    <div id="list" class="fullheight">
        <div id="file-list">
            <div class="filecard">
                <span class="folder-name-id">Folder Info:{{ currentBucketName }} | {{ currentBucketId }}</span>
                <span class="file-info">
                    <el-dropdown  @command="bucketAction" class="folder-action">
                        <span class="el-dropdown-link">
                            Actions<i class="el-icon-arrow-down el-icon--right"></i>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item command="delete">Delete Folder</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </span>
                <router-link to="/folders">Back</router-link>
                <el-button type="primary" @click="upload">Upload<i class="el-icon-upload el-icon--right"></i></el-button>
                <div class="files" @dragover.stop.prevent="fileDragOver" @dragleave.stop.prevent="fileDragLeave" @drop.stop.prevent="fileDrop">
                    <el-table :data="fileList">
                        <el-table-column prop="filename" label="File Name" width="180"></el-table-column>
                        <el-table-column prop="date" label="Size" width="180"></el-table-column>
                        <el-table-column prop="date" label="Time" width="180"></el-table-column>
                        <el-table-column prop="id" label="File ID" width="180"></el-table-column>
                        <el-table-column label="Action" width="180">
                            <template slot-scope="scope">
                                <el-button @click="showReceipt(scope.row)" type="text" size="small">Receipt</el-button>
                                <el-button @click="downloadFile(scope.row)" type="text" size="small">Download</el-button>
                                <el-button @click="deleteFile(scope.row)" type="text" size="small">Delete</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="overlay" v-if="dragging">
                        <h2>drop to upload your files to {{currentBucketName}}</h2>
                    </div>
                </div>
            </div>
        </div>
        <!-- 显示receipt的modal -->
        <el-dialog :visible.sync="receiptModal.display" width="500" :close-on-click-modal="true">
            <div>
                <table>
                    <tr>
                        <td class="left-td">Filename:</td>
                        <td class="right-td">{{ receiptModal.fileName }}</td>
                    </tr>
                    <tr>
                        <td class="left-td">File Id:</td>
                        <td class="right-td">{{ receiptModal.fileId }}</td>
                    </tr>
                    <tr>
                        <td class="left-td">GNX Paid:</td>
                        <td class="right-td">0 (free for beta testing)</td>
                    </tr>
                    <tr>
                        <td class="left-td">QR Code:</td>
                        <td class="right-td"><img :src="receiptModal.fileQrCode"></td>
                    </tr>
                </table>
            </div>
            <div slot="footer">
                <el-button type="primary" size="large"  @click="downloadFile({filename: receiptModal.fileName, id: receiptModal.fileId})">Download File</el-button>
                <el-button type="error" size="large"  @click="deleteFile({filename: receiptModal.fileName, id: receiptModal.fileId})">Delete File</el-button>
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
                receiptModal: {
                    display: false,
                    fileName: '',
                    fileId: '',
                    fileQrCode: ''
                },
                dragging: false
            }
        },
        created: function () {
            const folderId = this.$route.params.folderId
            this.$store.dispatch('initBucketData', {bucketId: folderId})
        },
        mounted: function (){
            stepReady('new-folder')
        },
        computed: {
            fileList() {
                return this.$store.state.CurrentBucket.fileList
            },
            currentBucketId() {
                return this.$store.state.CurrentBucket.bucket.id
            },
            currentBucketName() {
                return this.$store.state.CurrentBucket.bucket.name
            }
        },
        methods: {
            showReceipt({filename, id}) {
                const this2 = this
                this.receiptModal.display = true
                this.receiptModal.fileName = filename
                this.receiptModal.fileId = id
                QR_CODE.createQrCodeStr(id, function(err, result) {
                    if(err) {
                        console.error('generate QR err for id: ' + id)
                    } else {
                        this2.receiptModal.fileQrCode = result
                    }
                })
            },
            closeReceipt() {
                if (this.receiptModal.display === true) {
                    this.receiptModal.display = false
                    this.receiptModal.fileName = ''
                    this.receiptModal.fileId = ''
                    this.receiptModal.fileQrCode = ''
                }
            },
            deleteFile({filename, id}) {
                const this2 = this
                this.$confirm('Are you sure to delete file: ' + filename, 'Confirm', {
                    confirmButtonText: 'Delete',
                    cancelButtonText: 'Cancel',
                    type: 'warning'
                }).then(() => {
                    this2.closeReceipt()
                    store.dispatch('deleteFile', {
                        bucketId: this2.currentBucketId, 
                        fileId: id
                    }).then(() => {
                        this2.$message.success('File Deleted')
                    }).catch((err) => {
                        this2.$message.error('File Delete Error: ' + err)
                    })
                })
            },
            // 文件下载
            downloadFile({filename, id}) {
                // 弹出保存对话框配置
                let this2 = this
                var options = {
                    title: 'Save File',
                    defaultPath: './' + filename
                }
                ELECTRON_DIALOG.showSaveDialog(options, function(filePath) {
                    this2.$message('File Downloading...')

                    store.dispatch('fireDownload', {
                        folderId: this2.currentBucketId, 
                        fileId: id, 
                        filePath
                    }).then(() => {
                        this2.$message.success('File Download Success')
                    }).catch((err) => {
                        this2.$message.error('File Download Error: ' + err)
                    })
                })
            },
            // Bucket Action的操作
            bucketAction(command) {
                const this2 = this
                if (command === 'delete') {
                    this.$confirm('All your files in folder ' + this2.currentBucketName +' will be deleted. This action cannot be undone.', 'Confirm Delete Folder: ' + this2.currentBucketName, {
                        confirmButtonText: 'Delete',
                        cancelButtonText: 'Cancel',
                        type: 'warning'
                    }).then(() => {
                        store.dispatch('deleteBucket', {
                            bucketId: this2.currentBucketId
                        }).then(() => {
                            this2.$message.success('Folder Deleted')
                            this.$router.push({ path: '/folders' })
                        }).catch((err) => {
                            this2.$message.error('Folder Delete Error: ' + err)
                        })
                    }).catch()
                }
            },
            // Bucket 删除操作
            deleteBucket() {
                var bridgeUser = this.username
                var bridgePass = this.password

                this.$store.dispatch('deleteBucket', {selectBucketId: this.bucketId}).then(data => {
                    this.$message.success('Folder Delete Success')
                }).catch( e => {
                    
                })
            },
            fileDragOver(e) {
                // TODO: check contain file
                this.dragging = true
            },
            fileDrop(e) {
                this.dragging = false
                let this2 = this
                for (let f of e.dataTransfer.files) {
                    console.log('File(s) you dragged here: ', f.path)
                    this2.$message('File Uploading. Your can this task in Recent panel on the left.')
                    this.rawUpload(this2.currentBucketId, f.path)
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
                    filePath = files[0]
                    bucketId = this2.currentBucketId
                    this.rawUpload(bucketId, filePath)
                }
            },
            rawUpload(bucketId, filePath) {
                const this2 = this
                store.dispatch('fireUpload', {
                    filePath,
                    bucketId
                }).then(() => {
                    this2.$message.success('File Uploaded: ' + filePath)
                }).catch((err) => {
                    this2.$message.error('File Upload Failed: ' + err)
                })
            }
        }
    }
</script>