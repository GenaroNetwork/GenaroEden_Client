<template>
    <div>
        <Card :bordered="false" dis-hover>
            <p slot="title">Download</p>
            <Table no-data-text="No Data" :columns="fileTableColums" :data="downloadFileList"></Table>
        </Card>
    </div>
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
                key: 'filepath'
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
        }
    }
}
</script>