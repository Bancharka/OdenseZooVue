<template>
  <div>
    <!-- Månedskuponer -->
    <div v-if="regularCoupons.length > 0">
      <p class="couponheadline">Månedskuponer</p>
      <div v-for="coupon in regularCoupons" :key="coupon.id" class="coupon">
        <img v-if="coupon.imageUrl" :src="coupon.imageUrl" alt="Billede af kupon" @click="redeemCoupon(coupon.id, coupon.points)"/>
      </div>
    </div>

    <!-- Æg-kuponer-->
    <div v-if="eggCoupons.length > 0">
      <p class="couponheadline">Æg-kuponer</p>
      <!--Loop der kører igennem eggCoupons array-->
      <div v-for="coupon in eggCoupons" :key="coupon.id" class="coupon">
        <!--Når brugeren klicker, bliver funktionen redeemCoupon kaldt, coupon.id og coupon.points som argumenter-->
        <img v-if="coupon.imageUrl" :src="coupon.imageUrl" alt="Billede af kupon" @click="redeemCoupon(coupon.id, coupon.points)"/>
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
</template>


<script>
import { database } from "@/firebase";  // Importerer Firebase-databasen
import { ref, get, update, onValue } from "firebase/database"; // Firebase-funktioner til at få og opdatere data, update svarer til PUT API-kald, men update opdaterer kun på den specifikke reference jeg tildeler, og ikke hele ressourcen, onValue svarer til GET API kald, men opdaterer i realtime
import { getAuth } from "firebase/auth"; // Firebase funktion til at få brugerens autentificering


export default { //vi eksporterer et objekt med default for at definere en komponente, indeholder alle de variabler og data, som Vue-komponenten bruger.
  data() {
    return {
      availableCoupons: [],  // En tom liste /array til at gemme alle kuponer brugeren kan bruge senere hen
      user: { 
        available_coupons: {},  // En tom liste/objekt af kuponer som brugeren har tilgængelige
        points: 0  // Brugerens point, starter på 0, bliver opdateret senere
      },
      userId: null,  // Brugerens ID, starter med null for at vise, at der ingen er logged in i starten, når man logger ind bliver det opdateret med user.uid
      modalMessage: "",  // Tom streng -> Beskeden der vises i modalen
      showModal: false  // Kontrol for at vise eller skjule modalen
    };
  },

  computed: { // computed genberegnes kun, når dens afhængigheder ændrer sig
    // Computed property for Månedskuponer, filtrer alle kuponer ud der ikke har id 4,5,6
    regularCoupons() {
      return this.availableCoupons.filter(coupon => 
        !["coupon_id_4", "coupon_id_5", "coupon_id_6"].includes(coupon.id)
      );
    },

    // Computed property for æg-kuponer, filtrer alle kuponer ud der har id 4,5,6
    eggCoupons() {
      return this.availableCoupons.filter(coupon => 
        ["coupon_id_4", "coupon_id_5", "coupon_id_6"].includes(coupon.id)
      );
    }
  },

  methods: {
    // Metode til at hente kuponer fra Firebase-databasen
    async loadCoupons() { //asynkrone operationer
      try {
        const couponsRef = ref(database, 'coupons'); // Referencen til specifikt sted i databasen hvor kupondataene ligger
        const snapshot = await get(couponsRef); // GET API kald Hent data fra databasen i Firebase, bruger await, som stopper udførelsen af koden, indtil den får data fra Firebase. Snapshot indeholder dataene, der er hentet.
        if (snapshot.exists()) {  // Hvis data findes i Firebase
          const allCoupons = snapshot.val(); // snapshot.val returnerer dataene som et JS objekt, som kaldes for allCoupons og indeholder alle kuponer
          
          // Filtrere kuponer, som brugeren har tilgængelige og gemme dem i 'availableCoupons'
          this.availableCoupons = Object.entries(allCoupons) //Object.entries(allCoupons) konverterer objektet allCoupons til et array af arrays
            .filter(([id]) => this.user.available_coupons[id]) // Tjek om brugeren har kuponen med hjælp af dens id
            .map(([id, coupon]) => ({ id, ...coupon })); // Læg kuponen ind i listen med id
        } else {
          console.error("Ingen kuponer fundet.");  // Hvis kupondata ikke findes
        }
      } catch (error) {
        console.error("Fejl ved indlæsning af kuponer:", error);  // Håndter fejl
      }
    },

    // Metode til at hente brugerdata fra Firebase baseret på den nuværende logget ind bruger
    async loadUserData() {
      try {
        const auth = getAuth();  // Hent autentifikationen fra Firebase
        const user = auth.currentUser;  // Hent den nuværende bruger

        if (user) {  // Hvis brugeren er logget ind
          this.userId = user.uid;  // Gem brugerens ID i this.userId, for at bruge det senere
          const userRef = ref(database, `users/${this.userId}`);  // Referencen til brugerens data
          onValue(userRef, (snapshot) => {  // Lyt efter ændringer i brugerens data, hver gang data ændres på denne reference, vil den udføre den funktion, der er angivet som argument -> snapshot
            if (snapshot.exists()) {  // Hvis der er data for brugeren
              this.user = snapshot.val();  // snapshot.val henter faktiske brugerdataene og gemmer det i this.user
              this.loadCoupons();  // Hent kuponer for den bruger
            } else {
              console.error("Brugerdata ikke fundet.");  // Hvis ingen data findes
            }
          });
        } else {
          console.error("Ingen bruger logget ind.");  // Hvis ingen bruger er logget ind
        }
      } catch (error) {
        console.error("Fejl ved indlæsning af brugerdata:", error);  // Håndter fejl
      }
    },

    // Metode til at indløse en kupon
    async redeemCoupon(couponId, couponPoints) { //funktion med to argumenter
      if (this.user.points >= couponPoints) {  // Hvis brugeren har nok point
        this.user.points -= couponPoints;  // Træk kuponens point fra brugerens total
        this.user.available_coupons[couponId] = false;  // Sæt kuponen som indløst

        // Opdater brugerens data i Firebase
        await update(ref(database, `users/${this.userId}`), { //update svarer til PUT API kald
          points: this.user.points,  // Opdater brugerens points
          available_coupons: this.user.available_coupons  // Opdater de tilgængelige kuponer
        });

        // Vis besked om succes i modal
        this.modalMessage = "Tillykke! Du har indløst din kupon!";
        this.showModal = true;
      } else {
        // Hvis brugeren ikke har nok point
        this.modalMessage = "Ikke nok point til at bruge kupon.";
        this.showModal = true;
      }
    },

    // Metode til at lukke modal popup
    closeModal() {
      this.showModal = false;  // Skjul modal
    }
  },

  // Når komponenten er oprettet, hent brugerdata og kuponer
  async created() {
    await this.loadUserData();
  }
};
</script>
