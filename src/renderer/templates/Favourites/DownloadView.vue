<template>
    <el-tabs value="name1">
        <el-tab-pane label="Running Task" name="name1">
            <table>
                <thead>
                    <tr>
                        <th>type</th>
                        <th>filePath</th>
                        <th>progress</th>
                        <th>Folder Id</th>
                        <th>created</th>
                        <th>action</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in taskFileList" :key="item.taskId">
                        <td>{{item.taskType}}</td>
                        <td>{{item.filePath}}</td>
                        <td>
                            <el-progress :percentage="item.progress * 100"></el-progress>
                        </td>
                        <td>{{item.bucketId}}</td>
                        <td>{{item.created}}</td>
                        <td>
                            <a @click.prevent="ShowUploadItemInFolder(item)">Show in Folder</a>
                        </td>
                    </tr>
                </tbody>
            </table>
            <!-- <Table no-data-text="No Data" width="100%" :columns="fileTableColums" :data="uploadFileList"></Table> -->
        </el-tab-pane>
        <el-tab-pane label="History" name="name2">
            <table>
                <thead>
                    <tr>
                        <th>type</th>
                        <th>filePath</th>
                        <th>progress</th>
                        <th>Folder Id</th>
                        <th>created</th>
                        <th>action</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in historyList" :key="item.taskId">
                        <td>{{item.taskType}}</td>
                        <td>{{item.filePath}}</td>
                        <td>
                            <el-progress :percentage="item.progress * 100" :show-text="false"></el-progress>
                        </td>
                        <td>{{item.bucketId}}</td>
                        <td>{{item.created}}</td>
                        <td>
                            <a @click.prevent="ShowUploadItemInFolder(item)">Show in Folder</a>
                            <a @click.prevent="deleteHistory(item)">x</a>
                        </td>
                    </tr>
                </tbody>
            </table>
        </el-tab-pane>
    </el-tabs>
</template>

<script>
export default {
    data() {
        return {
            fileTableColums: [{
                title: 'File Name',
                key: 'filename',
                width: 230
            },{
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
            allTask.sort(function(a, b) {
                return b.created - a.created
            })
            return allTask
        },
        historyList() {
            return this.$store.state.History.historyList
        }
    },
    methods: {
        ShowUploadItemInFolder(item) {
            alert('todo')
            console.log(item)
        },
        deleteHistory(item) {
            this.$store.dispatch('removeHistory', item.historyId)
        }
    },
    mounted: function() {
        console.log(this.$store)
        this.$store.dispatch('loadHistory')
    }
}
</script>