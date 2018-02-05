<style scoped>
.top-bar {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  padding: 10px;
}
.top-bar button i {
  margin-left: 5px;
  font-size: 12px;
  vertical-align: bottom;
}
.top-bar h2 {
  margin: 0;
  font-weight: normal;
  font-size: 1rem;
  flex-grow: 1;
}
.top-bar h2 * {
  vertical-align: middle;
}
.top-bar h2 a {
  color: unset;
  display: inline-block;
  text-decoration: unset;
}
.top-bar h2 span {
  white-space: nowrap;
  display: inline-block;
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
}
.top-bar .folder-action {
  flex-shrink: 0;
}
.files {
  position: relative;
  display: flex;
  flex-grow: 1;
}
.overlay {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.2);
  top: 0;
  left: 0;
  display: flex;
  z-index: 9;
}
.overlay div {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  text-align: center;
}
.overlay div h2 {
  font-weight: 400;
  font-size: 18px;
  margin: 0;
}
.overlay div i {
  color: #409eff;
  font-size: 170px;
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
.files-table {
  width: 100%;
}
.row-action {
  visibility: hidden;
}
.file-row:hover .row-action {
  visibility: visible;
}
</style>

<template>
    <div class="fullheight v-flex">
        <div class="top-bar">
            <h2>
                <router-link to="/folders">Folders</router-link>
                <span :title="currentBucketName"> &gt; {{ currentBucketName }}</span>
            </h2>
            <el-button type="primary" :disabled="!anyRowSelected" @click="downloadSelected" size="small">Download
                <i class="material-icons">file_download</i>
            </el-button>
            <el-button type="primary" :disabled="!anyRowSelected" @click="deleteSelected" size="small">Delete
                <i class="material-icons">delete</i>
            </el-button>
            <el-button type="primary" @click="upload" size="small">Upload
                <i class="el-icon-upload el-icon--right"></i>
            </el-button>
        </div>
        <div class="files" @dragover.stop.prevent="fileDragOver" @dragleave.stop.prevent="fileDragLeave" @drop.stop.prevent="fileDrop">
            <el-table :data="fileList" class="files-table" height="100%" row-class-name="file-row" @selection-change="rowSelectChanged">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column prop="filename" label="File Name" min-width="200" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        <font-awesome-icon :icon="file2Icon(scope.row.filename).icon" v-bind:style="{ color: file2Icon(scope.row.filename).color }" />
                        <span style="margin-left: 10px" :title="scope.row.filename">{{ scope.row.filename }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="size" label="Size" width="80" :formatter="formatSize"></el-table-column>
                <el-table-column prop="created" label="Created" width="180" :formatter="formatTime" class-name="created-col"></el-table-column>
                <el-table-column prop="id" label="File ID" width="250" class-name="id-col"></el-table-column>
                <el-table-column width="130" label="">
                    <template slot-scope="scope">
                        <el-tooltip content="View detail" placement="bottom">
                            <el-button class="row-action" @click="showReceipt(scope.row)" type="text" size="small">
                                <i class="material-icons">receipt</i>
                            </el-button>
                        </el-tooltip>
                        <el-tooltip content="Download" placement="bottom">
                            <el-button class="row-action" @click="downloadFile(scope.row)" type="text" size="small">
                                <i class="material-icons">file_download</i>
                            </el-button>
                        </el-tooltip>
                        <el-tooltip content="Delete" placement="bottom">
                            <el-button class="row-action" @click="deleteFile(scope.row)" type="text" size="small">
                                <i class="material-icons">delete</i>
                            </el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
                <span v-show="!dragging" slot="empty">No file in this folder. <br>You can click
                    <el-button type="text" @click="upload" size="small">Upload
                        <i class="el-icon-upload el-icon--right"></i>
                    </el-button> button or drag and drop file here to upload.
                </span>
            </el-table>
            <div class="overlay" v-if="dragging">
                <div>
                    <i class="el-icon-upload el-icon--right"></i>
                    <h2>drop to upload your files to {{currentBucketName}}</h2>
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
                <el-button type="primary" size="large" @click="downloadFile({filename: receiptModal.fileName, id: receiptModal.fileId})">Download File</el-button>
                <el-button type="error" size="large" @click="deleteFile({filename: receiptModal.fileName, id: receiptModal.fileId})">Delete File</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { createQrCodeStr } from '../../utils/qrCodeUtil';
import electronDialog from '../../utils/electronDialog';
import { stepReady } from "../../utils/guide";
import { fileName2Icon } from "../../utils/file2icon";
import FontAwesomeIcon from '@fortawesome/vue-fontawesome';
import moment from 'moment';
import humanSize from 'human-size';
import fs from "fs";

export default {
    data() {
        return {
            receiptModal: {
                display: false,
                fileName: '',
                fileId: '',
                fileQrCode: ''
            },
            selectedRow: [],
            dragging: false,
            cachedIcon: {}
        }
    },
    created: function () {
        const folderId = this.$route.params.folderId
        this.$store.dispatch('initBucketData', { bucketId: folderId })
    },
    mounted: function () {
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
        },
        anyRowSelected() {
            return this.selectedRow.length > 0
        }
    },
    methods: {
        formatTime(row, column) {
            return moment(row.created).format("MM/DD/YYYY hh:mm a")
        },
        formatSize(row, column) {
            return humanSize(row.size)
        },
        file2Icon(name) {
            return fileName2Icon(name)
        },
        rowSelectChanged(ss) {
            this.selectedRow = ss
        },
        showReceipt({ filename, id }) {
            const this2 = this
            this.receiptModal.display = true
            this.receiptModal.fileName = filename
            this.receiptModal.fileId = id
            createQrCodeStr(id, function (err, result) {
                if (err) {
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
        deleteSelected() {
            const this2 = this
            if (this.anyRowSelected) {
                this.$confirm('Are you sure to delete selected files', 'Confirm', {
                    confirmButtonText: 'Delete',
                    cancelButtonText: 'Cancel',
                    type: 'warning'
                }).then(() => {
                    this2.closeReceipt()
                    this2.selectedRow.forEach(row => {
                        this.$store.dispatch('deleteFile', {
                            bucketId: this2.currentBucketId,
                            fileId: row.id
                        }).then(() => {
                            this2.$message.success('File Deleted: ' + row.filename)
                        }).catch((err) => {
                            this2.$message.error('File Delete Error: ' + err)
                        })
                    })
                })
            } else {
                this.$message('Please select file first')
            }
        },
        deleteFile({ filename, id }) {
            const this2 = this
            this.$confirm('Are you sure to delete file: ' + filename, 'Confirm', {
                confirmButtonText: 'Delete',
                cancelButtonText: 'Cancel',
                type: 'warning'
            }).then(() => {
                this2.closeReceipt();
                this.$store.dispatch('deleteFile', {
                    bucketId: this2.currentBucketId,
                    fileId: id
                }).then(() => {
                    this2.$message.success('File Deleted')
                }).catch((err) => {
                    this2.$message.error('File Delete Error: ' + err)
                })
            })
        },
        downloadSelected() {
            if (this.anyRowSelected) {
                electronDialog.selectDirectory(folders => {
                    if (folders && folders.length > 0) {
                        const folderPath = folders[0]
                        this.selectedRow.forEach(row => {
                            this.$store.dispatch("taskListDownload", {
                                bucketId: this.currentBucketId,
                                fileId: row.id,
                                filePath: folderPath + '/' + row.filename,
                                folderName: this.currentBucketName,
                            }).then(() => {
                                this.$message.success('File Download Success: ' + row.filename)
                            }).catch((err) => {
                                this.$message.error('File Download Error: ' + err)
                            });
                        })
                    }
                })
            } else {
                this.$message('Please select file first')
            }
        },
        downloadFile({ filename, id }) {
            // 弹出保存对话框配置
            let this2 = this
            var options = {
                title: 'Save File',
                defaultPath: './' + filename
            }
            electronDialog.showSaveDialog(options, filePath => {
                this.$message('File Downloading...');
                this.$store.dispatch("taskListDownload", {
                    bucketId: this.currentBucketId,
                    fileId: id,
                    filePath: filePath,
                    folderName: this.currentBucketName,
                }).then(() => {
                    this.$message.success('File Download Success: ' + filename)
                }).catch((err) => {
                    this.$message.error('File Download Error: ' + err)
                });
            })
        },
        // Bucket 删除操作
        deleteBucket() {
            var bridgeUser = this.username
            var bridgePass = this.password

            this.$store.dispatch('deleteBucket', { selectBucketId: this.bucketId }).then(data => {
                this.$message.success('Folder Delete Success')
            }).catch(e => {

            })
        },
        fileDragOver(e) {
            // TODO: check contain file
            this.dragging = true
        },
        fileDrop(e) {
            this.dragging = false;
            for (let file of e.dataTransfer.files) {
                if (!fs.lstatSync(file.path).isFile()) {
                    this.$message.error("Only file can be uploaded.");
                    continue;
                }
                console.log('File(s) you dragged here: ', file.path)
                this.$message('File Uploading. Your can this task in Recent panel on the left.')
                this.rawUpload(this.currentBucketId, file.path)
            }
        },
        fileDragLeave(e) {
            this.dragging = false
        },
        upload() {
            const { dialog } = require('electron').remote
            const files = dialog.showOpenDialog({ properties: ['openFile', 'multiSelections'] })

            if (files && files.length > 0) {
                this.$message('File Uploading. Your can see this task in Recent panel on the left.')
                const filePath = files[0]
                const bucketId = this.currentBucketId
                this.rawUpload(bucketId, filePath)
            }
        },
        rawUpload(bucketId, filePath) {
            this.$store.dispatch("taskListUpload", {
                filePath,
                bucketId,
                folderName: this.currentBucketName,
            });
            /*
            this.$store.dispatch('fireUpload', {
                filePath,
                bucketId,
                folderName: this.currentBucketName
            }).then(() => {
                this.$message.success('File Uploaded: ' + filePath)
            }).catch((err) => {
                this.$message.error('File Upload Failed: ' + err)
            })
            */
        }
    },
    components: {
        FontAwesomeIcon
    }
}
</script>