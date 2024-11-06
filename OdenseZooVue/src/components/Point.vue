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
                      <h3 class="textwhite">Du har 0 point</h3>
                      
                  </div>
              </div>
          </div>
      </div>

      <!-- Modal til at vise beskeder -->
      <div v-if="showModal" class="modal">
          <div class="modal-content">
              <span class="close" @click="closeModal">&times;</span>
              <p>{{ modalMessage }}</p>
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
const showModal = ref(false); // For at styre modalens synlighed
const modalMessage = ref(''); // Beskeden der skal vises i modal

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

const showModalMessage = (message) => {
  modalMessage.value = message; // Set the modal message
  showModal.value = true; // Show modal
};

const closeModal = () => {
  showModal.value = false; // Close modal
};

onMounted(() => {
  loadUserData();
});
</script>

