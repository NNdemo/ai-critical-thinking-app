<template>
  <div class="app-container">
    <header>
      <h1>AI Critical Thinking Tool</h1>
    </header>
    <MindMap />
  </div>
</template>

<script>
import MindMap from './components/MindMap.vue'

export default {
  name: 'App',
  components: {
    MindMap
  }
}
</script>

<style>
.app-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

header {
  background-color: #4a5568;
  color: white;
  padding: 1rem;
  text-align: center;
}

h1 {
  margin: 0;
  font-size: 1.5rem;
}
</style>
