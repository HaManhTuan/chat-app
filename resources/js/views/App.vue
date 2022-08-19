<template>
  <div id="app">
    <el-scrollbar :vertical="false" class="app-scrollbar">
      <router-view />
    </el-scrollbar>
  </div>
</template>

<script>
export default {
  name: 'App',
};
</script>
