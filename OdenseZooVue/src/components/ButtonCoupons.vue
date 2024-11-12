<template>
  <div class="video-container">
    <!-- Hintergrundbild, das immer sichtbar ist und hinter dem Video liegt -->
    <div class="video-background">
      <img :src="backgroundImage" alt="Hintergrundbild" />
    </div>

    <!-- Video mit transparentem Hintergrund -->
    <video 
      ref="dinoVideo" 
      src="../assets/dino_egg_video.webm" 
      alt="Tilføj kupon" 
      class="add-coupon-video"
      @click="handleVideoClick" 
      preload="auto"
      playsinline
      muted
    ></video>
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
      backgroundImage: "", // Anfangszustand: leeres Bild
    };
  },
  methods: {
    // Methode zur Initialisierung des Benutzers
    initializeUser() {
      const auth = getAuth();
      const user = auth.currentUser;

      if (user) {
        this.userId = user.uid; // Setze die Benutzer-ID, wenn der Benutzer eingeloggt ist
      } else {
        console.error("Kein Benutzer eingeloggt.");
      }
    },

    // Methode zum Handhaben des Klicks auf das Video
    handleVideoClick() {
      const video = this.$refs.dinoVideo;
      
      // Das Hintergrundbild sofort ändern
      this.updateBackgroundImage(); // Hintergrundbild setzen

      video.play(); // Video starten

      // Wenn das Video endet, rufen wir die Funktion zum Hinzufügen des nächsten Coupons auf
      video.onended = () => {
        this.addNextAvailableCoupon(); // Coupon hinzufügen, wenn das Video zu Ende ist
      };
    },

    // Methode zum Aktualisieren des Hintergrundbildes
    async updateBackgroundImage() {
      // Hintergrundbild ändern
      if (this.userId) {
        const userCouponsRef = ref(database, `users/${this.userId}/available_coupons`);
        
        // Benutzer-Coupons aus der Datenbank holen
        const snapshot = await get(userCouponsRef);
        const userCoupons = snapshot.exists() ? snapshot.val() : {};

        // Den nächsten Coupon finden, der noch nicht verwendet wurde
        const nextCouponId = this.couponOrder.find(couponId => !userCoupons[couponId]);

        if (nextCouponId) {
          // Die Coupon-Daten aus der Datenbank holen
          const couponRef = ref(database, `coupons/${nextCouponId}`);
          const couponSnapshot = await get(couponRef);
          const couponData = couponSnapshot.exists() ? couponSnapshot.val() : {};

          // Wenn kein Bild vorhanden ist, ein Standardbild verwenden
          const couponImageUrl = couponData.imageUrl || "../assets/default_coupon_image.png";
          
          // Hintergrundbild setzen
          this.backgroundImage = couponImageUrl;
        }
      }
    },

    // Methode zum Hinzufügen des nächsten verfügbaren Coupons
    async addNextAvailableCoupon() {
      console.log("addNextAvailableCoupon aufgerufen.");

      if (this.userId) {
        const userCouponsRef = ref(database, `users/${this.userId}/available_coupons`);

        // Benutzer-Coupons aus der Datenbank holen
        const snapshot = await get(userCouponsRef);
        const userCoupons = snapshot.exists() ? snapshot.val() : {};

        // Den nächsten Coupon finden, der noch nicht aktiviert wurde
        const nextCouponId = this.couponOrder.find(couponId => !userCoupons[couponId]);

        if (nextCouponId) {
          // Den Coupon als verfügbar markieren
          await update(userCouponsRef, {
            [nextCouponId]: true
          });

          // Die Coupon-Beschreibung und das Bild aus der Datenbank holen
          const couponRef = ref(database, `coupons/${nextCouponId}`);
          const couponSnapshot = await get(couponRef);
          const couponData = couponSnapshot.exists() ? couponSnapshot.val() : {};

          const couponDescription = couponData.description || "Keine Beschreibung verfügbar.";
          const couponImageUrl = couponData.imageUrl || "../assets/default_coupon_image.png"; // Standardbild, wenn kein Bild gefunden wurde

          console.log(`Coupon "${couponDescription}" wurde zu deinem Konto hinzugefügt!`);

          // Das Hintergrundbild mit der neuen Coupon-URL aktualisieren
          this.backgroundImage = couponImageUrl;
        } else {
          console.log("Alle verfügbaren Coupons wurden bereits hinzugefügt.");
        }
      } else {
        console.error("Benutzer ist nicht eingeloggt.");
      }
    }
  },

  created() {
    this.initializeUser(); // Benutzerinformationen beim Erstellen der Komponente initialisieren
  }
};
</script>


