<template>
  <div id="app" class="fullheight">
      <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: 'Genaro-Eden'
  }
</script>

<style>
  html,body,.fullheight {
    height: 100%;
  }
  /* CSS */
  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Microsoft YaHei";
    -webkit-user-select: none;
    -webkit-app-region: drag;
    cursor: default;
    background: #f5f7f9;
    overflow: scroll;
  }
</style>
