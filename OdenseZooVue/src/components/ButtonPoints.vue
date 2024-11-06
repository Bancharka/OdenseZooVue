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

    closeModal() {
      this.showModal = false; // Luk modal
      console.log("Modal lukket."); // Log til konsol
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

