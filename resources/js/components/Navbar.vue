<template>
  <nav class="vue-component-navbar navbar navbar-expand-lg navbar-light fixed-top">
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
    <a class="navbar-brand" href="#">
      <img src="/assets/44report-logo_color.svg" />
    </a>
    <div class="collapse navbar-collapse justify-content-end" id="navbarTogglerDemo03">
      <button class="btn my-2 my-sm-0 align-middle" type="submit">
        <div class="align-middle backwards-button">
            <img src="/assets/backwards-arrow.svg"/>
        </div>
        <p class="mb-0 ml-2 align-middle">Back to Catalogue</p>
      </button>

      <div class="mr-auto vl">
        <nav aria-label="breadcrumb align-middle">
          <ol class="breadcrumb mb-0">
            <li class="breadcrumb-item">
              <a href="#">Brand</a>
            </li>
            <li class="breadcrumb-item">
              <a href="#">Catalogue</a>
            </li>
            <li class="breadcrumb-item active" aria-current="page">2020_SPRING</li>
          </ol>
        </nav>
      </div>
      <form class="form-inline my-2 my-lg-0">
        <button class="btn my-2 my-sm-0 mx-1 csv" type="submit">Export as CSV</button>
        <button class="btn my-2 my-sm-0 mx-1 feedback" type="submit">Close Feedback</button>
        <button class="btn my-2 my-sm-0 mx-1 next" type="submit">Go to next stage</button>
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
