<template>
    <div>
        <Card :bordered="false" dis-hover>
            <p slot="title">Download</p>
            <Table no-data-text="No Data" height="260" :columns="fileTableColums" :data="downloadFileList"></Table>
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
                key: 'filepath',
                width: 230
            }, {
                title: 'Bucket Name',
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