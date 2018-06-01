<template>
  <div id="app" class="fullheight" @dragover.prevent @dragleave.prevent @drop.prevent>
    <router-view></router-view>
  </div>
</template>

<script>

import css from 'tether-shepherd/dist/css/shepherd-theme-arrows.css';
import { Storj } from "./utils/storjApiClient";
import { getWallet } from "./utils/sqlite";

export default {
  name: 'Genaro-Eden',
  created() {
    if (process.env.NODE_ENV === 'development') {
      this.$store.commit("updateUsername", localStorage.bridgeUser);
      this.$store.commit("updatePassword", localStorage.bridgePass);
      this.$store.commit("setEncryptionKey", localStorage.bridgeKey);
    }
  }
}
</script>

<style>
html,
body,
.fullheight {
  height: 100%;
}
* {
  outline: none;
}
/* CSS */
body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica,
    Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol",
    "Microsoft YaHei";
  background: #f5f7f9;
  overflow: hidden;
  margin: 0;
  color: #535353;
}
.shepherd-step {
  z-index: 99999;
}
.shepherd-buttons {
  text-align: center !important;
}
.tour-steps {
  text-align: center;
  color: gray;
  margin: 0.5rem;
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
  background-color: rgba(55, 55, 55, 0.6);
  opacity: 0.5;
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 10000;
}

.shepherd-element.shepherd-open,
.shepherd-target.shepherd-enabled {
  z-index: 100000;
  position: relative;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}

.flex {
  display: flex;
}
.v-flex {
  display: flex;
  flex-flow: column;
}
.flex-noshrink {
  flex-shrink: 0;
}
.flex-grow {
  flex-grow: 1;
}
</style>
