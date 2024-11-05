<template>
  <div>
    <img 
      src="../assets/dino_egg.png" 
      alt="Tilføj kupon" 
      @click="addNextAvailableCoupon" 
      class="add-coupon-image"/>

    <!-- Modal til at vise beskeder -->
    <div v-if="showModal && modalMessage" class="modal">
      <div class="modal-content">
        <span class="close" @click="closeModal">&times;</span>
        <p>{{ modalMessage }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, get, update } from "firebase/database"; // Importer ref, get og update fra Firebase Database
import { database } from "@/firebase"; // Importer Firebase-konfigurationen
import { getAuth } from "firebase/auth"; // Importer Firebase Auth til bruger-login

export default {
  data() {
    return {
      userId: null, // ID for den loggede bruger
      couponOrder: ["coupon_id_4", "coupon_id_5", "coupon_id_6"], // Bestem rækkefølge for kuponer
      modalMessage: "", // Beskeden der skal vises i modal
      showModal: false // Tjekker om modal er åben
    };
  },
  methods: {
    async addNextAvailableCoupon() {
      console.log("addNextAvailableCoupon kaldt. showModal før:", this.showModal);
      if (this.userId) {
        const userCouponsRef = ref(database, `users/${this.userId}/available_coupons`);
        
        // Hent brugerens nuværende kuponstatus fra databasen
        const snapshot = await get(userCouponsRef);
        const userCoupons = snapshot.exists() ? snapshot.val() : {};

        // Find den første kupon i rækkefølgen, som endnu ikke er sat til true
        const nextCouponId = this.couponOrder.find(couponId => !userCoupons[couponId]);

        if (nextCouponId) {
          // Sæt den næste tilgængelige kupon til true
          await update(userCouponsRef, {
            [nextCouponId]: true
          });

          // Hent kuponbeskrivelsen fra databasen
          const couponDescriptionRef = ref(database, `coupons/${nextCouponId}/description`);
          const descriptionSnapshot = await get(couponDescriptionRef);
          const couponDescription = descriptionSnapshot.exists() ? descriptionSnapshot.val() : "Ingen beskrivelse tilgængelig.";

          // Vis beskeden i modal
          this.modalMessage = `Kupon "${couponDescription}" blev tilføjet til din konto!`;
          this.showModal = true; // Åben modal
        } else {
          this.modalMessage = "Du har allerede alle tilgængelige kuponer.";
          this.showModal = true; // Åben modal
        }
      } else {
        this.modalMessage = "Bruger er ikke logget ind.";
        this.showModal = true; // Åben modal
      }
      console.log("addNextAvailableCoupon afsluttet. showModal efter:", this.showModal);
    },

    closeModal() {
      this.showModal = false; // Luk modal
    },

    // Metode til at finde den aktuelle bruger
    initializeUser() {
      const auth = getAuth();
      const user = auth.currentUser;

      if (user) {
        this.userId = user.uid; // Gem bruger-ID, hvis brugeren er logget ind
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
.add-coupon-image {
  cursor: pointer;
  max-width: 100%; /* Gør billedet responsivt */
  border: none; /* Ingen kant omkring billedet */
  padding-top: 20px;
}

.add-coupon-image:hover {
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
