<script setup>
import { ref, onMounted } from 'vue';

const points = ref([]); // Hold data fra Firebase

// Funktion til at hente data fra Firebase
const getPoints = async () => {
  const requestOptions = {
    method: "GET",
    redirect: "follow"
  };

  try {
    const response = await fetch("https://odensezooapp-default-rtdb.europe-west1.firebasedatabase.app/users.json", requestOptions);
    const result = await response.json();
    const objectKeys = Object.keys(result);

    // Tilføj brugerne til points
    for (const key of objectKeys) {
      points.value.push(result[key]);
    }
  } catch (error) {
    console.error(error); // Vis fejl i konsollen
  }
};

// Kalder getPoints når komponenten er oprettet
onMounted(getPoints);
</script>

<template>
  <div>
    <h1>Points</h1>
    <ul>
      <li v-for="(user, index) in points" :key="index">
        <h2>{{ user.name }}</h2>
      </li>
    </ul>
  </div>
</template>