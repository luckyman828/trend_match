<template>
    <div class="select-dropdown dropdown-menu">
        <div class="header">
            <span>Select matching:</span>
        </div>
        <p class="dropdown-item" @click="onSelect('no_in')"> No <strong>"IN"</strong> </p>
        <p class="dropdown-item" @click="onSelect('no_comment_no_out')">No <strong>"COMMENT"</strong> & no <strong>"OUT"</strong></p>
    </div>
</template>

<script>
export default {
    name: 'selectDropdown',
    methods: {
        onSelect(condition) {
          this.$emit('onSelectByCondition', condition)
        },
        clickOutsideEvent(event) {
            const thisElement = document.querySelector('.select-dropdown')
            // Check if the clicked element is outside component
            if (!(thisElement == event.target || thisElement.contains(event.target))) {
                if ( !event.target.classList.contains('dropdown-parent') )
                    this.close()
            }
        },
        close() {
            const thisElement = document.querySelector('.select-dropdown')
            thisElement.classList.remove('show')
        }
    },
    created() {
        // Listen for clicks outside component
        document.body.addEventListener('click', this.clickOutsideEvent)
    },
    destroyed() {
        // Remove click listener
        document.body.removeEventListener('click', this.clickOutsideEvent)
    }
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';

    .header {
        padding: 8px 12px;
        text-align: center;
        border-bottom: solid 1px $light2;
        span {
            text-transform: none;
            font-size: 14px;
            font-weight: 400;
            color: $dark2;
        }
    }
    .dropdown-menu {
        min-width: 210px;
        padding-top: 0;
        &.show {
            display: block;
        }
        p.dropdown-item {
            display: block;
            margin: 0;
            padding: 12px 16px;
            cursor: pointer;
            &:active {
                background: inherit;
            }
        }
        .current-item {
            background: $light;
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
    }

</style>