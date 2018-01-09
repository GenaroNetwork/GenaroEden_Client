<style scoped>
    .layout-header {
        height: 60px;
        background: #fff;
        box-shadow: 0 1px 1px rgba(0, 0, 0, .1);
        display: flex;
        align-items: center;
        flex-shrink: 0;
    }
    .dropItem {
        margin-left: 20px
    }
    .logo {
        flex-grow: 1;
        padding: 0 0 0 12px;
        height: 44px;
    }
    .logo img {
        height: 100%;
    }
    .demo-avatar-badge {
        padding-right: 12px
    }
    .logout {
        text-align: right;
    }
    .api {
        padding: 15px
    }
</style>

<template>
    <div class="layout-header">
        <div class="logo">
            <img shape="circle" src="~@/assets/logo_big@2x.png" >
        </div>
        <div class="demo-avatar-badge">
            <el-dropdown>
                <span class="el-dropdown-link">
                    {{username}}<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                    <div class="api">
                        <storage-usage></storage-usage>
                        <div class="logout"><a href="" @click="logout">logout</a></div>
                    </div>
                </el-dropdown-menu>
            </el-dropdown>
        </div>
    </div>
</template>

<script>
    import router from '../router'
    import StorageUsage from '@/assembly/StorageUsage'
    import store from '../store'
    import {stepReady} from "../utils/guide"
    import dbUtil from '../utils/DbUtil'

    export default {
        methods: {
            logout() {
                dbUtil.deleteCredentials().then(() => {
                    router.push({path: '/'})
                })
            }
        },
        components:{
            StorageUsage
        },
        computed: {
            username() {
                return this.$store.state.User.username
            }
        },
        mounted: function (){
            stepReady('account-info')
        }
    }
</script>
