import Vue from "vue";

Vue.filter("wei2gnx", wei => {
    wei = parseFloat(wei);
    let gnx = wei * Math.pow(10, -9);
    if (gnx !== gnx) gnx = 0;
    return gnx;
});
export default {
}