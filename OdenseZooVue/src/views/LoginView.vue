<script setup>
import { ref } from "vue"; 
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "vue-router";
import { app } from '../firebase'; // Adjust the path as necessary

const email = ref("");
const password = ref("");
const router = useRouter();
const register = () => {
    signInWithEmailAndPassword(getAuth(app), email.value, password.value)
        .then((data) => {
            console.log("Du er nu logget ind!");
            router.push('/dashboard');
        })
        .catch((error) => {
            console.log(error.code);
            alert(error.message);
        });
};
</script>

<template>
    <h1>Log ind</h1>
    <p><input type="text" placeholder="Email" v-model="email"/></p>
    <p><input type="password" placeholder="Password" v-model="password"/></p>
    <p><button @click="register">Log ind</button></p>
</template>
