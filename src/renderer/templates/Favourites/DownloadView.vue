<style>
.right-container {
  padding: 15px 15px 0 15px;
  box-sizing: border-box;
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

.not-actived {
  color: #ccc;
}
</style>

<template>
    <div class="fullheight right-container">
        <el-tabs value="runningTask" class="task-tabs-parent">
            <el-tab-pane :label="$t('dashboard.recent.runningtask')" name="runningTask">
                <el-table :data="taskListNotSuccess" class="files-table" row-class-name="file-row">
                    <el-table-column prop="filename" :label="$t('dashboard.recent.filename')" :show-overflow-tooltip="true" min-width="200">
                        <template slot-scope="scope">
                            <font-awesome-icon :icon="file2Icon(scope.row.filePath).icon" v-bind:style="{ color: file2Icon(scope.row.filePath).color }" />
                            <span style="margin-left: 10px">{{ getFileName(scope.row.filePath) }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="totalBytes" :label="$t('dashboard.recent.size')" width="250">
                        <template slot-scope="scope">
                            <div class="process-bar">
                                <el-progress :status="getStatusStr(scope.row.taskState)" :text-inside="true" :stroke-width="15" :percentage="Number.parseInt(scope.row.progress * 100)"></el-progress>
                                <div>
                                    <i v-if="scope.row.taskType === TASK_TYPE.DOWNLOAD" :class="['material-icons', {[`not-actived`]: scope.row.taskState !== TASK_STATE.INPROGRESS}]">file_download</i>
                                    <i v-if="scope.row.taskType === TASK_TYPE.UPLOAD" :class="['material-icons', {[`not-actived`]: scope.row.taskState !== TASK_STATE.INPROGRESS}]">file_upload</i>
                                    <span v-if="scope.row.taskState === TASK_STATE.INPROGRESS">{{humanSize(scope.row.totalBytes * scope.row.progress)}}/{{humanSize(scope.row.totalBytes)}}</span>
                                    <span v-else-if="scope.row.taskState === TASK_STATE.INIT">waiting...</span>
                                    <span v-else-if="scope.row.taskState === TASK_STATE.CANCEL">canceled</span>
                                    <span v-else-if="scope.row.taskState === TASK_STATE.ERROR">error: {{ scope.row.errorMessage }}</span>
                                </div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="created" :label="$t('dashboard.recent.created')" width="180" :formatter="formatTime"></el-table-column>
                    <el-table-column prop="folderName" :label="$t('dashboard.recent.folder')" width="100">
                        <template slot-scope="scope">
                            <router-link :to="`/folder/${scope.row.bucketId}`">{{ scope.row.folderName }}</router-link>
                        </template>
                    </el-table-column>
                    <el-table-column width="100" label="">
                        <template slot-scope="scope">
                            <div class="action-cell">
                                <el-button v-if="scope.row.taskState === TASK_STATE.INPROGRESS" class="row-action" @click="cancelTask(scope.row)" type="text" size="small">
                                    <i class="material-icons">{{ $t('el.messagebox.cancel').toLocaleLowerCase() }}</i>
                                </el-button>
                                <el-button v-if="scope.row.taskState !== TASK_STATE.INPROGRESS" class="row-action" @click="removeTask(scope.row)" type="text" size="small">
                                    <i class="material-icons">{{ $t('common.close').toLocaleLowerCase() }}</i>
                                </el-button>
                            </div>
                        </template>
                    </el-table-column>
                    <span slot="empty">{{ $t('dashboard.recent.tip1') }}</span>
                </el-table>
            </el-tab-pane>
            <!-- -->
            <el-tab-pane :label="$t('dashboard.recent.history')" name="history">

                <el-table :data="taskListSuccess" class="files-table" row-class-name="file-row">
                    <el-table-column prop="filename" :label="$t('dashboard.recent.filename')" min-width="200" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            <font-awesome-icon :icon="file2Icon(scope.row.filePath).icon" v-bind:style="{ color: file2Icon(scope.row.filePath).color }" />
                            <span style="margin-left: 10px">{{ getFileName(scope.row.filePath) }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="totalBytes" :label="$t('dashboard.recent.size')" width="80" :formatter="formatSize"></el-table-column>
                    <el-table-column prop="created" :label="$t('dashboard.recent.created')" width="180" :formatter="formatTime"></el-table-column>
                    <el-table-column prop="folderName" :label="$t('dashboard.recent.folder')" width="10 ·0"></el-table-column>
                    <el-table-column width="300" label="">
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
                                <el-button class="row-action" @click="removeTask(scope.row)" type="text" size="small">
                                    <i class="material-icons">{{ $t('common.close').toLocaleLowerCase() }}</i>
                                </el-button>
                            </div>
                        </template>
                    </el-table-column>
                    <span slot="empty">{{ $t('dashboard.recent.tip1') }}</span>
                </el-table>

            </el-tab-pane>
        </el-tabs>
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
            fileTableColums: [{
                title: this.$t('dashboard.recent.filename'),
                key: 'filename',
                width: 230
            }, {
                title: this.$t('dashboard.recent.filepath'),
                key: 'filePath',
                width: 230
            }, {
                title: this.$t('dashboard.myfiles.foldername'),
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
                    this.$message(this.$t('dashboard.recent.filenotexist'));
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
                else this.$message.error({message: this.$t('dashboard.recent.foldernotexist', {folderName: item.folderName}), showClose: true, duration: 0});
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