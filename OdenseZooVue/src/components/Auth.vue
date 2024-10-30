<!-- src/components/Login.vue -->
<template>
    <div class="login">
      <h2>Log ind</h2>
      <input v-model="email" type="email" placeholder="Email" />
      <input v-model="password" type="password" placeholder="Adgangskode" />
      <button @click="login">Log ind</button>
      <button @click="register">Opret bruger</button>
      <p>{{ errorMessage }}</p>
    </div>
  </template>
  
  <script>
  import '../firebase.js';
  
  export default {
    name: 'Login',
    data() {
      return {
        email: '',
        password: '',
        errorMessage: ''
      };
    },
    methods: {
      async login() {
        try {
          await auth.signInWithEmailAndPassword(this.email, this.password);
          this.$router.push('/dashboard'); // Omdiriger ved succesfuld login
        } catch (error) {
          this.errorMessage = error.message;
        }
      },
      async register() {
        try {
          await auth.createUserWithEmailAndPassword(this.email, this.password);
          this.$router.push('/dashboard');
        } catch (error) {
          this.errorMessage = error.message;
        }
      }
    }
  };
  </script>
  
  <style scoped>
 
  </style>