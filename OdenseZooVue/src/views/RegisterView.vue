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
    <div class="loginpage">
        <div class= "loginsection">
            <h1>Opret bruger</h1>
            <p><input class="logininput" type="text" placeholder="Email" v-model="email"/></p>
            <p><input class="logininput" type="password" placeholder="Password" v-model="password"/></p>
            <p><button class="loginbutton" @click="register">Opret bruger</button></p>
            <router-link id="registerbutton" class ="loginbutton" to="/"> <p>Login</p> </router-link>
        </div>
    </div>
</template>
