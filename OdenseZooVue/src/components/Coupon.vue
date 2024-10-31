<template>
  <div>
    <div v-if="availableCoupons.length > 0">
      <div v-for="coupon in availableCoupons" :key="coupon.id" class="coupon">
        <img 
          v-if="coupon.imageUrl" 
          v-bind:src="coupon.imageUrl" 
          alt="Billede af kupon" 
          @click="redeemCoupon(coupon.id, coupon.points)" 
          style="cursor: pointer;" 
        />
      </div>
    </div>
    <div v-else>
      <p>Ingen kuponer tilgængelige.</p>
    </div>
  </div>
</template>

<script>
import { database } from "@/firebase"; // Pfad anpassen, wenn nötig
import { ref, get, update, onValue } from "firebase/database"; // Importiere ref, get, update und onValue
import { getAuth } from "firebase/auth"; // Importiere Firebase Auth

export default {
  data() {
    return {
      availableCoupons: [], // Array für alle verfügbaren Coupons
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

          // Filtere alle verfügbaren Coupons für den Benutzer
          this.availableCoupons = Object.entries(allCoupons).filter(([id, coupon]) => {
            return this.user.available_coupons[id]; // Coupon ist verfügbar
          }).map(([id, coupon]) => ({ id, ...coupon })); // Coupon-Daten formatieren

          if (this.availableCoupons.length > 0) {
            console.log("Verfügbare Coupons:", this.availableCoupons);
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
          this.userId = user.uid; // Setze die Benutzer-ID
          const userRef = ref(database, `users/${this.userId}`);

          // Setze den onValue Listener für die Benutzerpunkte
          onValue(userRef, (snapshot) => {
            if (snapshot.exists()) {
              this.user = snapshot.val() || { available_coupons: {} };
              console.log("Benutzerdaten geladen:", this.user);
              console.log("Verfügbare Coupons:", this.user.available_coupons);
            } else {
              console.error("Benutzerdaten nicht gefunden.");
            }
          });
        } else {
          console.error("Kein Benutzer angemeldet.");
        }
      } catch (error) {
        console.error("Fehler beim Laden der Benutzerdaten:", error);
      }
    },

    async redeemCoupon(couponId, couponPoints) {
      if (this.user.points >= couponPoints) {
        // Punkte abziehen
        this.user.points -= couponPoints; 
        // Coupon als eingelöst markieren
        this.user.available_coupons[couponId] = false; 

        // Update Firebase-Datenbank
        await update(ref(database, `users/${this.userId}`), {
          points: this.user.points,
          available_coupons: this.user.available_coupons
        });
        
        // Filtere die Coupons, um den eingelösten Coupon zu entfernen
        this.availableCoupons = this.availableCoupons.filter(coupon => coupon.id !== couponId);

        alert("Tillykke! Du har indløst din kupon!");
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
.coupon {
  margin-bottom: 20px;
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 5px;
}
.coupon img {
  max-width: 100%;
  height: auto;
}
</style>
