<template>
  <div class="vue-component-sidebar sidebar">
    <router-link to="/collection">Collection</router-link>
    <router-link to="/catalogue">Catalogue</router-link>
  </div>
</template>

<script>
export default {
  name: "sidebar",
  data() { return {
  
  }},
  methods: {
  }
};
</script>

<style lang="scss" scoped>
@import '~@/_variables.scss';
.sidebar {
  margin: 0;
  padding: 0;
  width: $sidebarWidth;
  height: 100%;
  background-color: white;
  position: fixed;
  overflow: auto;
  left: 0;
  top: $navbarHeight;

  @media screen and (max-width: 700px) {
    width: 100%;
    height: auto;
    position: relative;
  }

  @media screen and (max-width: 400px) {
    text-align: center;
    float: none;
  }

  a {
    display: block;
    color: #a8a8a8;
    padding: 16px;
    text-decoration: none;;

    @media screen and (max-width: 700px) {
      float: left;
    }
  }

  a.router-link-active {
    background-color: #f9f9f9;
    color: #1b1c1d;
    border-left: 5px solid #4facfe;
  }
}
</style>