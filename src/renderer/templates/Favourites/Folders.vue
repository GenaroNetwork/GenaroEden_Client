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
            <h2>{{ $t("dashboard.myfiles.folder") }}</h2>
            <el-button class="btn" @click="createBucket" type="primary" icon="el-icon-circle-plus-outline" size="small">{{ $t("dashboard.myfiles.create") }}</el-button>
        </div>
        <div class="bucket-list">
            <div v-for="bucket,index in bucketList" class="folder" @click="enterBucket(bucket)" :key="`buckId-${index}`">
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
                let { value: bucketName } = await this.$prompt(this.$t("dashboard.myfiles.foldername") + ':', this.$t("dashboard.myfiles.create"), {
                    confirmButtonText: this.$t("el.messagebox.confirm"),
                    cancelButtonText: this.$t("el.messagebox.cancel")
                });
                try {
                    if (/[/\\'"*?:]/.test(bucketName)) throw new Error("Invaild symbol");
                    this.bucketList.forEach(bucket => {
                        if (bucket.name === bucketName) {
                            throw new Error("the folder has already existed, please use another name");
                        }
                    });
                    this.$store.dispatch("bucketListCreate", { bucketName });
                    this.$message.success(`Create Folder Success: ${bucketName}`);
                } catch (error) {
                    this.$message.error(`Create Folder Error: ${error}`);
                }
            } catch (error) {
            }
        },

        async deleteBucket(bucket) {
            try {
                await this.$confirm(
                    this.$t("dashboard.myfiles.deleteconfirm.message", { name: `${bucket.name}` }),
                    this.$t("dashboard.myfiles.deleteconfirm.title", { name: `${bucket.name}` }),
                    {
                        confirmButtonText: this.$t("dashboard.myfiles.deleteconfirm.delete"),
                        cancelButtonText: this.$t("dashboard.myfiles.deleteconfirm.cancel"),
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