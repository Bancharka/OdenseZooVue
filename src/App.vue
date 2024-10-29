<script setup>
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
</script>

<template>
  <body>

<header>
    <div id="headercont">
        <div class="headerknap" id="fordeleknap">Fordele</div>
        <div class="headerknap" id="vildevennerknap">Vilde Venner</div>
    </div>
</header>


<section id="pointdisplay">
    <div class="backgroundcard">

        <div>
            <div><img src="/src/assets/img/roedpanda.png" alt="drawing of a red panda"></div>    
        </div>

        <div>
            <div id="pdisbig" class="pdis"> <h1>300</h1></div>
            <div id="pdissmall" class="pdis">Point</div>     
        </div>

    </div>
</section>

<section>
    <h2>Ægge kuponer</h2>
    <div id="" class="kupon">
        <div>
            --billede--
        </div>
        <div>
            <div>40% rabat</div>
            <div>på filterkaffe</div>
            <div>50 point</div>
        </div>
    </div>
    <h2>Månedens tilbud</h2>    


</section>









<footer>
    <div id="footer-box">
        <div class="menu-points">  <img src="/src/assets/img/icon_calendar.png" alt=""> <p>Program</p> </div>
        <div class="menu-points"> <img src="/src/assets/img/icon_anualpass.png" alt=""> <p>Årskort</p> </div>
        <div class="menu-points"> <img src="/src/assets/img/icon_map.png" alt=""> <p>Find vej</p> </div> 
        <div class="menu-points"> <img src="/src/assets/img/icon_anualpass_star.png" alt=""> <p>Vilde venner</p> </div>
    </div>  
</footer>    
</body>
</template>

<style scoped>
</style>
