<template>
  <transition name="fade">
    <div v-show="visible" class="bmg-tooltip" :class="customClass">
      <div v-html="text"></div>
      <div class="bmg-tooltip-arrow" x-arrow></div>
    </div>
  </transition>
</template>

<script>
export default {
  data() {
    return {
      text: null,
      visible: false,
      customStyle: ""
    };
  },

  computed: {
    customClass() {
      return this.customStyle && `bmg-tooltip-${this.customStyle}`;
    }
  }
};
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';

    .fade-enter-active,
    .fade-leave-active {
        transition: opacity 0.3s;
    }
    .fade-enter,
    .fade-leave-to {
        opacity: 0;
    }

    .bmg-tooltip {

    max-width: 200px;

    padding: 8px 12px;
    border-radius: 4px;
    border: 1px solid $dark;
    font-size: 12px;

    background-color: $darkAlt;
    color: white;
    box-shadow: 0 10px 10px -5px rgba($dark, 10%);
    z-index: 99999999;

    &-arrow {
        position: absolute;
        content: "";
        width: 0;
        height: 0;
        border: 5px solid transparent;

        &::after {
        content: "";
        display: block;
        position: absolute;
        border: 5px solid transparent;
        }
    }

    &[x-placement^="top"] {
        margin-bottom: 5px;

        .bmg-tooltip-arrow {
        border-bottom-width: 0;
        border-top-color: $dark;
        bottom: -5px;
        left: 0;

        &::after {
            border-bottom-width: 0;
            border-top-color: $darkAlt;
            bottom: 1px;
            left: -5px;
        }
        }
    }

    &[x-placement^="bottom"] {
        margin-top: 5px;

        .bmg-tooltip-arrow {
        border-top-width: 0;
        border-bottom-color: $dark;
        top: -5px;
        // left: 50%;
        // 实战bug3： x-arrow自动会计算
        // transform: translateX(-50%);
        left: 0;

        &::after {
            border-top-width: 0;
            border-bottom-color: $darkAlt;
            top: 1px;
            left: -5px;
        }
        }
    }

    &[x-placement^="right"] {
        margin-left: 5px;

        .bmg-tooltip-arrow {
        border-left-width: 0;
        border-right-color: $dark;
        top: 0;
        left: -5px;

        &::after {
            border-left-width: 0;
            border-right-color: $darkAlt;
            top: -5px;
            left: 1px;
        }
        }
    }

    &[x-placement^="left"] {
        margin-right: 5px;

        .bmg-tooltip-arrow {
        border-right-width: 0;
        border-left-color: $dark;
        top: 0;
        right: -5px;

        &::after {
            border-right-width: 0;
            border-left-color: $darkAlt;
            top: -5px;
            right: 1px;
        }
        }
    }
    }
</style>
