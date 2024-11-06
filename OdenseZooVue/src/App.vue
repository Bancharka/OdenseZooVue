<script setup>
import { RouterView } from 'vue-router';
</script>

<template>

  <header>
    <nav id="topnav">
      <router-link v-if="$route.name !== 'login' && $route.name !== 'register'" id="navfordele" to="/goodies">Fordele</router-link> 
      <router-link v-if="$route.name !== 'login' && $route.name !== 'register'" id="navvilde" to="/dashboard"> Vilde Venner </router-link> 
    </nav>
  </header>



    <footer>
        <nav id="botnav">
            <router-link v-if="$route.name !== 'login' && $route.name !== 'register'" class="botnavcards" to="">
                <div class="botnavalign">

                <div >
                    <img class="botnavpic" src="/src/img/icon_calendar.png" alt="">
                </div>
                <div class="botnavcolor">
                    Program
                </div>
                
                </div> 
            </router-link> 

            <router-link v-if="$route.name !== 'login' && $route.name !== 'register'" class="botnavcards" to="/aarskort"> 
                <div class="botnavalign">

                    <div >
                        <img class="botnavpic" src="/src/img/icon_anualpass.png" alt="">
                    </div>
                    <div class="botnavcolor" >
                        Årskort
                    </div>

                </div> 
            </router-link> 

            <router-link v-if="$route.name !== 'login' && $route.name !== 'register'" class="botnavcards" to=""> 
                <div class="botnavalign">

                    <div >
                        <img class="botnavpic" src="/src/img/icon_map.png" alt="">
                    </div>
                    <div class="botnavcolor">
                        Find vej
                    </div>

                </div> 
            </router-link> 
        
            <router-link v-if="$route.name !== 'login' && $route.name !== 'register'" class="botnavcards" to="/dashboard">
                <div id="botnavactive"class="botnavalign">

                    <div >
                        <img class="botnavpic" src="/src/img/icon_anualpass_star.png" alt="">
                    </div>
                    <div class="botnavcolor">
                        Vilde venner
                    </div>

                </div>  
            </router-link>  

        </nav>
    </footer>




  <RouterView />
</template>
