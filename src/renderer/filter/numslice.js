import Vue from "vue";

Vue.filter("numslice", num => {
    num = parseFloat(num);
    return num.toFixed(6);
});
export default {
}