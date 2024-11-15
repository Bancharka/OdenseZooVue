<template>
  <div>
    <!-- Månedskuponer -->
    <div v-if="regularCoupons.length > 0">
      <p class="couponheadline">Månedskuponer</p>
      <div v-for="coupon in regularCoupons" :key="coupon.id" class="coupon">
        <img v-if="coupon.imageUrl" :src="coupon.imageUrl" alt="Billede af kupon" @click="redeemCoupon(coupon.id, coupon.points)" />
      </div>
    </div>

    <!-- Æg-kuponer -->
    <div v-if="eggCoupons.length > 0">
      <p class="couponheadline">Æg-kuponer</p>
      <div v-for="coupon in eggCoupons" :key="coupon.id" class="coupon">
        <img v-if="coupon.imageUrl" :src="coupon.imageUrl" alt="Billede af kupon" @click="redeemCoupon(coupon.id, coupon.points)" />
      </div>
    </div>

    <!-- Hvis der ikke er kuponer tilgængelige -->
    <div v-if="regularCoupons.length === 0 && eggCoupons.length === 0">
      <p class="nocouponsavailable">Ingen kuponer tilgængelige.</p>
    </div>

    <!-- Modal popup -->
    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <span class="close" @click="closeModal">&times;</span>
        <p>{{ modalMessage }}</p>
      </div>
    </div>
  </div>
  <img class="imggiraffe" src="/src/img/giraf.png" alt="drawing of a giraffe">
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
        points: 0,
      },
      userId: null,
      modalMessage: "",
      showModal: false,
    };
  },
  computed: {
    // Filtrerer månedskuponer (ID 1-6)
    regularCoupons() {
      return this.availableCoupons.filter(coupon =>
        ["coupon_id_1", "coupon_id_2", "coupon_id_3", "coupon_id_4", "coupon_id_5", "coupon_id_6"].includes(coupon.id)
      );
    },
    // Filtrerer æg-kuponer (ID 7-10)
    eggCoupons() {
      return this.availableCoupons.filter(coupon =>
        ["coupon_id_7", "coupon_id_8", "coupon_id_9", "coupon_id_10"].includes(coupon.id)
      );
    },
  },
  methods: {
    async loadCoupons() {
      try {
        const couponsRef = ref(database, "coupons");
        const snapshot = await get(couponsRef);
        if (snapshot.exists()) {
          const allCoupons = snapshot.val();
          this.availableCoupons = Object.entries(allCoupons)
            .filter(([id]) => this.user.available_coupons[id])
            .map(([id, coupon]) => ({ id, ...coupon }));
        } else {
          console.error("Ingen kuponer fundet.");
        }
      } catch (error) {
        console.error("Fejl ved indlæsning af kuponer:", error);
      }
    },
    async loadUserData() {
      try {
        const auth = getAuth();
        const user = auth.currentUser;
        if (user) {
          this.userId = user.uid;
          const userRef = ref(database, `users/${this.userId}`);
          onValue(userRef, snapshot => {
            if (snapshot.exists()) {
              this.user = snapshot.val();
              this.loadCoupons();
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
          available_coupons: this.user.available_coupons,
        });

        this.modalMessage = "Tillykke! Du har indløst din kupon!";
        this.showModal = true;
      } else {
        this.modalMessage = "Ikke nok point til at bruge kupon.";
        this.showModal = true;
      }
    },
    closeModal() {
      this.showModal = false;
    },
  },
  async created() {
    await this.loadUserData();
  },
};
</script>
