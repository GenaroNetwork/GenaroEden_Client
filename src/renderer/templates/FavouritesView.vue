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
                    <MenuItem name="file-index"><Icon type="android-document"></Icon><span class="myfiles-menu">My Files</span></MenuItem>
                    <MenuItem name="file-upload"><Icon type="android-arrow-up"></Icon><span class="upload-menu">Upload</span></MenuItem>
                    <MenuItem name="file-download"><Icon type="android-arrow-down"></Icon><span class="download-history">Download History</span></MenuItem>
                    <MenuItem name="share-my-storage"><Icon type="android-upload"></Icon>Share My Storage</MenuItem>
                    <!-- <MenuItem name="4"><Icon type="android-delete"></Icon>Delete</MenuItem>
                    <MenuItem name="5"><Icon type="android-time"></Icon>History</MenuItem>
                    <MenuItem name="6"><Icon type="android-upload"></Icon>Share My Storage</MenuItem>
                    <MenuItem name="7"><Icon type="android-more-horizontal"></Icon>More</MenuItem> -->
                </MenuGroup>
            </Menu>
        </div>
        <!-- 文件列表div -->
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
                activeName: 'file-index'
            }
        },
        created: function () {
            this.$router.push({ path: '/file-index'});
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
                console.log(e);
                this.$router.push(e);
            }
        }
    }
</script>