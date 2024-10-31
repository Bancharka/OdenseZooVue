<template>
  <div v-if="availableCoupon">
    <h2>{{ availableCoupon.name }}</h2>
    <img 
      v-if="availableCoupon.imageUrl" 
      v-bind:src="availableCoupon.imageUrl" 
      alt="Billede af kupon" 
      @click="redeemCoupon(availableCoupon.id, availableCoupon.points)" 
      style="cursor: pointer;" 
    />
    <p>{{ availableCoupon.description }}</p>
  </div>
  <div v-else>
    <p>Ingen kuponer tilgængelige.</p>
  </div>
</template>

<script>
import { database } from "@/firebase"; // Pfad anpassen, wenn nötig
import { ref, get, update } from "firebase/database"; // Importiere ref, get und update
import { getAuth } from "firebase/auth"; // Importiere Firebase Auth
import { onMounted } from 'vue'; // Importiere onMounted

export default {
  data() {
    return {
      availableCoupon: null,
      user: {
        available_coupons: {},
        points: 0
      },
      userId: null
    };
  },

  methods: {
    async loadCoupons() {
      try {
        const couponsRef = ref(database, 'coupons');
        const snapshot = await get(couponsRef);

        if (snapshot.exists()) {
          const allCoupons = snapshot.val();
          console.log("Alle Coupons:", allCoupons);

          const availableCoupons = Object.entries(allCoupons).filter(([id, coupon]) => {
            return this.user.available_coupons[id]; // Coupon ist verfügbar
          });

          if (availableCoupons.length > 0) {
            const [id, coupon] = availableCoupons[0]; // Nimm den ersten verfügbaren Coupon
            this.availableCoupon = { id, ...coupon };
            console.log("Verfügbarer Coupon:", this.availableCoupon);
          } else {
            console.log("Keine verfügbaren Coupons gefunden.");
          }
        } else {
          console.error("Keine Coupons in der Datenbank gefunden.");
        }
      } catch (error) {
        console.error("Fehler beim Laden der Coupons:", error);
      }
    },

    async loadUserData() {
      try {
        const auth = getAuth();
        const user = auth.currentUser;

        if (user) {
          this.userId = user.uid;
          const userRef = ref(database, `users/${this.userId}`);
          const snapshot = await get(userRef);

          if (snapshot.exists()) {
            this.user = snapshot.val() || { available_coupons: {} };
            console.log("Benutzerdaten geladen:", this.user);
          } else {
            console.error("Benutzerdaten nicht gefunden.");
          }
        } else {
          console.error("Kein Benutzer angemeldet.");
        }
      } catch (error) {
        console.error("Fehler beim Laden der Benutzerdaten:", error);
      }
    },

    async redeemCoupon(couponId, couponPoints) {
      if (this.user.points >= couponPoints) {
        this.user.points -= couponPoints;
        this.user.available_coupons[couponId] = false;

        // Update Firebase-Datenbank
        await update(ref(database, `users/${this.userId}`), {
          points: this.user.points,
          available_coupons: this.user.available_coupons
        });
        alert("Tillykke! Du har indløst din kupon!");
        await this.loadCoupons();
      } else {
        alert("Ikke nok point til at bruge kupon.");
      }
    }
  },

  async created() {
    await this.loadUserData(); // Lade Benutzerdaten zuerst
    await this.loadCoupons(); // Lade Coupons
  }
};
</script>

<style>
/* Füge hier deine Stile hinzu, wenn nötig */
</style>
