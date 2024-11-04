<script setup>
import { RouterView } from 'vue-router';
</script>

<template>

  <header>
    <nav id="topnav">
      <router-link id="navfordele" to="/goodies">Fordele</router-link> 
      <router-link id="navvilde" to="/dashboard"> Vilde Venner </router-link> 

    </nav>
  </header>



  <footer>
    <nav id="botnav">
      <router-link class="botnavcards" to=""><div>
        <div>
          Program
        </div>
        <div class="botnavpic">
          <img src="/src/img/icon_anualpass.png" alt="">
        </div>
      </div>  </router-link> 
      <router-link class="botnavcards" to=""> Årskort </router-link>  
      <router-link class="botnavcards" to=""> Find vej </router-link>  
      <router-link class="botnavcards" to="/dashboard"> Vilde Venner </router-link>  
    </nav>
  </footer>




  <RouterView />
</template>

<style scoped>

</style>
