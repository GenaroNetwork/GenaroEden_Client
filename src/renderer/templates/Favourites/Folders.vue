<style scoped>
    #bucket-list {
        display: flex;
        flex-wrap: wrap;
    }
</style>

<template>
    <div class="fullheight">
        <p class="folderstext">Folders <a @click="createFolder">+</a></p> 
        <div id="bucket-list">
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