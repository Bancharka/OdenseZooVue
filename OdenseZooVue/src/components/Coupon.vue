<template>
  <div>
    <!-- Other coupons (1, 2, 3) -->
    <div v-if="regularCoupons.length > 0">
      <p class="couponheadline">Månedskuponer</p>
      <div v-for="coupon in regularCoupons" :key="coupon.id" class="coupon">
        <img 
          v-if="coupon.imageUrl" 
          :src="coupon.imageUrl" 
          alt="Billede af kupon" 
          @click="redeemCoupon(coupon.id, coupon.points)" 
          style="cursor: pointer;" 
        />
      </div>
    </div>

    <!-- Egg coupons section with headline -->
    <div v-if="eggCoupons.length > 0">
      <p class="couponheadline">Æg-kuponer</p>
      <div v-for="coupon in eggCoupons" :key="coupon.id" class="coupon">
        <img 
          v-if="coupon.imageUrl" 
          :src="coupon.imageUrl" 
          alt="Billede af kupon" 
          @click="redeemCoupon(coupon.id, coupon.points)" 
          style="cursor: pointer;" 
        />
      </div>
    </div>

    <!-- Message when no coupons are available -->
    <div v-if="availableCoupons.length === 0">
      <p class="nocouponsavailable">Ingen kuponer tilgængelige.</p>
    </div>

    <!-- Modal for messages -->
    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <span class="close" @click="closeModal">&times;</span>
        <p>{{ modalMessage }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { database } from "@/firebase";
import { ref, get, update, onValue } from "firebase/database";
import { getAuth } from "firebase/auth";

export default {
  data() {
    return {
      availableCoupons: [],
      user: {
        available_coupons: {},
        points: 0
      },
      userId: null,
      modalMessage: "",
      showModal: false
    };
  },

  computed: {
    // Separate egg coupons (IDs 4, 5, 6) and other coupons
    eggCoupons() {
      return this.availableCoupons.filter(coupon =>
        ["coupon_id_4", "coupon_id_5", "coupon_id_6"].includes(coupon.id)
      );
    },

    regularCoupons() {
      return this.availableCoupons.filter(coupon =>
        !["coupon_id_4", "coupon_id_5", "coupon_id_6"].includes(coupon.id)
      );
    }
  },

  methods: {
    async loadCoupons() {
      try {
        const couponsRef = ref(database, 'coupons');
        const snapshot = await get(couponsRef);

        if (snapshot.exists()) {
          const allCoupons = snapshot.val();
          this.availableCoupons = Object.entries(allCoupons)
            .filter(([id]) => this.user.available_coupons[id])
            .map(([id, coupon]) => ({ id, ...coupon }));
        } else {
          console.error("Ingen coupons fundet.");
        }
      } catch (error) {
        console.error("Fejl ved indlæsning af coupons:", error);
      }
    },

    async loadUserData() {
      try {
        const auth = getAuth();
        const user = auth.currentUser;

        if (user) {
          this.userId = user.uid;
          const userRef = ref(database, `users/${this.userId}`);
          onValue(userRef, (snapshot) => {
            if (snapshot.exists()) {
              this.user = snapshot.val() || { available_coupons: {} };
            } else {
              console.error("Brugerdata ikke fundet.");
            }
          });
        } else {
          console.error("Ingen bruger logget ind.");
        }
      } catch (error) {
        console.error("Fejl ved indlæsning af brugerdata:", error);
      }
    },

    async redeemCoupon(couponId, couponPoints) {
      if (this.user.points >= couponPoints) {
        this.user.points -= couponPoints;
        this.user.available_coupons[couponId] = false;

        await update(ref(database, `users/${this.userId}`), {
          points: this.user.points,
          available_coupons: this.user.available_coupons
        });

        this.availableCoupons = this.availableCoupons.filter(coupon => coupon.id !== couponId);

        // Show message in modal instead of alert
        this.modalMessage = "Tillykke! Du har indløst din kupon!";
        this.showModal = true;
      } else {
        this.modalMessage = "Ikke nok point til at bruge kupon.";
        this.showModal = true;
      }
    },

    closeModal() {
      this.showModal = false;
    }
  },

  async created() {
    await this.loadUserData();
  },

  watch: {
    user: {
      handler() {
        this.loadCoupons();
      },
      deep: true
    }
  }
};
</script>
