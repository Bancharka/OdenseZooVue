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
