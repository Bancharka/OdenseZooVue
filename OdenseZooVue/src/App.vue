<script setup>
import { RouterView } from 'vue-router';
</script>

<template>

  <header>
    <nav>
      <router-link to="/goodies">Fordele</router-link> 
      <router-link to="/dashboard"> Vilde Venner </router-link> 

    </nav>
  </header>



  <footer>
    <nav>
      <router-link to=""> Program </router-link> 
      <router-link to=""> Årskort </router-link>  
      <router-link to=""> Find vej </router-link>  
      <router-link to="/dashboard"> Vilde Venner </router-link>  
    </nav>
  </footer>




  <RouterView />
</template>

<style scoped>

</style>
