<script setup>
import { ref } from "vue"; 
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "vue-router";
import { app } from '../firebase'; // Adjust the path as necessary

const email = ref("");
const password = ref("");
const router = useRouter();
const register = () => {
    createUserWithEmailAndPassword(getAuth(app), email.value, password.value)
        .then((data) => {
            console.log("Du er nu registreret!");
            router.push('/dashboard');
        })
        .catch((error) => {
            console.log(error.code);
            alert(error.message);
        });
};
</script>

<template>
    <h1>Lav konto</h1>
    <p><input type="text" placeholder="Email" v-model="email"/></p>
    <p><input type="password" placeholder="Password" v-model="password"/></p>
    <p><button @click="register">Registrer</button></p>
</template>
