
<template>

<div id="app">
  <ul>
    <li v-for="user in users" :key="user.uid">
      {{ user.name }}: {{ user.points }} points
    </li>
  </ul>
</div>
  </template>
  
  <script>
    import { database } from '../firebase.js';
    import { ref, onValue } from 'firebase/database';

<template>
  <div id="app">
    <ul>
      <li v-for="user in users" :key="user.uid">
        {{ user.name }}: {{ user.points }} points
      </li>
    </ul>
  </div>
</template>

<script>
import { database } from './firebase.js';

export default {
  data() {
    return {
      users: [] // Initialize as an empty array
    };
  },
  created() {
    this.fetchUsers();
  },
  methods: {
    async fetchUsers() {
      try {
        const usersRef = database.ref('users');
        usersRef.on('value', snapshot => {
          const data = snapshot.val();
          const usersArray = Object.keys(data).map(key => ({
            uid: key,
            ...data[key]
          }));
          this.users = usersArray;
        });
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    }
  }
};
</script>

</script>