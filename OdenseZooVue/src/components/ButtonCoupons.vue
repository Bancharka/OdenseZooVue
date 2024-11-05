<template>
  <div>
    <button @click="addRandomCoupon" class="add-coupon-button">Tilføj tilfældig kupon til konto</button>
  </div>
</template>

<script>
import { ref, update } from "firebase/database"; // Importér ref og update fra Firebase Database
import { database } from "@/firebase"; // Importér Firebase-konfigurationen
import { getAuth } from "firebase/auth"; // Importér Firebase Auth til brugerlogin

export default {
  data() {
    return {
      userId: null, // ID for den loggede bruger
      availableCouponIds: ["coupon_id_4", "coupon_id_5", "coupon_id_6"] // Mulige kuponer, der kan tilføjes
    };
  },
  methods: {
    // Metode til at tilføje en tilfældig kupon til brugerens konto
    async addRandomCoupon() {
      if (this.userId) {
        // Vælg en tilfældig kupon-ID fra listen over tilgængelige kuponer
        const randomCouponId = this.availableCouponIds[Math.floor(Math.random() * this.availableCouponIds.length)];

        // Reference til brugerens kuponer i databasen
        const userCouponsRef = ref(database, `users/${this.userId}/available_coupons`);

        // Opdater Firebase ved at sætte den valgte kupon til true
        await update(userCouponsRef, {
          [randomCouponId]: true // Aktivér den tilfældige kupon
        });

        alert(`Kupon ${randomCouponId} blev tilføjet til din konto!`);
      } else {
        alert("Bruger er ikke logget ind.");
      }
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
.add-coupon-button {
  padding: 10px 20px;
  background-color: #007BFF;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
.add-coupon-button:hover {
  background-color: #0069d9;
}
</style>
