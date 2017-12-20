<style scoped>

.layout {
    /*border: 1px solid #d7dde4;*/
    background: #f5f7f9;
    overflow: hidden;
    display: flex;
    flex-direction: column;
}

.layout-content-main {
    border-radius: 4px;
    flex-grow: 1;
}

.layout-menu-left {
    background: #fff;
    /*min-width: 100px;*/
}

.layout-ceiling-main a {
    color: #9ba7b5;
}

.layout-right {
    min-height: 600px;
    width: 210px;
    overflow: hidden;
    background: #fff;
}

.ivu-col {
    transition: width .2s ease-in-out;
}
.fcontainer {
    display: flex;
    flex-grow: 1;
    padding: 10px;
}
.app-body {
    flex-grow: 1
}
</style>

<template>

<div class="layout fullheight">
    <header-bar></header-bar>
    <div class="fcontainer">
        <transition mode="out-in">
            <router-view></router-view>
        </transition>
    </div>
</div>

</template>

<script>
import HeaderBar from '@/assembly/HeaderBar'
import LeftBar from '@/assembly/LeftBar'
import TitleBar from '@/assembly/TitleBar'
import UserInfoBar from '@/assembly/UserInfoBar'

export default {
    components:{
        HeaderBar,
        LeftBar,
        TitleBar,
        UserInfoBar
    }
}

</script>
