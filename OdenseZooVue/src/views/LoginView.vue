<script setup>
// Bruges til at lave reaktive data, bliver brugt til email og password
import { ref } from "vue"; 
// Her importeres getauth og signin fra firebase for at kunne bruge disse funktioner i koden
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
// Jeg importerer userouter for at kunne pushe brugeren til dashboard når de er logget ind 
import { useRouter } from "vue-router";
import { app } from '../firebase';

// Her oprettes der reaktiver variabler, email og password. Jeg tror i praksis at det betyder at den hele tiden "lytter" på ændringer i email og password.
const email = ref("");
const password = ref("");
const router = useRouter();
const register = () => {
    signInWithEmailAndPassword(getAuth(app), email.value, password.value)
        .then((data) => {  /* Hvis login info er korrekt, så consol logger jeg nedestående og bliver så redirected til dashboard  */
            console.log("Du er nu logget ind!");
            router.push('/dashboard');
        })
        .catch((error) => {  /* Ellers consol logger den en error kode, samt alerter den error kode   */
            console.log(error.code);
            alert(error.message);
        });
};
</script>

<template>
    <div class="loginpage">
        
        <div class="loginsection">
            <h1>Log ind</h1>
            <p><input class="logininput" type="text" placeholder="Email" v-model="email"/></p>
            <p><input class="logininput" type="password" placeholder="Password" v-model="password"/></p>
            <p><button class="loginbutton" @click="register">Log ind</button></p>
            <!-- Et link til registrerings siden -->
            <router-link id="registerbutton" class ="loginbutton" to="/register"> <p>Opret bruger</p> </router-link>
        </div>
    </div>
</template>


