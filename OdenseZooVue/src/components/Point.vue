

<template>
    <div>
      <div class="pointpoint">
        <div class="pointh1"><h2>Hej {{ userName }}</h2></div>
        <div class="pointsection">
          <div>
            <p><img src="/src/img/roedpanda.png" alt=""></p>
          </div>
          <div class="pointbox">
            <div v-if="points > 0">
              <div id="h1point"><h1>{{ points }}</h1></div>
              <h3 class="textwhite">Point</h3> <!-- Zeige die Punkte des aktuellen Benutzers an -->
            </div>
            <div v-else>
              <h3 class="textwhite" >Du har 0 point</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  

<script setup>

import { ref, onMounted } from 'vue';
import { auth, database } from '../firebase'; // Import Firebase configuration
import { ref as dbRef, onValue } from 'firebase/database';

const points = ref(0);
const userId = ref(null);
const userName = ref(''); // Add a ref for the user's name

const loadUserData = () => {
  auth.onAuthStateChanged(user => {
    if (user) {
      userId.value = user.uid;
      const userRef = dbRef(database, 'users/' + userId.value);

      onValue(userRef, snapshot => {
        if (snapshot.exists()) {
          const userData = snapshot.val();
          points.value = userData.points;
          userName.value = userData.name; // Set the user's name
        } else {
          console.error("User not found");
        }
      });
    } else {
      console.error("No user logged in.");
    }
  });
};

onMounted(() => {
  loadUserData();
});

</script>

<style>
/* Füge hier deine Stile hinzu, wenn nötig */
</style>
