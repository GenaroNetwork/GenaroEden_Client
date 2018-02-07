import Vue from "vue";

Vue.filter("wei2eth", wei => {
    wei = parseFloat(wei);
    let eth = wei * Math.pow(10, -18);
    if (eth !== eth) eth = 0;
    return eth;
});

Vue.filter("wei2gnx", wei => {
    wei = parseFloat(wei);
    let gnx = wei * Math.pow(10, -9);
    if (gnx !== gnx) gnx = 0;
    return gnx;
});

Vue.filter("numslice", num => {
    num = parseFloat(num);
    return num.toFixed(6);
});

import moment from 'moment';
Vue.filter("formatTime", time => {
    return moment(time).format("MM/DD/YYYY hh:mm a");
});

import humanSize from 'human-size';
Vue.filter("formatSize", size => {
    return humanSize(size);
});


import { fileName2Icon } from "../utils/file2icon";
Vue.filter("file2icon", (fileName, type) => {
    return fileName2Icon(fileName)[type];
});



