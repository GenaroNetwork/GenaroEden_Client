<style scoped>

.layout {
    /*border: 1px solid #d7dde4;*/
    background: #f5f7f9;
    position: relative;
    overflow: hidden;
}

.layout-content {
    float: left;
    min-height: 520px;
    width: 78%;
    margin-left: 15px;
    margin-right: 15px;
    overflow: hidden;
    padding: 0 0 0 0;
}

.layout-content-main {
    border-radius: 4px;
}

.layout-menu-left {
    background: #fff;
    height:670px;
    /*min-width: 100px;*/
}

.layout-ceiling-main a {
    color: #9ba7b5;
}

.layout-hide-text .layout-text {
    display: none;
}

.layout-right {
    float: left;
    min-height: 600px;
    width: 210px;
    overflow: hidden;
    background: #fff;
    margin-top: -61px;
}

.ivu-col {
    transition: width .2s ease-in-out;
}

</style>

<template>

<div class="layout" :class="{'layout-hide-text': true}">
    <Row type="flex">
        <Col span="2" class="layout-menu-left">
            <left-bar></left-bar>
        </Col>
        <Col span="22">
            <Row>
                <Col span="24">
                    <header-bar></header-bar>
                </Col>
            </Row>   
            <title-bar></title-bar>
            <div class="layout-content">
                <div class="layout-content-main">
                    <transition mode="out-in">
                        <router-view></router-view>
                    </transition>
                </div>
            </div>
            <div class="layout-right">
                <user-info-bar></user-info-bar>
            </div>
        </Col>
    </Row>
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
