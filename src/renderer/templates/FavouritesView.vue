<style scoped>
.layout-favourites-enum {
  width: 200px;
  background: #fff;
  overflow-x: hidden;
  border-radius: 8px;
  flex-shrink: 0;
}
.layout-favourites-enum ul {
  border: none;
}
.layout-favourites-content {
  flex-grow: 1;
  margin-left: 20px;
  background: #fff;
  border-radius: 8px;
  overflow: auto;
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
            <el-menu :default-active="defaultActive" :router="true">
                <el-menu-item index="0" route="/folders">
                    <i class="el-icon-document"></i>
                    <span slot="title">{{ $t("dashboard.myfiles.myfiles") }}</span>
                </el-menu-item>
                <!-- <el-menu-item index="1" route="/file-download">
                    <i class="el-icon-time"></i>
                    <span slot="title">{{ $t("dashboard.recent.recent") }}</span>
                </el-menu-item> -->
                <el-submenu index="1" default-active="1-0">
                    <template slot="title">
                        <i class="el-icon-time"></i>
                        <span slot="title">{{ $t("dashboard.recent.recent") }}</span>
                    </template>
                    <el-menu-item index="1-0" route="/task-running">
                        <span slot="title">{{ $t("dashboard.recent.runningtask") }}</span>
                    </el-menu-item>
                    <el-menu-item index="1-1" route="/task-history">
                        <span slot="title">{{ $t("dashboard.recent.history") }}</span>
                    </el-menu-item>
                </el-submenu>
                <el-submenu index="2" default-active="2-0">
                    <template slot="title">
                        <i class="material-icons">account_balance_wallet</i>
                        <span slot="title">{{ $t("dashboard.mywallet.mywallet") }}</span>
                    </template>
                    <el-menu-item index="2-0" route="/wallet">
                        <span slot="title">{{ $t("dashboard.mywallet.mywallet") }}</span>
                    </el-menu-item>
                    <el-menu-item index="2-1" route="/wallet-manager">
                        <span slot="title">{{ $t("dashboard.walletmanage.walletmanage") }}</span>
                    </el-menu-item>
                    <el-menu-item index="2-2" route="/debit">
                        <span slot="title">{{ $t("dashboard.debits.debits") }}</span>
                    </el-menu-item>
                </el-submenu>
                <el-menu-item index="3" route="/share-my-storage">
                    <i class="el-icon-share"></i>
                    <span slot="title">{{ $t("dashboard.sharestorage.sharestorage") }}</span>
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