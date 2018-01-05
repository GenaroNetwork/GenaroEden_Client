<template>
    <Tabs value="name1">
        <TabPane label="Running Task" name="name1">
            <p slot="title">Download</p>
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
                            <Progress class="progress" :percent="item.progress * 100"  status="active" hide-info :stroke-width="3" ></Progress>
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
        </TabPane>
        <TabPane label="History" name="name2">tav 2</TabPane>
    </Tabs>
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
        }
    },
    methods: {
        ShowUploadItemInFolder(item) {
            alert('todo')
            console.log(item)
        }
    }
}
</script>