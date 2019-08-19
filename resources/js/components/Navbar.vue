<template>
  <nav class="vue-component-navbar navbar navbar-expand-lg navbar-light fixed-top" style="height: 70px;">
    <button
      class="navbar-toggler"
      type="button"
      data-toggle="collapse"
      data-target="#navbarTogglerDemo03"
      aria-controls="navbarTogglerDemo03"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <div class="navbar-toggler-icon"></div>
    </button>
    <router-link to="/collection" class="navbar-brand">
      <img src="/images/kollekt-logo-color-1.svg" />
    </router-link>
    <div class="collapse navbar-collapse justify-content-end" id="navbarTogglerDemo03" style="padding-left: 100px;">

      <template v-if="$route.name == 'catalogue'">
        <router-link to="/collection">
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
        </div>
      </template>
      <form class="form-inline my-2 my-lg-0">
        <!-- <button class="btn my-2 my-sm-0 mx-1 csv" type="submit">Export as CSV</button>
        <button class="btn my-2 my-sm-0 mx-1 feedback" type="submit">Close Feedback</button>
        <button class="btn my-2 my-sm-0 mx-1 next" type="submit">Go to next stage</button> -->
      </form>
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
$breadcrumb-divider: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPjxwYXRoIGQ9Ik0yLjUgMEwxIDEuNSAzLjUgNCAxIDYuNSAyLjUgOGw0LTQtNC00eiIgZmlsbD0iY3VycmVudENvbG9yIi8+PC9zdmc+);

.vue-component-navbar {
  z-index: 99;
}
.navbar {
  background-color: white;

  .breadcrumb-item + .breadcrumb-item::before {
    content: $breadcrumb-divider;
  }
}

p {
  display: inline-block;
}

.breadcrumb {
  background-color: white;
}

.vl {
  border-left: 3px solid #dfdfdf;
}

.csv {
  background-color: #f3f3f3;
}

.feedback {
  background-color: #ff6565;
  color: white;
}

.next {
  background-color: #3b86ff;
  color: white;
}

.backwards-button {
  display: inline-block;
  background-color: #3b86ff;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  line-height: 37px;
  vertical-align: middle;
}
</style>
