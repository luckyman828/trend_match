<template>
    <div class="dropdown-wrapper" v-if="options != null">

        <template v-if="theConfig.button == 'button'">
        <div class="dropdown-button" @click="collapsed = !collapsed">
              <span>{{buttonText}}</span>
              <i class="far fa-chevron-down"></i>
              <span v-if="selected.length > 0" class="bubble">
                  {{selected.length}}
              </span>
        </div>
        <span v-if="selected.length > 0" class="clear button invisible primary" @click="clear">Clear filter</span>
        </template>

        <template v-else>
            <span @click="collapsed = !collapsed">{{buttonText}} <i class="fas fa-chevron-down"></i></span>
        </template>

        <div class="dropdown checkbox-dropdown" :class="{collapsed: collapsed}" ref="dropdown">
            <div class="header">
                <span>{{title}}</span>
            </div>
            <div class="body">
                <div class="checkbox-buttons">
                    <label v-for="(option, index) in options" :key="index" :class="{active: selected.find(x => x == option.id)}">
                        <input type="checkbox" :value="option.id" v-model="selected" @change="submit(option.id)">
                        <span class="check-mark"></span>
                        {{option.title}}
                    </label>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
export default {
    name: 'dropdownCheckbox',
    props: [
        'title',
        'options',
        'buttonText',
        'config'
    ],
    data: function () { return {
        selected: [],
        collapsed: true,
    }},
    computed: {
        theConfig () {
            let config = {
                button: 'plain'
            }
            if (this.config != null) {
                config = this.config
            }
            return config
        }
    },
    methods: {
        submit(value) {
            this.$emit('input', this.selected)
            this.$emit('submit', value)
        },
        close() {
            this.collapsed = true;
        },
        clear () {
            this.selected = []
            document.querySelectorAll('input[type=checkbox]').forEach(input => {
                input.checked = false
            })
        }
    },
    updated() {
        // Set the height of the component
        const offset = 10
        const el = this.$refs.dropdown
        const parent = el.closest('.dropdown-parent')
        console.log(parent);
        if (parent != null)
            el.style.cssText = `top: ${parent.getBoundingClientRect().height + 10}px; max-height: ${el.scrollHeight}px;`
        else el.style.cssText = `max-height: ${el.scrollHeight}px;`
    },
    destroyed() {
    }
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';

    .header {
        text-align: center;
    }
    .bubble {
        position: absolute;
        left: -10px;
        top: -10px;
        width: 20px;
        height: 20px;
        line-height: 20px;
        background: $light1;
        box-shadow: 0 3px 6px rgba(black, 10%);
        text-align: center;
        border-radius: 10px;
    }

</style>