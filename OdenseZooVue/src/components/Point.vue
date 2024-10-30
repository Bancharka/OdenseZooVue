<script setup>
import {ref} from 'vue';

const points = ref([]);

const getPoints = () => {
  const requestOptions = {
  method: "GET",
  redirect: "follow"
};

  fetch("https://odensezooapp-default-rtdb.europe-west1.firebasedatabase.app/users.json", requestOptions)
    .then((response) => {
      return response.json()
    })
    .then((result) => {
      const objectKeys = Object.keys(result);

      for (const key in objectKeys) {
        points.value.push(result[objectKeys[key]]);
      }
    })
    .catch((error) => {
      console.error(error)
    });
};

getPoints ();
</script>

<template>
  <div>
    <h1>Points</h1>
    <ul>
      <li v-for="user in users">
        <h2>{{ user.name }}</h2>
      </li>
    </ul>
  </div>
</template>