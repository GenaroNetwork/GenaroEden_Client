<style scoped>
.layout-favourites-enum {
  width: 200px;
  background: #fff;
  overflow: hidden;
  border-radius: 8px;
  flex-shrink: 0;
}
.layout-favourites-content {
  flex-grow: 1;
  margin-left: 20px;
  background: #fff;
  border-radius: 8px;
}
.colcontainer {
  display: flex;
  width: 100%;
}
i {
  margin-right: 5px;
  width: 24px;
  text-align: center;
  font-size: 18px;
  vertical-align: middle;
}
</style>

<template>
    <div class="colcontainer">
        <div class="layout-favourites-enum">
            <el-menu :default-active="defaultActive" @select="(index)=>{defaultActive = index}" :router="true">
                <el-menu-item index="0" route="/folders">
                    <i class="el-icon-document"></i>
                    <span slot="title">My Files</span>
                </el-menu-item>
                <el-menu-item index="1" route="/file-download">
                    <i class="el-icon-time"></i>
                    <span slot="title">Recent</span>
                </el-menu-item>
                <el-submenu index="2" default-active="2-0">
                    <template slot="title">
                        <i class="material-icons">account_balance_wallet</i>
                        <span slot="title">My Wallet</span>
                    </template>
                    <el-menu-item index="2-0" route="/wallet">
                        <span slot="title">My Wallet</span>
                    </el-menu-item>
                    <el-menu-item index="2-1" route="/wallet-manager">
                        <span slot="title">Wallet Manage</span>
                    </el-menu-item>
                    <el-menu-item index="2-2" route="/debit">
                        <span slot="title">Debits</span>
                    </el-menu-item>
                </el-submenu>
                <el-menu-item index="3" route="/share-my-storage">
                    <i class="el-icon-share"></i>
                    <span slot="title">Share My Storage</span>
                </el-menu-item>
            </el-menu>
        </div>
        <div class="layout-favourites-content">
            <transition mode="out-in">
                <router-view></router-view>
            </transition>
        </div>
    </div>
</template>

<script>
import { stepReady } from "../utils/guide";
export default {
    data() {
        return {
            defaultActive: "0",
        };
    },
    watch: {
        "$route"(to, form) {
            switch (to.name) {
                case "folder-view":
                    this.defaultActive = "0";
                    break;
            }
        }
    },
    created: function () {
        this.$router.push({ path: "/folders" });
    },
    mounted: function () {
        stepReady("My Folder");
        stepReady("Upload");
        stepReady("download-history");
    },
};
</script>