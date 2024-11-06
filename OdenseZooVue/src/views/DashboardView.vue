<script setup>
import Points from '../components/Point.vue'
import Coupons from '../components/Coupon.vue'
import { ref } from 'vue'
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getDatabase, ref as dbRef, onValue } from "firebase/database";
import { auth, database } from '../firebase'; // Pfad anpassen, wenn nötig

const userId = ref(null); // Halte die userId

onAuthStateChanged(auth, (user) => {
  if (user) {
    userId.value = user.uid; // Setze die Benutzer-ID
  }
});
</script>

<template>
    <Points :userId="userId" /> <!-- Übergib die userId als Prop -->
    <Coupons />
    <img class="imggiraffe" src="/src/img/giraf.png" alt="drawing of a giraffe">
</template>