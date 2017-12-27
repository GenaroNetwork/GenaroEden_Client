<style scoped>
    .layout-header {
        height: 60px;
        background: #fff;
        box-shadow: 0 1px 1px rgba(0, 0, 0, .1);
        display: flex;
        align-items: center;
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
</style>

<template>
    <div class="layout-header">
        <div class="logo">
            <img shape="circle" src="~@/assets/logo_big@2x.png" >
        </div>
        <div class="demo-avatar-badge">
            <Poptip placement="bottom-end" width="">
                <span>{{username}}</span>
                <Icon type="arrow-down-b"></Icon>
                <div class="api" slot="content">
                    <storage-usage></storage-usage>
                    <div class="logout"><a href="" @click="logout">logout</a></div>
                </div>
            </Poptip>
        </div>
    </div>
</template>

<script>
    import router from '../router'
    import StorageUsage from '@/assembly/StorageUsage'
    import store from '../store'
    export default {
        methods: {
            logout() {
                router.push({path: '/'})
            }
        },
        components:{
            StorageUsage
        },
        computed: {
            username() {
                return this.$store.state.User.username
            }
        }
    }
</script>
