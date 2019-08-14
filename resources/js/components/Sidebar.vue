<template>
  <div class="vue-component-sidebar sidebar">
    <div class="top-items">
      <router-link to="/collection" class="link"><i class="fas fa-signal-alt-3"></i> Collection</router-link>
      <!-- <router-link to="/catalogue">Catalogue</router-link> -->
      <!-- <router-link class="stick-to-bottom" to="/teams"><i class="fas fa-users"></i> Teams</router-link> -->
      <router-link to="/teams" class="link"><i class="fas fa-users"></i> Teams</router-link>
    </div>
    <div class="bottom-items">
      <signout-button class="link"/>
    </div>
  </div>
</template>

<script>
import SignoutButton from './SignoutButton'

export default {
  name: "sidebar",
  components: {
    SignoutButton
  }
};
</script>

<style lang="scss" scoped>
@import '~@/_variables.scss';
.sidebar {
  margin: 0;
  padding: 0;
  width: $sidebarWidth;
  height: calc(100% - 70px);
  background-color: white;
  position: fixed;
  overflow: auto;
  left: 0;
  top: $navbarHeight;
  display: flex;
  flex-direction: column;
  z-index: 99;
  justify-content: space-between;

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
  .link {
    display: block;
    color: #a8a8a8;
    padding: 16px;
    text-decoration: none;
    border-left: solid 5px white;
    cursor: pointer;
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
      &:not(.router-link-active) {
        border-color: $light1;
      }
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