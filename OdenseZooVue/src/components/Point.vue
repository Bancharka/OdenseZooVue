<template>
    <div>
        <div class="pointpoint">
            <!-- Personlig hilsen til brugeren, data-binding -->
            <div class="pointh1"><h2>Hej {{ userName }}</h2></div>
            <div class="pointsection">
                <div>
                    <p><img src="/src/img/roedpanda.png" alt=""></p>
                </div>
                <div class="pointbox">
                    <!-- Viser point hvis points er større end 0 -->
                    <div v-if="points > 0">
                        <div id="h1point"><h1>{{ points }}</h1></div>
                        <h3 class="textwhite">Point</h3>
                    </div>
                    <!-- Ellers hvis brugeren har 0 point -->
                    <div v-else>
                        <h3 class="textwhite">Du har 0 point</h3>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>

// IMPORT
// Importerer ref (reaktive data) og onMounted (kalde funktioner ved når komponenten er klar og synligt til brugeren) fra Vue
import { ref, onMounted } from 'vue';

// Importerer auth (autentificere brugeren) og database (få adgang til databasen) fra firebase
import { auth, database } from '../firebase';

// Importerer dbRef (databasereference, ændrer navnet ref til dbRef i min kode, forhindrer navnekonflikter) og onValue (lytter til ændringer i databasen ved den specifikke reference, henter straks den nye værdi og kalder en funktion, som opdaterer data i realtime) fra firebase database
import { ref as dbRef, onValue } from 'firebase/database';




// VARIABLER
// reaktiv variabel til brugerens points, starter på 0
const points = ref(0);

// reaktiv variabel for brugerens ID, bliver sat, når brugeren er logget ind
const userId = ref(null);

// reaktiv variabel for brugerens navn, henter fra databasen
const userName = ref('');


//FUNCTION
// henter data for den aktuelle bruger og opdaterer brugerens navn og point
const loadUserData = () => {
    // overvåger brugerens login-status
    auth.onAuthStateChanged(user => {
        // Hvis logget ind, udføres koden
        if (user) {
            // Sætter userId til brugerens uid fra Firebase Authentication
            userId.value = user.uid;
            
            // userRef bliver direkte link til data fra en specifikke user i databasen, dbRef siger specifikt, hvor i databasen vi skal lede efter
            const userRef = dbRef(database, 'users/' + userId.value);
  
            // svarer til GET API kald - lytter på ændringer i userRef og opdaterer points og userName i realtime, snapshot: repræsentation af de aktuelle data på et bestemt tidspunkt fra en given placering i databasen, snapshot bliver sendt med aktuelle værdi
            onValue(userRef, snapshot => {
                // Hvis der er data i databasen på dette referencepunkt:
                if (snapshot.exists()) {
                    // Henter brugerdata fra snapshot og sætter points og userName. snapshot.val() returnerer dataen som et JS objekt, bliver gemt i variablen userData. userData indeholder så alle de oplysninger, der findes om brugeren på denne placering i databasen, f.eks. points og name.
                    const userData = snapshot.val();
                    points.value = userData.points;
                    userName.value = userData.name;
                } else {
                    // Viser en fejlbesked i konsollen, hvis brugeren ikke findes i databasen.
                    console.error("User not found");
                }
            });
        } else {
            // Viser en fejlbesked, hvis brugeren ikke er logget ind.
            console.error("No user logged in.");
        }
    });
};


// loadUserData bliver kørt, når komponenten er færdig med at indlæse
onMounted(() => {
    loadUserData();
});
</script>
