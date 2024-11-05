<template>
  <div>
    <button @click="addPoints" class="scan-button">Scan årskort (+50 point)</button>
  </div>
</template>

<script>
import { ref, onValue, update } from "firebase/database"; // Importer nødvendige Firebase-funktioner
import { database } from "@/firebase"; // Importer Firebase-konfigurationen
import { getAuth } from "firebase/auth"; // Importer Firebase Auth til login

export default {
  data() {
    return {
      userId: null, // ID for den aktuelle bruger
      currentPoints: 0 // Holder brugerens nuværende points
    };
  },
  methods: {
    // Funktion til at tilføje 50 point
    async addPoints() {
      // Tjek om bruger-ID er tilgængelig (bruger er logget ind)
      if (this.userId) {
        const userRef = ref(database, `users/${this.userId}/points`); // Reference til brugerens points i databasen
        
        // Opdater pointværdien ved at lægge 50 til den nuværende værdi
        await update(ref(database, `users/${this.userId}`), {
          points: this.currentPoints + 50 // Læg 50 point til de eksisterende point
        });
        
        alert("50 point blev tilføjet til din konto!"); // Bekræftelsesbesked
      } else {
        alert("Bruger er ikke logget ind.");
      }
    },

    // Funktion til at hente den nuværende bruger og sætte et realtids-listerner på points
    initializeUser() {
      const auth = getAuth();
      const user = auth.currentUser;

      if (user) {
        this.userId = user.uid; // Gem bruger-ID, hvis brugeren er logget ind
        const userPointsRef = ref(database, `users/${this.userId}/points`);
        
        // Real-time listener for pointopdateringer
        onValue(userPointsRef, (snapshot) => {
          if (snapshot.exists()) {
            this.currentPoints = snapshot.val(); // Opdater de aktuelle points
          } else {
            console.error("Brugerens pointdata ikke fundet.");
          }
        });
      } else {
        console.error("Ingen bruger er logget ind.");
      }
    }
  },

  created() {
    this.initializeUser(); // Initialiser brugerdata, når komponenten oprettes
  }
};
</script>

<style>
.scan-button {
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
.scan-button:hover {
  background-color: #45a049;
}
</style>
