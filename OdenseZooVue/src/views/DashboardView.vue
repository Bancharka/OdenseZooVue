<script setup>
import Points from '../components/Point.vue'
import Coupons from '../components/Coupon.vue'
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getDatabase, ref as dbRef, onValue } from "firebase/database";
import { auth, database } from '../firebase'; // Adjust the path as necessary

const userPoints = ref(0);

onAuthStateChanged(auth, (user) => {
  if (user) {
    const userId = user.uid;
    const userRef = dbRef(database, 'users/' + userId);

    onValue(userRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        userPoints.value = data.points;
      }
    });
  }
});

</script>

<template>
    <Points />
    <Coupons />
</template>
