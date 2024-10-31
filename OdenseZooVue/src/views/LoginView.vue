
<script setup>
import { getAuth, signInWithEmailAndPassword } from "firebase/auth" ;
import { ref } from "vue";
import { useRouter } from "vue-router";
const email = ref("");
const password = ref("");
const errMsg = ref();
const router = useRouter();
const register = () => {
    signInWithEmailAndPassword(getAuth(), email.value, password.value)
        .then((data) => {
            console.log("Du er nu logget ind!");
            router.push('/dashboard')
        })
        .catch((error)=> {
            console.log(error.code);
            switch (error.code) {
                case "auth/invalid-email":
                    errMsg.value = "Invalid Email"
                    break;
                case "auth/user-not-found":
                    errMsg.value = "No account with that email found";
                    break;
                case "auth/wrong-password":
                    errMsg.value = "Incorrect password";
                    break;
                default:
                    errMsg.value = "Email or password was incorrect";
                    break;
                
            }
            alert(error.message);
        });
};



</script>

<template>
<h1>Log ind</h1>
<p><input type="text" placeholder="Email" v-model="email" /></p>
<p><input type="password" placeholder="Password" v-model="password" /></p>
<p v-if="errMsg">{{ errMsg }} </p>
<p><button @click="register">Submit</button></p>
    
</template>
