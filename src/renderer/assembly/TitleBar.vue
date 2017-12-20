<style scoped>
    .layout_title {
        min-height: 60px;
        margin-left: 15px;
        padding-top: 20px;
        padding-left: 10px;
    }
</style>

<template>
    <div class="layout_title">
        <h3>My Genaro Domain <a class="dsadsa" @click.prevent="routeToUpload()">+</a></h3>
    </div>
</template>

<script>
    export default {
        methods: {
            routeToUpload() {
                this.$router.push({ path: '/file-upload'});
            }
        }
    }
</script>