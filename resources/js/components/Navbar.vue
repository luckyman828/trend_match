<template>
  <nav class="navbar" style="height: 70px;">
    <router-link to="/collection" class="navbar-brand">
      <img src="/images/kollekt-logo-color-1.svg" />
    </router-link>
    <div class="collapse navbar-collapse justify-content-end" id="navbarTogglerDemo03" style="padding-left: 100px;">

      <template v-if="$route.name == 'catalogue'">
        <!-- <router-link to="/collection">
        <button class="btn my-2 my-sm-0 align-middle" type="submit">
          <div class="align-middle backwards-button">
              <img style="margin-right: 3px" src="/assets/backwards-arrow.svg"/>
          </div>
          <p class="mb-0 ml-2 align-middle">Back to Collection</p>
        </button>
        </router-link>

        <div class="mr-auto vl">
          <nav aria-label="breadcrumb align-middle">
              <ol class="breadcrumb mb-0">
                <li class="breadcrumb-item">
                  <router-link to="/collection">Collection</router-link>
                </li>
                <li class="breadcrumb-item active" aria-current="page" v-if="$route.params.catalogueTitle != null">{{$route.params.catalogueTitle}}</li>
                <li class="breadcrumb-item active" aria-current="page" v-else>Current catalogue</li>
              </ol>
          </nav>
        </div> -->
      </template>
    </div>
  </nav>
</template>

<script>
export default {
  name: "navbar",
  data() {
    return {};
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import '~@/_variables.scss';

.navbar {
  background-color: white;
  z-index: 99;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  align-items: center;
  padding: 8px 16px;
  display: flex;
  img {
    display: block;
    height: 100%;
  }
}

</style>
