<style scoped>
.layout-user-info {
    margin-top: 20px;
}
.layout-user-avater {
    padding-top: 8px;
    padding-left: 20px;
}
.layout-user-processor {
    padding-left: 60px;
    padding-right: 10px;
}
.layout-user-wallet {
    margin-top: 25px;
    margin-left: -10px;
}
.username {
    float:right
}
.progress {
    width:120px
}
</style>

<template>
    <div>
        <div class="layout-user-info">
            <Row type="flex">
                <Col span="1">
                    <div class="layout-user-avater">
                        <img shape="circle" src="~@/assets/genaro_logo.png" size="large" >
                    </div>
                </Col>
                <Col span="23">
                    <div class="layout-user-processor">
                        <span class="username">{{ username }}</span>
                        <Progress class="progress" :percent="45"  status="active" hide-info :stroke-width="3" ></Progress>
                        <span>{{totalUploadSize}}</span>/<span>{{totalMaxSizeHuman}}</span>
                    </div>
                </Col>
            </Row>
            <!-- <Row type="flex">
                <div class="layout-user-wallet">
                    <Menu theme="light" :open-names="['1']" accordion width="230px">
                        <Submenu name="1">
                            <template slot="title" style="padding:0 0 0 0">
                                <Icon type="android-folder-open" size="20"></Icon>
                                My Wallet
                            </template>
                            <MenuItem name="1-1">My Balance</MenuItem>
                            <MenuItem name="1-2">My Revenue</MenuItem>
                            <MenuItem name="1-3">Send Genaro Token</MenuItem>
                            <MenuItem name="1-4">Receive Genaro Token</MenuItem>
                        </Submenu>
                    </Menu>
                </div>
            </Row> -->
        </div>
    </div>
</template>

<script>
import DB_UTIL from '../utils/DbUtil'
import store from '../store'
var humanSize = require('human-size');
export default {
    mounted: function () {
        // `this` points to the vm instance
        
        const newTotalSize = DB_UTIL.getUploadSize()
        store.commit('updateTotalUploadSize', newTotalSize)
    },
    data: function() {
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
        }
    },
}
</script>