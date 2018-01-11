<style scoped>
.bucket-list {
    display: flex;
    flex-wrap: wrap;
    padding: 10px;
}
.top-bar {
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
</style>

<template>
    <div class="fullheight">
        <div class="top-bar">
            <h2>Folders</h2>
            <el-button class="btn" @click="createFolder" type="primary" icon="el-icon-circle-plus-outline" size="small">Add</el-button>
        </div>
        <div class="bucket-list">
            <div v-for="item in showBucketList">
                <el-button style="width:195px" @click="bucketBtnClick({label: item.name, value: item.id})">{{ item.name }}</el-button>
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