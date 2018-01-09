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
            <Menu theme="light" :active-name="activePath" @on-select="routerTo">
                <MenuGroup title="FAVOURITES">
                    <MenuItem name="folders-view"><Icon type="android-document"></Icon><span class="myfiles-menu">My Files</span></MenuItem>
                    <MenuItem name="file-download"><Icon type="android-arrow-down"></Icon><span class="download-history">Recent</span></MenuItem>
                    <MenuItem name="share-my-storage"><Icon type="android-upload"></Icon>Share My Storage</MenuItem>
                </MenuGroup>
            </Menu>
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
        },
        computed: {
            activePath() {
              return this.$route.path.replace('/','');
            }
        },
        methods: {
            routerTo(e) {
                this.$router.push({name: e});
            }
        }
    }
</script>