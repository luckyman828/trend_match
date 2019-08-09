<template>
    <div class="vue-component-filters filter-row">

        <div class="grid-2">
          
            <div class="category-filter-wrapper">
              <div class="dropdown category-button">
                  <div v-if="selectedCategoriesCount > 0" class="counter-filter text-center">{{ selectedCategoriesCount }}</div>
                  <button class="btn btn-secondary dropdown-toggle category d-flex justify-content-between" type="button" id="dropdownMenuButton"
                  data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  Category <img src="/assets/Path26.svg" alt />
                  </button>

                  <div class="dropdown-menu pt-0" aria-labelledby="dropdownMenuButton">
                  <input type="text" name="Filter" placeholder="Filter by category" />
                  <label v-for="(category, index) in categories" :key="index" class="container" :for="'check-filter-' + index">
                      <input type="checkbox" :id="'check-filter-' + index" @change="onSelectCategory(category.id)" />
                      <span class="checkmark"></span>
                      <p class="px-2">{{category.title}} <span class="count">({{(category.products != null) ? category.products.length : '0'}})</span></p>
                  </label>
                  </div>
              </div>

              <span v-if="selectedCategoriesCount > 0" class="clear-filter" @click="clearFilter">Clear filter</span>
            </div>

            <div class="dropdown">
                <button class="btn btn-secondary dropdown-toggle global d-flex justify-content-between" type="button" id="dropdownMenuButton" 
                data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <span><img src="/assets/Path5699.svg" alt /></span> Global <img src="/assets/Path26.svg" alt />
                </button>

                <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                <a class="dropdown-item" href="#">Action</a>
                <a class="dropdown-item" href="#">Another action</a>
                <a class="dropdown-item" href="#">Something else here</a>
                </div>
            </div>

        </div>

    </div>
</template>

<script>
export default {
    name: 'filters',
    props: [
        'categories',
        'selectedCategoriesCount'
    ],
    data: function() { return {
        selectedCategories: []
    }},
    computed: {

    },
    methods: {
        onSelectCategory(id) {
            this.$emit('onSelectCategory', id)
        },
        clearFilter() {
          this.$emit('onClearFilter')
          this.resetSelected()
        },
        resetSelected() {
            document.querySelectorAll('input[type=checkbox]').forEach(input => {
                input.checked = false
            })
        },
    },
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';
.vue-component-filters {
    margin-bottom: 12px;
}
.category-button {
  display: inline-block;
  .dropdown-menu {
    min-width: 220px;
  }
}
.clear-filter {
  display: inline-block;
  margin-left: 20px;
  font-size: 14px;
  font-weight: 500;
  color: $primary;
  cursor: pointer;
  &:hover {
    opacity: .9;
  }
}
.global {
    height: 32px;
    width: 150px;
    color: #1b1c1d;
    background-color: #ffffff;
    border: 1px solid #dfdfdf;
    font-size: 14px;
    font-weight: bold;
    margin-left: auto;
    img {
      margin-top: 6px;
    }
    span {
      margin-left: -8px;
      margin-top: -3px;
      background-color: #3b86ff;
      width: 24px;
      height: 24px;
      border-radius: 25%;
      img {
        margin-top: 0px;
      }
    }
  }
    .counter-filter {
    position: absolute;
    height: 20px;
    width: 20px;
    border-radius: 50%;
    background-color: #f3f3f3;
    z-index: 500;
    box-shadow: 0px 3px 6px #a8a8a8;
    margin-left: -10px;
    margin-top: -10px;
    line-height: 14px;
  }

  .category {
    background-color: #dfdfdf;
    color: #1b1c1d;
    font-size: 12px;
    font-weight: bold;
    border: 0;
    height: 32px;
    width: 114px;

    img {
      margin-top: 6px;
    }
  }

    .dropdown-toggle::after {
    display: none;
  }

  .dropdown-menu:hover {
    display: block;
  }

  .dropdown-menu {
    overflow-y: auto;
    max-height: 285px;
    box-shadow: 0 2px 10px rgba(0,0,0,.05);

    input[type="text"] {
      border: 0px;
      border-bottom: 1px solid #a8a8a8;
      color: #a8a8a8;
      padding: 5px 0;
      width: 100%;
    }
    input[type="text"]::-webkit-input-placeholder {
      color: #a8a8a8;
      text-align: center;
    }

    p {
      display: inline;
      font-size: 12px;
      color: #1b1c1d;
    }

    .container {
      display: block;
      position: relative;
      cursor: pointer;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
      margin-bottom: 0;
      padding-top: 5px;
      padding-bottom: 5px;
      &:hover {
          background: $light;
      }
    }

    .container input {
      position: absolute;
      opacity: 0;
      cursor: pointer;
      height: 0;
      width: 0;
    }

    .checkmark {
      content: "";
      display: inline-block;
      vertical-align: text-top;
      width: 24px;
      height: 24px;
      background: white;
      border: 1px solid #dfdfdf;
    }

    .container input:checked ~ .checkmark {
      background: linear-gradient(#3b86ff, #3b86ff) no-repeat;
      background-position: center;
      background-size: 16px 16px;
    }

    .checkmark:after {
      content: "";
      position: absolute;
      display: none;
    }

    .container input:checked ~ .checkmark:after {
      display: block;
    }
  }
</style>
