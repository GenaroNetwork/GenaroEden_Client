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
                <span :title="bucketName"> &gt; {{ bucketName }}</span>
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
            <el-table :data="fileList" class="files-table" row-class-name="file-row" @selection-change="rowSelectChanged">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column prop="filename" label="File Name" min-width="200" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        <font-awesome-icon :icon="scope.row.filename | file2icon('icon')" :style="{color: file2Icon(scope.row.filename).color}" />
                        <span style="margin-left: 10px" :title="scope.row.filename">{{ scope.row.filename }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="size" label="Size" width="80">
                    <template slot-scope="scope">{{ scope.row.size | formatSize }}</template>
                </el-table-column>
                <el-table-column prop="created" label="Created" width="180" class-name="created-col">
                    <template slot-scope="scope">{{ scope.row.created | formatTime }}</template>
                </el-table-column>
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
                    <h2>drop to upload your files to {{bucketName}}</h2>
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
import { Bucket } from "../../utils/storjApiClient";
import fs from "fs";
import { BRIDGE_API_URL } from "../../../config";
import storj from 'storj-lib';

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
    async created() {
        const bucketId = this.$route.params.bucketId;
        this.$store.dispatch('fileListLoadBucket', { bucketId });
        this.$http.get(`${BRIDGE_API_URL}/user/${this.$store.state.User.username}`, {
            auth: {
                username: this.$store.state.User.username,
                password: storj.utils.sha256(this.$store.state.User.password),
            }
        })
            .then(data => {
                if (!data.data.wallet) {
                    this.$alert("Please set default payment wallet first.", "Error", {
                        type: "error"
                    });
                }
            })
            .catch(error => {

            });
    },
    mounted() {
        stepReady('new-folder');
    },
    computed: {
        fileList() {
            return this.$store.state.FileList.files;
        },
        bucketId() {
            return this.$store.state.FileList.bucket.id;
        },
        bucketName() {
            return this.$store.state.FileList.bucket.name;
        },
        anyRowSelected() {
            return this.selectedRow.length > 0
        }
    },
    methods: {
        file2Icon(name) {
            return fileName2Icon(name)
        },
        rowSelectChanged(ss) {
            this.selectedRow = ss
        },
        showReceipt({ filename, id }) {
            this.receiptModal.display = true;
            this.receiptModal.fileName = filename;
            this.receiptModal.fileId = id;
            createQrCodeStr(id, (err, result) => {
                if (err) {
                    console.error('generate QR err for id: ' + id)
                } else {
                    this.receiptModal.fileQrCode = result
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
        async deleteSelected() {
            if (!this.anyRowSelected) {
                this.$message('Please select file first');
                return;
            }
            await this.$confirm('Are you sure to delete selected files', 'Confirm', {
                confirmButtonText: 'Delete',
                cancelButtonText: 'Cancel',
                type: 'warning'
            });

            this.closeReceipt()
            this.selectedRow.forEach(async file => {
                this.deleteRow({ fileId: file.id })
            })
        },
        async deleteFile({ filename, id }) {
            await this.$confirm(
                `Are you sure to delete file: ${filename}`,
                'Confirm',
                {
                    confirmButtonText: 'Delete',
                    cancelButtonText: 'Cancel',
                    type: 'warning'
                });
            this.closeReceipt();
            await this.deleteRow({ fileId: id });
        },
        async deleteRow({ fileId }) {
            try {
                await this.$store.dispatch('fileListDelete', { fileId });
                this.$message.success('File Deleted');
            } catch (error) {
                this.$message.error(`File Delete Error: ${error}`);
            }

        },
        async downloadSelected() {
            if (!this.anyRowSelected) {
                this.$message('Please select file first');
                return;
            }
            electronDialog.selectDirectory(folders => {
                if (!folders || !folders.length) return;
                const folderPath = folders[0];
                this.selectedRow.forEach(async file => {
                    try {
                        await this.$store.dispatch("taskListDownload", {
                            bucketId: this.bucketId,
                            fileId: file.id,
                            filePath: folderPath + '/' + file.filename,
                            folderName: this.bucketName,
                        });
                        this.$message.success(`File Download Success: ${file.filename}`);
                    } catch (err) {
                        this.$message.error(`File Download Error: ${err.message}`);
                    }
                })
            })
        },
        downloadFile({ filename, id }) {
            // 弹出保存对话框配置
            var options = {
                title: 'Save File',
                defaultPath: './' + filename
            }
            electronDialog.showSaveDialog(options, filePath => {
                this.$message('File Downloading...');
                this.$store.dispatch("taskListDownload", {
                    bucketId: this.bucketId,
                    fileId: id,
                    filePath: filePath,
                    folderName: this.bucketName,
                }).then(() => {
                    this.$message.success(`File Download Success: ${filename}`);
                }).catch((err) => {
                    this.$message.error(`File Download Error: ${err.message}`);
                });
            })
        },
        // Bucket 删除操作
        async deleteBucket() {
            await this.$store.dispatch('bucketListDelete', { bucketId: this.bucketId })
            this.$message.success('Folder Delete Success');
        },
        fileDragOver(e) {
            // TODO: check contain file
            this.dragging = true
        },
        fileDrop(e) {
            this.dragging = false;
            let files = [];
            Object.keys(e.dataTransfer.files).forEach(i => {
                files.push(e.dataTransfer.files[i].path);
            });
            this.rawUpload(this.bucketId, files);
            return;
        },
        fileDragLeave(e) {
            this.dragging = false
        },
        async upload() {
            const { dialog } = require('electron').remote
            const files = dialog.showOpenDialog({ properties: ['openFile', 'multiSelections'] })
            if (!files || !files.length) return;
            const bucketId = this.bucketId;
            await this.rawUpload(bucketId, files);
        },
        async rawUpload(bucketId, files) {
            let bucket = new Bucket(bucketId);
            let fileList = await bucket.list();
            fileList = fileList.map(file => file.filename);
            let errorMessage = [];
            let preUpload = [];
            files.forEach(file => {
                let filename = file.split("/");
                filename = filename[filename.length - 1];
                if (!fs.lstatSync(file).isFile()) {
                    errorMessage.push(this.$createElement("div", null, `Only file can be uploaded. ${file} is not a file.`));
                    return;
                }
                if (fileList.includes(filename)) {
                    errorMessage.push(this.$createElement("div", null, `File ${filename} is already exists.`));
                    return;
                };
                preUpload.push(file);
            });

            if (!errorMessage.length && preUpload.length) {
                // all fine
                this.$message('File Uploading. You can see this task in Recent panel on the left.');
            } else if (errorMessage.length && preUpload.length) {
                // some files got an error but other
                errorMessage.unshift(this.$createElement("div", null, `------------------------`));
                errorMessage.unshift(this.$createElement("div", null, `You can see this task in Recent panel on the left.`));
                errorMessage.unshift(this.$createElement("div", null, `We've some errors on several files. Other file is being uploaded.`));
                this.$message({
                    type: "warning",
                    message: this.$createElement("div", null, [errorMessage]),
                });
            } else if (errorMessage.length && !preUpload.length) {
                // all error
                this.$message({
                    type: "error",
                    message: this.$createElement("div", null, [errorMessage]),
                });
            } else {
                // no error. no file.
                this.$message.error("There is no file to uplaod.");
            }

            preUpload.forEach(async filePath => {
                try {
                    await this.$store.dispatch("taskListUpload", {
                        filePath,
                        bucketId,
                        folderName: this.bucketName,
                    });
                    this.$message.success(`File Uploaded: ${filePath}`);
                    console.log(this.fileList);
                } catch (error) {
                    this.$message.error(`File Upload Failed: ${error.message}`);
                };
            });
        },
    },
    components: {
        FontAwesomeIcon
    }
}
</script>