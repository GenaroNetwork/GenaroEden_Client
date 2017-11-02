<style scoped>

    .layout-logo-left {
        height: 68px;
        background: #fff;
        line-height: 30px;
        text-align: center;
        vertical-align: middle;
        overflow: hidden;
        padding-top: 10px;
    }
    .fill_bar {
        height:200px;
    }
    .ivu-menu-item {
        padding-top: 14px 40px;
    }
</style>

<template>
    <Menu active-name="index" theme="primary" width="auto" @on-select="routeTo">
        <div class="layout-logo-left"><img id="logo" src="~@/assets/logo_small.png"></div>
            <MenuItem name="index">
                <Icon type="ios-navigate" :size="iconSize"></Icon>
            </MenuItem>
            <!-- <MenuItem name="form">
                <Icon type="document" :size="iconSize"></Icon>
            </MenuItem>
            <MenuItem name="table">
                <Icon type="navicon" :size="iconSize"></Icon>
            </MenuItem>
            <MenuItem name="markdown-viewer">
                <Icon type="social-markdown" :size="iconSize"></Icon>
            </MenuItem>
            <MenuItem name="markdown-editor-1">
                <Icon type="edit" :size="iconSize"></Icon>
            </MenuItem>
            <MenuItem name="markdown-editor-2">
                <Icon type="edit" :size="iconSize"></Icon>
            </MenuItem>
            <MenuItem name="rtf">
                <Icon type="document-text" :size="iconSize"></Icon>
            </MenuItem>
            <MenuItem name="upload">
                <Icon type="ios-cloud-upload-outline" :size="iconSize"></Icon>
            </MenuItem>
            <MenuItem name="echarts">
                <Icon type="pie-graph" :size="iconSize"></Icon>
            </MenuItem> -->
            <div class="fill_bar"></div>
    </Menu>
</template>

<script>
    export default {
        data() {
            return {
                iconSize: 20
            }
        },
        computed: {
            setActive() {
              return this.$route.path.replace('/','');
            }
        },
        methods: {
            routeTo(e) {
                //console.log(e);
                this.$router.push(e);
            }
        }
    }
</script>