<style scoped>
div {
  text-align: center;
}
img {
  margin: 90px auto 40px auto;
}
h1 {
  font-size: 1.6rem;
  margin: 20px auto;
}
p {
  width: 600px;
  margin: 0 auto;
}
</style>
<template>
    <div>
        <img src="~@/assets/img/rocket.png" alt="">
        <h1>{{ $t('dashboard.sharestorage.tip1') }}</h1>
        <p v-html="$t('dashboard.sharestorage.tip2')">
          
        </p>
    </div>
</template>

<script>
export default {
}
</script>