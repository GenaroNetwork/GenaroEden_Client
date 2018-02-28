<style scoped>
.right-container {
  padding: 15px 15px 0 15px;
  box-sizing: border-box;
}
.top-bar {
  padding: 0 0 10px;
}
.el-tab-pane {
  display: flex;
  flex-grow: 1;
}
.task-type {
  width: 160px;
  display: inline-block;
}
.action-cell,
.action-cell span {
  display: flex;
  align-items: center;
}
.process-bar i {
  vertical-align: bottom;
}

.row-action {
  visibility: hidden;
}
.file-row:hover .row-action {
  visibility: visible;
}

.not-actived {
  color: #ccc;
}
</style>

<template>
    <div class="fullheight right-container">
        <div class="top-bar">
            History
        </div>
        <el-table :data="taskListSuccess" class="files-table" row-class-name="file-row">
            <el-table-column prop="filename" :label="$t('dashboard.recent.filename')" min-width="180" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                    <font-awesome-icon :icon="file2Icon(scope.row.filePath).icon" v-bind:style="{ color: file2Icon(scope.row.filePath).color }" />
                    <span style="margin-left: 10px">{{ getFileName(scope.row.filePath) }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="totalBytes" :label="$t('dashboard.recent.size')" width="80" :formatter="formatSize"></el-table-column>
            <el-table-column prop="created" :label="$t('dashboard.recent.created')" width="180" :formatter="formatTime"></el-table-column>
            <el-table-column prop="folderName" :label="$t('dashboard.recent.folder')" width="100"></el-table-column>
            <el-table-column width="240" label="">
                <template slot-scope="scope">
                    <div class="action-cell">
                        <span class="task-type" v-if="scope.row.taskType === TASK_TYPE.DOWNLOAD">
                            <i class="material-icons">file_download</i>
                            <span>Download Sucess</span>
                        </span>
                        <span class="task-type" v-if="scope.row.taskType === TASK_TYPE.UPLOAD">
                            <i class="material-icons">file_upload</i>
                            <span>Upload Sucess</span>
                        </span>
                        <el-button class="row-action" @click="ShowUploadItemInFolder(scope.row)" type="text" size="small">
                            <i class="material-icons">folder</i>
                        </el-button>
                        <el-tooltip placement="top" :manual="true" :value="scope.row.taskId === deleteTaskId">
                            <div slot="content">
                                <p>Are you sure to delete?</p>
                                <div style="text-align: right; margin: 0">
                                    <el-button size="mini" type="text" @click="deleteTaskId = null">取消</el-button>
                                    <el-button type="primary" size="mini" @click="removeTask(scope.row)">确定</el-button>
                                </div>
                            </div>
                            <el-button class="row-action" type="text" size="small" @click="deleteTaskId = scope.row.taskId">
                                <i class="material-icons">close</i>
                            </el-button>
                            {{scope.row}}
                        </el-tooltip>
                    </div>
                </template>
            </el-table-column>
            <span slot="empty">{{ $t('dashboard.recent.tip1') }}</span>
        </el-table>
    </div>
</template>

<script>

import { fileName2Icon } from "../../utils/file2icon";
import FontAwesomeIcon from '@fortawesome/vue-fontawesome'
import { TASK_STATE, TASK_TYPE } from "../../../config"
const moment = require('moment');
const humanSize = require('human-size');
export default {
    data() {
        return {
            TASK_STATE,
            TASK_TYPE,
            deleteTaskId: null,
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
        taskList() {
            return this.$store.state.TaskList.tasks;
        },
        taskListSuccess() {
            return this.$store.state.TaskList.tasks.filter(task => task.taskState === TASK_STATE.SUCCESS);
        },
        taskListNotSuccess() {
            return this.$store.state.TaskList.tasks.filter(task => task.taskState !== TASK_STATE.SUCCESS);
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
                case TASK_STATE.SUCCESS:
                    return 'success'
                case TASK_STATE.ERROR:
                    return 'exception'
                default:
                    return null
            }
        },
        ShowUploadItemInFolder(item) {
            if (item.taskType === TASK_TYPE.DOWNLOAD) {
                const { shell } = require('electron')
                const fs = require('fs');
                if (fs.existsSync(item.filePath)) {
                    shell.showItemInFolder(item.filePath)
                } else {
                    this.$message('File no more exist. Maybe deleted or moved.');
                }
            } else if (item.taskType === TASK_TYPE.UPLOAD) {
                let bucketList = this.$store.state.BucketList.buckets;
                let bucketExist = false;
                bucketList.every(bucket => {
                    if (bucket.name !== item.folderName) return true;
                    bucketExist = true;
                    return false;
                });
                if (bucketExist) this.$router.push({ path: '/folder/' + item.bucketId, query: { folderName: item.folderName } });
                else this.$message.error(`Folder ${item.folderName} does not exist.`);
            }
        },
        cancelTask(item) {
            this.$store.dispatch('taskListCancel', { taskId: item.taskId });
        },
        removeTask(item) {
            this.$store.commit('taskListRemove', { taskId: item.taskId })
        }
    },
    components: {
        FontAwesomeIcon
    }
}
</script>