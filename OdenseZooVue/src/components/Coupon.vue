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
import { database } from "@/firebase"; // Stelle sicher, dass der Pfad korrekt ist
import { ref, get, update } from "firebase/database"; // Importiere ref, get und update
import { getAuth } from "firebase/auth"; // Importiere Firebase Auth

export default {
  data() {
    return {
      availableCoupon: null, // Coupon, der verfügbar ist
      user: {
        available_coupons: {}, // Store available coupons
        points: 0 // Initialize points
      },
      userId: null // Hier wird die UID des aktuellen Benutzers gespeichert
    };
  },

  methods: {
    async loadCoupons() {
      try {
        const couponsRef = ref(database, 'coupons'); // Verwende ref für die Datenbankreferenz
        const snapshot = await get(couponsRef); // Verwende get, um die Daten abzurufen

        if (snapshot.exists()) {
          const allCoupons = snapshot.val();
          console.log("Alle Coupons:", allCoupons); // Debugging: alle Coupons anzeigen

          // Finde den Coupon, der dem Benutzer zugeordnet ist und verfügbar ist
          const availableCoupons = Object.entries(allCoupons).filter(([id, coupon]) => {
            return this.user.available_coupons[id]; // Coupon ist verfügbar
          });

          console.log("Verfügbare Coupons:", availableCoupons); // Debugging: verfügbare Coupons anzeigen

          if (availableCoupons.length > 0) {
            const [id, coupon] = availableCoupons[0]; // Nimm den ersten verfügbaren Coupon
            this.availableCoupon = { id, ...coupon }; // Setze den verfügbaren Coupon
            console.log("Verfügbarer Coupon:", this.availableCoupon); // Debugging: aktuellen Coupon anzeigen
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
        const auth = getAuth(); // Auth-Instanz holen
        const user = auth.currentUser; // Aktuell angemeldeten Benutzer abfragen

        if (user) {
          this.userId = user.uid; // Setze die UID des aktuellen Benutzers
          const userRef = ref(database, `users/${this.userId}`); // Verwende ref für die Datenbankreferenz
          const snapshot = await get(userRef); // Verwende get, um die Daten abzurufen

          if (snapshot.exists()) {
            this.user = snapshot.val() || { available_coupons: {} };
            console.log("Benutzerdaten geladen:", this.user); // Debugging: Benutzerdaten anzeigen
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
        this.user.available_coupons[couponId] = false; // Markiere den Coupon als nicht mehr verfügbar

        // Update Firebase-Datenbank
        await update(ref(database, `users/${this.userId}`), { // Update der Datenbank
          points: this.user.points,
          available_coupons: this.user.available_coupons
        });
        alert("Tillykke! Du har indløst din kupon!");
        // Aktualisiere die angezeigten Coupons nach dem Einlösen
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
