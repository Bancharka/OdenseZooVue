<template>
  <div class="video-container">
    <div class="video-background">
      <img :src="backgroundImage" alt="Billede af kupon" />
    </div>

    <video 
    ref="dinoVideo" 
    class="add-coupon-video"
    @click="handleVideoClick" 
    preload="auto"
    playsinline
    muted
    >
    <source src="../assets/dino_egg_video.webm" type="video/webm" />
    <source src="../assets/dino_egg_video.mp4" type="video/mp4" />
    Your browser does not support the video tag.
    </video>  
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
      couponOrder: ["coupon_id_7", "coupon_id_8", "coupon_id_9", "coupon_id_10"], // Bestem rækkefølge for kuponer
      backgroundImage: "", // Initial tilstand: tomt billede
    };
  },
  methods: {
    // Metode til at initialisere brugeren
    initializeUser() {
      const auth = getAuth();
      const user = auth.currentUser;

      if (user) {
        this.userId = user.uid; // Sæt bruger-ID'et, hvis brugeren er logget ind
      } else {
        console.error("Ingen bruger er logget ind.");
      }
    },

    // Metode til at håndtere klik på videoen
    handleVideoClick() {
      const video = this.$refs.dinoVideo;
      
      // Skift baggrundsbilledet med det samme
      this.updateBackgroundImage(); // Sæt baggrundsbilledet

      video.play(); // Start videoen

      // Når videoen slutter, tilføjes næste kupon
      video.onended = () => {
        this.addNextAvailableCoupon(); // Tilføj kupon, når videoen er færdig
      };
    },

    // Metode til at opdatere baggrundsbilledet
    async updateBackgroundImage() {
      // Skift baggrundsbilledet
      if (this.userId) {
        const userCouponsRef = ref(database, `users/${this.userId}/available_coupons`);
        
        // Hent brugerens kuponer fra databasen
        const snapshot = await get(userCouponsRef);
        const userCoupons = snapshot.exists() ? snapshot.val() : {};

        // Find den næste kupon, som ikke er blevet brugt
        const nextCouponId = this.couponOrder.find(couponId => !userCoupons[couponId]);

        if (nextCouponId) {
          // Hent kupondata fra databasen
          const couponRef = ref(database, `coupons/${nextCouponId}`);
          const couponSnapshot = await get(couponRef);
          const couponData = couponSnapshot.exists() ? couponSnapshot.val() : {};

          // Brug standardbillede, hvis der ikke findes et billede
          const couponImageUrl = couponData.imageUrl || "../assets/default_coupon_image.png";
          
          // Sæt baggrundsbilledet
          this.backgroundImage = couponImageUrl;
        }
      }
    },

    // Metode til at tilføje den næste tilgængelige kupon
    async addNextAvailableCoupon() {
      console.log("addNextAvailableCoupon blev kaldt.");

      if (this.userId) {
        const userCouponsRef = ref(database, `users/${this.userId}/available_coupons`);

        // Hent brugerens kuponer fra databasen
        const snapshot = await get(userCouponsRef);
        const userCoupons = snapshot.exists() ? snapshot.val() : {};

        // Find den næste kupon, som ikke er aktiveret
        const nextCouponId = this.couponOrder.find(couponId => !userCoupons[couponId]);

        if (nextCouponId) {
          // Marker kuponen som tilgængelig
          await update(userCouponsRef, {
            [nextCouponId]: true
          });

          // Hent beskrivelse og billede af kuponen fra databasen
          const couponRef = ref(database, `coupons/${nextCouponId}`);
          const couponSnapshot = await get(couponRef);
          const couponData = couponSnapshot.exists() ? couponSnapshot.val() : {};

          const couponDescription = couponData.description || "Ingen beskrivelse tilgængelig.";
          const couponImageUrl = couponData.imageUrl || "../assets/default_coupon_image.png"; // Standardbillede, hvis der ikke findes et billede

          console.log(`Kupon "${couponDescription}" blev tilføjet til din konto!`);

          // Opdater baggrundsbilledet med den nye kupon-URL
          this.backgroundImage = couponImageUrl;
        } else {
          console.log("Alle tilgængelige kuponer er allerede blevet tilføjet.");
        }
      } else {
        console.error("Bruger er ikke logget ind.");
      }
    }
  },

  created() {
    this.initializeUser(); // Initialiser brugerinformation, når komponenten oprettes
  }
};
</script>
