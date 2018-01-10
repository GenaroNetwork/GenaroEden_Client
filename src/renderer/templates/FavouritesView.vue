<style scoped>
    .layout-favourites-enum {
        min-height: 520px;
        width: 200px;
        background: #fff;
        overflow: hidden;
        border-radius: 8px;
        flex-shrink: 0;
    }
    .layout-favourites-content {
        flex-grow: 1;
        margin-left: 20px;
        min-height: 520px;
        background: #fff;
        border-radius: 8px;
    }
    .colcontainer {
        display: flex;
        width: 100%;
    }
</style>

<template>
    <div class="colcontainer">
        <div class="layout-favourites-enum">
            <el-menu default-active="0" :router="true">
                <el-menu-item index="0" route="/folders">
                    <i class="el-icon-document"></i>
                    <span slot="title">My Files</span>
                </el-menu-item>
                <el-menu-item index="1" route="/file-download">
                    <i class="el-icon-time"></i>
                    <span slot="title">Recent</span>
                </el-menu-item>
                <el-menu-item index="2" route="/share-my-storage">
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
    import {stepReady} from "../utils/guide"
    export default {
        data() {
            return {
            }
        },
        created: function () {
            this.$router.push({ path: '/folders'});
        },
        mounted: function (){
            stepReady('My Folder')
            stepReady('Upload')
            stepReady('download-history')
        }
    }
</script>