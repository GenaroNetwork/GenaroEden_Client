<style>
.right-container {
  flex-direction: column;
  display: flex;
  padding: 15px 15px 0 15px;
}
.task-tabs-parent {
  display: flex;
  flex-flow: column;
}
.task-tabs-parent > .el-tabs__content {
  display: flex;
}
.task-tabs-parent .el-tab-pane {
  display: flex;
  flex-grow: 1;
}
.task-tabs-parent .task-type {
  width: 160px;
  display: inline-block;
}
.task-tabs-parent .action-cell,
.task-tabs-parent .action-cell span {
  display: flex;
  align-items: center;
}
.task-tabs-parent .process-bar i {
  vertical-align: bottom;
}

.task-tabs-parent .row-action {
  visibility: hidden;
}
.task-tabs-parent .file-row:hover .row-action {
  visibility: visible;
}
</style>

<template>
    <div class="fullheight right-container">
        <el-tabs value="runningTask" class="task-tabs-parent">
            <el-tab-pane label="Running Task" name="runningTask">

                <el-table :data="taskFileList" class="files-table" height="100%" row-class-name="file-row">
                    <el-table-column prop="filename" label="File Name" min-width="200" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            <font-awesome-icon :icon="file2Icon(scope.row.filePath).icon" v-bind:style="{ color: file2Icon(scope.row.filePath).color }" />
                            <span style="margin-left: 10px">{{ getFileName(scope.row.filePath) }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="totalBytes" label="Size" width="250">
                        <template slot-scope="scope">
                            <div class="process-bar">
                                <el-progress :status="getStatusStr(scope.row.taskState)" :text-inside="true" :stroke-width="15" :percentage="Number.parseInt(scope.row.progress * 100)"></el-progress>
                                <div>
                                    <i v-if="scope.row.taskType === 2" class="material-icons">file_download</i>
                                    <i v-if="scope.row.taskType === 3" class="material-icons">file_upload</i>
                                    <span v-if="scope.row.progress > 0">{{humanSize(scope.row.totalBytes * scope.row.progress)}}/{{humanSize(scope.row.totalBytes)}}</span>
                                    <span v-if="scope.row.progress == 0">waiting...</span>
                                </div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="created" label="Created" width="180" :formatter="formatTime"></el-table-column>
                    <el-table-column prop="folderName" label="Folder" width="250"></el-table-column>
                    <el-table-column width="300" label="">
                        <template slot-scope="scope">
                            <div class="action-cell">
                                <el-button v-if="scope.row.taskState === 2" class="row-action" @click="cancelTask(scope.row)" type="text" size="small">
                                    <i class="material-icons">cancel</i>
                                </el-button>
                                <el-button v-if="scope.row.taskState === 3 || scope.row.taskState === 4" class="row-action" @click="removeTask(scope.row)" type="text" size="small">
                                    <i class="material-icons">delete_sweep</i>
                                </el-button>
                            </div>
                        </template>
                    </el-table-column>
                    <span slot="empty">No upload/download history yet</span>
                </el-table>
            </el-tab-pane>
            <!-- -->
            <el-tab-pane label="History" name="history">

                <el-table :data="historyList" class="files-table" height="100%" row-class-name="file-row">
                    <el-table-column prop="filename" label="File Name" min-width="200" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            <font-awesome-icon :icon="file2Icon(scope.row.filePath).icon" v-bind:style="{ color: file2Icon(scope.row.filePath).color }" />
                            <span style="margin-left: 10px">{{ getFileName(scope.row.filePath) }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="totalBytes" label="Size" width="80" :formatter="formatSize"></el-table-column>
                    <el-table-column prop="created" label="Created" width="180" :formatter="formatTime"></el-table-column>
                    <el-table-column prop="folderName" label="Folder" width="250"></el-table-column>
                    <el-table-column width="300" label="">
                        <template slot-scope="scope">
                            <div class="action-cell">
                                <span class="task-type" v-if="scope.row.taskType === 2">
                                    <i class="material-icons">file_download</i>
                                    <span>Download Sucess</span>
                                </span>
                                <span class="task-type" v-if="scope.row.taskType === 3">
                                    <i class="material-icons">file_upload</i>Upload Sucess</span>
                                <el-button class="row-action" @click="ShowUploadItemInFolder(scope.row)" type="text" size="small">
                                    <i class="material-icons">folder</i>
                                </el-button>
                                <el-button class="row-action" @click="deleteHistory(scope.row)" type="text" size="small">
                                    <i class="material-icons">close</i>
                                </el-button>
                            </div>
                        </template>
                    </el-table-column>
                    <span slot="empty">No upload/download history yet</span>
                </el-table>

            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>

import { fileName2Icon } from "../../utils/file2icon"
import FontAwesomeIcon from '@fortawesome/vue-fontawesome'
import config from '../../../config'
const moment = require('moment');
const humanSize = require('human-size');
export default {
    data() {
        return {
            fileTableColums: [{
                title: 'File Name',
                key: 'filename',
                width: 230
            }, {
                title: 'File Path',
                key: 'filePath',
                width: 230
            }, {
                title: 'Folder Name',
                key: 'bucketName',
                width: 230
            }]
        }
    },
    computed: {
        downloadFileList() {
            return this.$store.state.File.downloadFileList
        },
        uploadList() {
            return this.$store.state.Upload.uploadList
        },
        downloadList() {
            return this.$store.state.Download.downloadList
        },
        taskFileList() {
            let allTask = this.downloadList.concat(this.uploadList)
            allTask.sort(function (a, b) {
                return b.created - a.created
            })
            return allTask
        },
        historyList() {
            return this.$store.state.History.historyList
        }
    },
    methods: {
        formatTime(row, column) {
            return moment(row.created).format("MM/DD/YYYY hh:mm a")
        },
        formatSize(row, column) {
            return humanSize(row.totalBytes)
        },
        file2Icon(name) {
            return fileName2Icon(name)
        },
        getFileName(filePath) {
            return filePath.split('/').pop()
        },
        humanSize(bytes) {
            return humanSize(bytes)
        },
        getStatusStr(status) {
            switch (status) {
                case config.TASKSTATE.SUCCESS:
                    return 'success'
                case config.TASKSTATE.ERROR:
                    return 'exception'
                default:
                    return null
            }
        },
        ShowUploadItemInFolder(item) {
            if (item.taskType === config.TASKTYPE.DOWNLOAD) {
                const { shell } = require('electron')
                const fs = require('fs');
                if (fs.existsSync(item.filePath)) {
                    shell.showItemInFolder(item.filePath)
                } else {
                    this.$message('File no more exist. Maybe deleted or moved.');
                }
            } else if (item.taskType === config.TASKTYPE.UPLOAD) {
                this.$router.push({ path: '/folder/' + item.bucketId, query: { folderName: item.folderName } })
            }
        },
        deleteHistory(item) {
            this.$store.dispatch('removeHistory', item.historyId)
        },
        cancelTask(item) {
            if (item.taskType === config.TASKTYPE.DOWNLOAD) {
                this.$store.dispatch('cancelDownload', { taskId: item.taskId })
            } else if (item.taskType === config.TASKTYPE.UPLOAD) {
                this.$store.dispatch('cancelUpload', { taskId: item.taskId })
            }
        },
        removeTask(item) {
            if (item.taskType === config.TASKTYPE.DOWNLOAD) {
                this.$store.dispatch('removeDownloadTask', { taskId: item.taskId })
            } else if (item.taskType === config.TASKTYPE.UPLOAD) {
                this.$store.dispatch('removeUploadTask', { taskId: item.taskId })
            }
        }
    },
    mounted: function () {
        this.$store.dispatch('loadHistory')
    },
    components: {
        FontAwesomeIcon
    }
}
</script>