<style scoped>
.layout-user-info {
  margin-top: 10px;
}
.layout-user-avater {
  padding-top: 8px;
  padding-left: 20px;
}
.layout-user-processor {
  display: flex;
  flex-flow: column;
}
.layout-user-wallet {
  margin-top: 25px;
  margin-left: -10px;
}
.username {
  float: right;
}
.progress {
  width: 220px;
  margin-bottom: 0;
}
</style>

<template>
    <div class="layout-user-info">
        <div class="layout-user-processor">
            <el-progress :percentage="percent" :show-text="false"></el-progress>
            <span>
                <span>{{totalUploadSize}}</span>/
                <span>{{totalMaxSizeHuman}}</span>
            </span>
        </div>
    </div>
</template>

<script>
import { getUploadSize } from '../utils/dbUtil'
import store from '../store'
const humanSize = require('human-size');
export default {
    mounted: function () {
        const newTotalSize = getUploadSize()
        store.commit('updateTotalUploadSize', newTotalSize)
    },
    data: function () {
        return {
            totalMaxSize: 100 * 1024 * 1024
        }
    },
    computed: {
        username() {
            return this.$store.state.User.username
        },
        totalUploadSize() {
            return humanSize(this.$store.state.User.totalUploadSize)
        },
        totalMaxSizeHuman() {
            return humanSize(this.totalMaxSize)
        },
        percent() {
            return this.$store.state.User.totalUploadSize * 100 / this.totalMaxSize
        }
    },
}
</script>