<template>
    <div>
        
        <div class="pointpoint" >
            <div class="pointh1"><h2>navn</h2></div>
            <div class="pointsection">
                <div>
                    <p><img src="/public/img/roedpanda.png" alt=""></p>
                </div>
                
                
                <div class="pointbox">
                    <div v-if="points > 0">
                        <div><h1> {{ points }}</h1></div>
                        <h3>Point</h3> <!-- Zeige die Punkte des aktuellen Benutzers an -->
                        
                    </div>

                    

                    <div v-else>
                        <h3>Du har 0 point</h3>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'; // Importiere Vue-Funktionen
import { getAuth } from "firebase/auth"; // Importiere Firebase Auth
import { getDatabase, ref as dbRef, onValue } from "firebase/database"; // Importiere Firebase Database

const points = ref(0); // Halte die Punkte für den aktuellen Benutzer
const userId = ref(null); // Halte die Benutzer-ID

// Funktion zum Laden der Benutzerdaten und Setzen des Listeners
const loadUserData = () => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (user) {
    userId.value = user.uid; // Setze die Benutzer-ID
    const db = getDatabase();
    const userRef = dbRef(db, 'users/' + userId.value);

    // Setze den onValue Listener, um die Punkte in Echtzeit zu überwachen
    onValue(userRef, (snapshot) => {
      if (snapshot.exists()) {
        const userData = snapshot.val();
        points.value = userData.points; // Setze die Punkte des aktuellen Benutzers
      } else {
        console.error("Benutzer nicht gefunden");
      }
    }, {
      onlyOnce: false // Dadurch bleibt der Listener aktiv
    });
  } else {
    console.error("Kein Benutzer angemeldet.");
  }
};

// Rufe loadUserData auf, wenn die Komponente erstellt wird
onMounted(() => {
  loadUserData();
});
</script>

<style>
/* Füge hier deine Stile hinzu, wenn nötig */
</style>
