<style scoped>
.right-container {
    flex-direction: column;
    display: flex;
}
.bucket-list {
    flex-wrap: wrap;
    flex-grow: 1;
    align-content: flex-start;
    display: flex;
    padding: 10px;
    overflow: auto;
    overflow-x: hidden;
}
.top-bar {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #dddddd;
    padding: 10px;
}
.top-bar h2 {
    margin: 0;
    font-weight: normal;
    font-size: 1rem;
    flex-grow: 1;
}
.top-bar .btn {
    flex-shrink: 0;
}
.folder {
    width:195px;
    height:140px;
    margin: 20px;
    border: 1.5px dashed #eee;
    border-radius: 4px;
    text-align: center;
    cursor: pointer;
    position: relative;
}
.folder .delete-folder {
    display: none;
}
.folder:hover .delete-folder {
    display: unset;
    color: red;
    position: absolute;
    right: 0;
    top: 0;
}
.folder:hover {
    border: 1.5px dashed #eee;
    background-color: #eee;
}
.folder .folder-icon i {
    font-size:95px;
    color:#9fd6f6;
}
.folder .folder-name {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: pre;
}

.folder .folder-icon i.create {
    color:#eee;
}
.folder .folder-name .create {
    color:#eee;
}
</style>

<template>
    <div class="fullheight right-container">
        <div class="top-bar">
            <h2>Folders</h2>
            <el-button class="btn" @click="createFolder" type="primary" icon="el-icon-circle-plus-outline" size="small">Create Folder</el-button>
        </div>
        <div class="bucket-list">
            <div v-for="item in showBucketList" class="folder" @click="bucketBtnClick({label: item.name, value: item.id})">
                <a class="delete-folder" @click.stop.prevent="deleteFolder(item)"><i class="material-icons">close</i></a>
                
                <div class="folder-icon">
                    <i class="material-icons">folder</i>
                </div>
                <div class="folder-name"><span>{{ item.name }}</span></div>
            </div>
        </div>
    </div>
</template>

<script>
import store from '../../store'
import {stepReady} from "../../utils/guide"

export default {
    data() {
        return {
        }
    },
    created: function () {
        this.$store.dispatch('fetchBucketList')
    },
    mounted: function (){
        stepReady('new-folder')
    },
    computed: {
        showBucketList() {
            return this.$store.state.Bucket.bucketList
        }
    },
    methods: {
        deleteFolder(bucket) {
            const this2 = this
            this.$confirm('All your files in folder ' + bucket.name +' will be deleted. This action cannot be undone.', 'Confirm Delete Folder: ' + bucket.name, {
                confirmButtonText: 'Delete',
                cancelButtonText: 'Cancel',
                type: 'warning',
                confirmButtonClass:'el-button--danger'
            }).then(() => {
                store.dispatch('deleteBucket', {
                    bucketId: bucket.id
                }).then(() => {
                    this2.$message.success('Folder Deleted')
                }).catch((err) => {
                    this2.$message.error('Folder Delete Error: ' + err)
                })
            }).catch()
        },
        createFolder() {
            this.$prompt('Folder Name:', 'Create Folder', {
                confirmButtonText: 'OK',
                cancelButtonText: 'Cancel'
            }).then(({ value }) => {
                this.$store.dispatch('createBucket', {bucketName: value}).then(() => {
                    this.$message({
                        type: 'success',
                        message: 'Create Folder Success: ' + value
                    });
                }).catch( e => {
                    this.$message.error('Create Folder Error: ' + e);
                })
            })
        },
        bucketBtnClick(bucket) {
            this.$router.push({ path: '/folder/' + bucket.value, query: { folderName: bucket.label }})
        }
    }
}
</script>