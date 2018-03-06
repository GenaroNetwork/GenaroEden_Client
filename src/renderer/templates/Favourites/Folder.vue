<style lang="less" scoped>
@import "../../cssConfig/color.less";
.top-bar {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  padding: 10px;
  padding-left: 1.5rem;
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
  color: @pending;
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
  height: 100%;
}
.overlay {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.2);
  top: 0;
  left: 0;
  z-index: 9;
}
.overlay div {
  background-color: rgba(0, 0, 0, 0.05);
  border-radius: 5px;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  height: 250px;
  width: 300px;
  margin: auto;
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
  overflow: visible;
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
                <router-link to="/folders">{{ $t("dashboard.myfiles.folder") }}</router-link>
                <span :title="bucketName"> &gt; {{ bucketName }}</span>
            </h2>
            <el-button type="primary" :disabled="!anyRowSelected" @click="downloadSelected" size="small">{{ $t("dashboard.myfiles.download") }}
                <i class="material-icons">file_download</i>
            </el-button>
            <el-button type="primary" :disabled="!anyRowSelected" @click="deleteSelected" size="small">{{ $t("dashboard.myfiles.delete") }}
                <i class="material-icons">delete</i>
            </el-button>
            <el-button type="primary" :disabled="anyRowSelected" @click="upload" size="small">{{ $t("dashboard.myfiles.upload") }}
                <i class="el-icon-upload el-icon--right"></i>
            </el-button>
        </div>
        <div class="files" @dragover.stop.prevent="fileDragOver" @dragleave.stop.prevent="fileDragLeave" @drop.stop.prevent="fileDrop">
            <el-table :data="fileList" @selection-change="rowSelectChanged" row-class-name="file-row">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column prop="filename" :label="$t('dashboard.recent.filename')" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        <font-awesome-icon :icon="scope.row.filename | file2icon('icon')" :style="{color: file2Icon(scope.row.filename).color}" />
                        <span style="margin-left: 10px" :title="scope.row.filename">{{ scope.row.filename }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="size" :label="$t('dashboard.recent.size')">
                    <template slot-scope="scope">{{ scope.row.size | formatSize }}</template>
                </el-table-column>
                <el-table-column prop="created" :label="$t('dashboard.recent.created')" class-name="created-col">
                    <template slot-scope="scope">{{ scope.row.created | formatTime }}</template>
                </el-table-column>
                <el-table-column prop="id" :label="$t('dashboard.myfiles.fileid')" class-name="id-col"></el-table-column>
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
                <span v-show="!dragging" slot="empty" v-html="$t('dashboard.myfiles.emptyfilemsg')">
                </span>
            </el-table>
            <div class="overlay" v-show="dragging">
                <div>
                    <i class="el-icon-upload el-icon--right"></i>
                    <h2>{{ $t('dashboard.myfiles.droptouploadfiles', {bucketName: bucketName}) }}</h2>
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
                        <td class="left-td">QR Code:</td>
                        <td class="right-td"><img :src="receiptModal.fileQrCode"></td>
                    </tr>
                </table>
            </div>
            <div slot="footer">
                <el-button type="primary" size="large" @click="downloadFile({filename: receiptModal.fileName, id: receiptModal.fileId})">{{ $t('dashboard.myfiles.downloadfile') }}</el-button>
                <el-button type="error" size="large" @click="deleteFile({filename: receiptModal.fileName, id: receiptModal.fileId})">{{ $t('dashboard.myfiles.deletefile') }}</el-button>
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
import { BRIDGE_API_URL, TASK_TYPE } from "../../../config";
import { sha256hex } from '../../../lib/cryptUtil';

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

        async checkDebit() {
            let data = await this.$http.get(`${BRIDGE_API_URL}/user/${this.$store.state.User.username}`, {
                auth: {
                    username: this.$store.state.User.username,
                    password: sha256hex(this.$store.state.User.password),
                }
            })
            if (!data.data.wallet) {
                this.$alert(this.$t('dashboard.myfiles.defaultpaymsg'), this.$t('common.error'), {
                    type: "error"
                });
            }
            let payTransaction = await this.$http.get(`${BRIDGE_API_URL}/paytransactions/${this.$store.state.User.username}?page=1&limit=2`,
                {
                    auth: {
                        username: this.$store.state.User.username,
                        password: sha256hex(this.$store.state.User.password),
                    }
                });
            if (payTransaction.data.Data[0] && payTransaction.data.Data[0].state === "fail") {
                this.$alert("There are billings that failed to pay.", "Error", {
                    type: "error"
                });
            }
        },
        async deleteSelected() {
            if (!this.anyRowSelected) {
                this.$message(this.$t('dashboard.myfiles.selectfile'));
                return;
            }
            await this.$confirm(this.$t('dashboard.myfiles.confirmdelmsg1'), 'Confirm', {
                confirmButtonText: this.$t('common.delete'),
                cancelButtonText: this.$t('el.messagebox.cancel'),
                type: 'warning'
            });

            this.closeReceipt()
            this.selectedRow.forEach(async file => {
                this.deleteRow({ fileId: file.id })
            })
        },
        async deleteFile({ filename, id }) {
            await this.$confirm(
                this.$t('dashboard.myfiles.confirmdelmsg2', { filename: filename }),
                'Confirm',
                {
                    confirmButtonText: this.$t('common.delete'),
                    cancelButtonText: this.$t('el.messagebox.cancel'),
                    type: 'warning'
                });
            this.closeReceipt();
            await this.deleteRow({ fileId: id });
        },
        async deleteRow({ fileId }) {
            try {
                await this.$store.dispatch('fileListDelete', { fileId });
                this.$message.success(this.$t('dashboard.myfiles.filedeled'));
            } catch (error) {
                this.$message.error(this.$t('dashboard.myfiles.filedelerr', { error: error }));
            }

        },
        async downloadSelected() {
            if (!this.anyRowSelected) {
                this.$message(this.$t('dashboard.myfiles.selectfile'));
                return;
            }
            await this.checkDebit();
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
                        this.$message.success(this.$t('dashboard.myfiles.downloadfilesucc', { filename: file.filename }));
                    } catch (err) {
                        this.$message.error(this.$t('dashboard.myfiles.downloadfileerr', { errmsg: err.message }));
                    }
                })
            })
        },
        async downloadFile({ filename, id }) {
            await this.checkDebit();
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
                    this.$message.success(this.$t('dashboard.myfiles.downloadfilesucc', { filename: filename }));
                }).catch((err) => {
                    this.$message.error(this.$t('dashboard.myfiles.downloadfileerr', { errmsg: err.message }));
                });
            })
        },
        // Bucket 删除操作
        async deleteBucket() {
            await this.$store.dispatch('bucketListDelete', { bucketId: this.bucketId })
            this.$message.success(this.$t('dashboard.myfiles.folderdelsucc'));
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
            await this.checkDebit();
            let bucket = new Bucket(bucketId);
            let fileList = await bucket.list();
            fileList = fileList.map(file => file.filename);
            let uploadTaskList = this.$store.state.TaskList.tasks.filter(task => task.taskType === TASK_TYPE.UPLOAD && task.folderName === bucketId);
            uploadTaskList = uploadTaskList.map(task => task.fileName);
            let errorMessage = [];
            let preUpload = [];
            files.forEach(file => {
                let filename = file.split("/");
                filename = filename[filename.length - 1];
                if (!fs.lstatSync(file).isFile()) {

                    setTimeout(() => this.$notify.error({
                        title: "Error",
                        message: this.$t('dashboard.myfiles.uploadmsg', { filename: file }),
                    }), 0);
                    return;
                }

                if (fileList.includes(filename)) {
                    setTimeout(() => this.$notify.error({
                        title: "Error",
                        message: this.$t('dashboard.myfiles.fileexist', { filename: filename }),
                    }), 0);
                    return;
                };

                if (uploadTaskList.includes(filename)) {
                    setTimeout(() => this.$notify.error({
                        title: "Error",
                        message: this.$t('dashboard.myfiles.fileexist', { filename: filename }),
                    }), 0);
                    return;
                };


                preUpload.push(file);
            });

            preUpload.forEach(async filePath => {
                try {
                    let fileName = filePath.split("/");
                    fileName = fileName[fileName.length - 1];
                    setTimeout(() => this.$notify.info({
                        title: "Info",
                        message: this.$t('dashboard.myfiles.fileuploading', { filename: fileName }),
                    }), 0);
                    await this.$store.dispatch("taskListUpload", {
                        filePath,
                        bucketId,
                        folderName: this.bucketName,
                    });
                    this.$message.success(this.$t('dashboard.myfiles.fileuploaded', { filePath: filePath }));
                    console.log(this.fileList);
                } catch (error) {
                    this.$message.error(this.$t('dashboard.myfiles.fileuploaderr', { errmsg: error.message }));
                };
            });
        },
    },
    components: {
        FontAwesomeIcon
    }
}
</script>