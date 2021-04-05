<template>
  <div>
    <Navbar />
    <div class="container-fluid">
      <div class="row">
        <Sidebar />
        <Main />
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from '@/components/Navbar.vue'
import Sidebar from '@/components/Sidebar.vue'
import Main from '@/components/Main.vue'
export default {
  components: {
    Navbar,
    Sidebar,
    Main,
  },
  data() {
    return {
      title: 'Todo List Vue',
    }
  },
}
</script>

<style>
.container-fluid {
  margin: 0 auto;
  width: 100vw;
  height: 94vh;
  display: flex;
  justify-content: flex-start;
}
</style>
