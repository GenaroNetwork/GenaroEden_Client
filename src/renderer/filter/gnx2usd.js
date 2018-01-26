import Vue from "vue";

Vue.filter("gnx2usd", wei => {
    wei = parseFloat(wei);
    let eth = wei * Math.pow(10, -18);
    if (eth !== eth) eth = 0;
    return eth;
});
export default {
}