<template>
  <div id="app" class="fullheight">
      <router-view></router-view>
  </div>
</template>

<script>

  import css from 'tether-shepherd/dist/css/shepherd-theme-arrows.css';
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
    background: #f5f7f9;
    overflow: hidden;
  }
  .shepherd-step {
    z-index: 99999;
  }
  .shepherd-buttons {
    text-align: center !important
  }
  .tour-steps {
    text-align: center;
    color: gray;
    margin: .5rem
  }
  .tour-steps span {
    font-size: 1.8rem !important;
    color: #3288e6;
  }
  body::after {
    opacity: 0;
  }

  body.shepherd-active::after {
    content: "";
    display: block;
    background-color:rgba(55,55,55,.6);;
    opacity: 0.5;
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 10000; 
  }

  .shepherd-element.shepherd-open, .shepherd-target.shepherd-enabled {
    z-index: 100000; 
    position: relative;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }
</style>
