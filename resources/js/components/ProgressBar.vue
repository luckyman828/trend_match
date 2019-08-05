<template>
  <div class="vue-component-progress-bar bar mx-1 pb-3">
    <div class="row">
      <div class="col-5 pt-3">
        <h2>{{catalogue.title}}</h2>
        <span class="px-2">STAGE {{catalogue.phase}}</span>
      </div>
      <div class="col-1 px-1">
        <p class="mb-2">Start date</p>
        <span>{{startDate}}</span>
      </div>
      <div class="col-1 px-1">
        <p class="mb-2">Deadline</p>
        <span>{{endDate}}</span>
      </div>

      <div class="col-5 p-0">
        <p class="mb-1">Progress</p>
        <div class="d-flex align-items-center col-12 p-0">
          <div class="progress bar-wrapper w-100">
            <div
              class="progress-bar skill-bar"
              role="progressbar"
              :style="'width: ' + productTotals.progress + '%;'"
              :aria-valuenow="productTotals.progress"
              aria-valuemin="0"
              aria-valuemax="100"
            ></div>
          </div>
          <span class="p-1 percentage">{{productTotals.progress}}%</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "progressBar",
  props: [
      'loading',
      'catalogue',
      'productTotals'
  ],
  data() {
    return {

    }
  },
  computed: {
      startDate () {
          const date = this.catalogue.start_time
          const dateEnd = date.indexOf(" ")
          const newDate = date.substr(0, dateEnd)
          return newDate.replace('-', '/')
      },
      endDate () {
          const date = this.catalogue.end_time
          const dateEnd = date.indexOf(" ")
          const newDate = date.substr(0, dateEnd)
          return newDate.replace('-', '/')
      },
  },
  methods: {
    hideBar() {
      this.hidden = !this.hidden;
    }
  }
};
</script>

<style lang="scss" scoped>
.vue-component-progress-bar {
    margin-bottom: 20px;
}
.bar {
  border-bottom: 2px solid #dfdfdf;
  background-color: #F9F9F9;
  width: 95%;

  h2 {
    display: inline;
  }

  p {
    font-size: 12px;
  }

  span {
    background-color: #f3f3f3;
    padding: 2px;
    color: #1b1c1d;
    font-weight: bold;
    font-size: 12px;
  }

  .progress {
    height: 4px;

    .progress-bar {
      background-color: #b5cc18;
    }
  }

  .percentage {
    background-color: #F9F9F9;
    font-size: 14px;
  }
}
</style>
