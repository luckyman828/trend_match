<template>
  <div class="vue-component-sidebar sidebar">
    <router-link to="/collection"><i class="fas fa-signal-alt-3"></i> Collection</router-link>
    <!-- <router-link to="/catalogue">Catalogue</router-link> -->
    <!-- <router-link class="stick-to-bottom" to="/teams"><i class="fas fa-users"></i> Teams</router-link> -->
    <router-link to="/teams"><i class="fas fa-users"></i> Teams</router-link>
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
  display: flex;
  flex-direction: column;
  z-index: 99;

  @media screen and (max-width: 700px) {
    width: 100%;
    height: auto;
    position: relative;
  }

  @media screen and (max-width: 400px) {
    text-align: center;
    float: none;
  }
  .stick-to-bottom {
    position: absolute;
    left: 0;
    width: 100%;
    bottom: 120px;
  }
  a {
    display: block;
    color: #a8a8a8;
    padding: 16px;
    text-decoration: none;
    border-left: solid 5px white;
    &.router-link-active {
      background-color: #f9f9f9;
      color: #1b1c1d;
      border-left: 5px solid #4facfe;
      i {
        color: $primary;
      }
    }
    &:hover {
      background: $light1;
    }
    i {
      margin-right: 8px;
    }

    @media screen and (max-width: 700px) {
      float: left;
    }
  }
}
</style>