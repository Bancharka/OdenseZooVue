<script setup>
import Points from '../components/Point.vue'
import Coupons from '../components/Coupon.vue'
import { ref } from 'vue'
import { onAuthStateChanged } from "firebase/auth";
import { auth } from '../firebase';

const userId = ref(null);

onAuthStateChanged(auth, (user) => {
  if (user) {
    userId.value = user.uid;
  }
});
</script>

<template>
    <Points :userId="userId" />
    <Coupons />

</template>