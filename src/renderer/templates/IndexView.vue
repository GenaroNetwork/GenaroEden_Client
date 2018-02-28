<style scoped>
.layout {
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
  width: 210px;
  overflow: hidden;
  background: #fff;
}
.fcontainer {
  display: flex;
  flex-grow: 1;
  padding: 10px;
}
.app-body {
  flex-grow: 1;
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

export default {
    components: {
        HeaderBar
    },
    created() {
        this.$store.commit('taskListLoad');
        this.$store.dispatch("walletListInit");
    }
}

</script>
