<template>
  <div>
    <img 
      src="../assets/annual_pass.png" 
      alt="Scan årskort" 
      @click="addPoints" 
      class="scan-image"/>

    <!-- Modal til at vise beskeder -->
    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <span class="close" @click="closeModal">&times;</span>
        <p>{{ modalMessage }}</p>
      </div>
    </div>
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
      currentPoints: 0, // Holder brugerens nuværende points
      modalMessage: "", // Beskeden der skal vises i modal
      showModal: false // Tjekker om modal er åben
    };
  },
  methods: {
    async addPoints() {
      console.log("addPoints kaldt. userId:", this.userId, "currentPoints:", this.currentPoints);
      // Tjek om bruger-ID er tilgængelig (bruger er logget ind)
      if (this.userId) {
        // Opdater pointværdien ved at lægge 50 til den nuværende værdi
        await update(ref(database, `users/${this.userId}`), {
          points: this.currentPoints + 50 // Læg 50 point til de eksisterende point
        });

        // Vis beskeden i modal
        this.modalMessage = "50 point blev tilføjet til din konto!"; // Modalbesked
        this.showModal = true; // Åben modal
      } else {
        this.modalMessage = "Bruger er ikke logget ind."; // Modalbesked
        this.showModal = true; // Åben modal
      }
      console.log("addPoints afsluttet. modalMessage:", this.modalMessage, "showModal:", this.showModal);
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
            this.currentPoints = 0; // Sæt til 0 hvis ingen data findes
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
.scan-image {
  cursor: pointer;
  border: none;
  max-width: 100%;
}

.scan-image:hover {
  opacity: 0.8; /* Lille effekt, når man hover over billedet */
}

.modal {
  display: flex;
  justify-content: center; /* Centrerer indholdet horisontalt */
  align-items: center; /* Centrerer indholdet vertikalt */
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%; /* Sæt højden til 100% for at dække hele skærmen */
  overflow: auto; /* Tilføjer scroll hvis nødvendigt */
  background-color: rgb(0, 0, 0);
  background-color: hsl(147, 100%, 24%, 0.4);
}

.modal-content {
  background-color: #fefefe;
  padding: 20px;
  border: none;
  width: 80%; /* Kan ændres til hvad der passer */
  max-width: 500px; /* Sæt en maksimal bredde for modalen */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* Tilføj skygge for dybde */
  border-radius: 8px; /* Rund hjørner for et blødere udseende */
}

.close {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.close:hover,
.close:focus {
  color: black;
  text-decoration: none;
  cursor: pointer;
}
</style>
