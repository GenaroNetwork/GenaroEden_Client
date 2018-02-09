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
  width: 195px;
  height: 140px;
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
  font-size: 95px;
  color: #9fd6f6;
}
.folder .folder-name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: pre;
  padding: 0 10px;
}

.folder .folder-icon i.create {
  color: #eee;
}
.folder .folder-name .create {
  color: #eee;
}
</style>

<template>
    <div class="fullheight right-container">
        <div class="top-bar">
            <h2>Folders</h2>
            <el-button class="btn" @click="createBucket" type="primary" icon="el-icon-circle-plus-outline" size="small">Create Folder</el-button>
        </div>
        <div class="bucket-list">
            <div v-for="bucket in bucketList" class="folder" @click="enterBucket(bucket)">
                <a class="delete-folder" @click.stop.prevent="deleteBucket(bucket)">
                    <i class="material-icons">close</i>
                </a>

                <div class="folder-icon">
                    <i class="material-icons">folder</i>
                </div>
                <div class="folder-name">
                    <span>{{ bucket.name }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { stepReady } from "../../utils/guide"

export default {
    data() {
        return {
        }
    },
    created: function () {
        this.$store.dispatch('bucketListLoad');
    },
    async beforeRouteLeave(to, from, next) {
        if (to.name !== "folder-view") {
            next();
            return;
        }
        const bucketId = to.params.bucketId;
        this.$store.dispatch('fileListLoadBucket', { bucketId })
            .then(() => {
                next();
            })
            .catch(e => {
                if (e.message === "No Payment Wallet") {
                    next(false);
                    this.$alert("Please set default payment wallet first.", "Error", {
                        type: "error"
                    });
                }
            });
    },
    mounted: function () {
        stepReady('new-folder')
    },
    computed: {
        bucketList() {
            return this.$store.state.BucketList.buckets;
        }
    },
    methods: {
        enterBucket(bucket) {
            this.$router.push({ path: '/folder/' + bucket.id, query: { bucketName: bucket.name } });
        },

        async createBucket() {
            try {
                let { value: bucketName } = await this.$prompt('Folder Name:', 'Create Folder', {
                    confirmButtonText: 'OK',
                    cancelButtonText: 'Cancel'
                });
                try {
                    this.$store.dispatch("bucketListCreate", { bucketName });
                    this.$message.success(`Create Folder Success: ${bucketName}`);
                } catch (error) {
                    this.$message.error(`Create Folder Error: ${error}`);
                }
            } catch (error) { }
        },

        async deleteBucket(bucket) {
            try {
                await this.$confirm(
                    `All your files in folder ${bucket.name} will be deleted. This action cannot be undone.`,
                    `Confirm Delete Folder: ${bucket.name}`,
                    {
                        confirmButtonText: 'Delete',
                        cancelButtonText: 'Cancel',
                        type: 'warning',
                        confirmButtonClass: 'el-button--danger'
                    });
                try {
                    await this.$store.dispatch("bucketListDelete", { bucketId: bucket.id });
                    this.$message.success('Folder Deleted');
                } catch (error) {
                    this.$message.error(`Folder Delete Error: ${error}`);
                }

            } catch (error) { }
        },
    }
}
</script>