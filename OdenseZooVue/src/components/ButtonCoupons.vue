<template>
  <div>
    <button @click="addNextAvailableCoupon" class="add-coupon-button">Tilføj næste tilgængelige kupon til konto</button>
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
      couponOrder: ["coupon_id_4", "coupon_id_5", "coupon_id_6"] // Bestem rækkefølge for kuponer
    };
  },
  methods: {
    async addNextAvailableCoupon() {
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
          alert(`Kupon ${nextCouponId} blev tilføjet til din konto!`);
        } else {
          alert("Du har allerede alle tilgængelige kuponer.");
        }
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
