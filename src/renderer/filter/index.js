import Vue from "vue";

import moment from 'moment';
import humanSize from 'human-size';
import { fileName2Icon } from "../utils/file2icon";

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

Vue.filter("formatTime", time => {
    let formated = moment(time).format("MM/DD/YYYY hh:mm a");
    return formated === "Invalid date" ? time : formated;
});

Vue.filter("formatSize", size => {
    if (size === null || size === void 0) return "--";
    return humanSize(size);
});

Vue.filter("formatHourSize", size => {
    if (size === null || size === void 0) return "--";
    return humanSize(size) + "·h";
});


Vue.filter("file2icon", (fileName, type) => {
    return fileName2Icon(fileName)[type];
});



