<template>
    <div class="dropdown-wrapper" v-if="options != null">

        <slot name="button" :toggle="toggle" :clear="clear"></slot>

        <div class="dropdown checkbox-dropdown" :class="{collapsed: collapsed}" ref="dropdown">
            <div class="header">
                <span>{{title}}</span>
            </div>
            <div class="body">
                <div class="checkbox-buttons">
                    <label v-for="(option, index) in options" :key="index" :class="{active: selected.find(x => x == option.id)}" class="checkbox">
                        <input type="checkbox" :value="option.id" v-model="selected" @change="submit(option.id)">
                        <span class="checkmark"></span>
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
        },
        toggle() {
            this.collapsed = !this.collapsed
        }
    },
    updated() {
        // Set the height of the component
        const offset = 0
        const el = this.$refs.dropdown
        const parent = el.closest('.dropdown-parent')
        if (parent != null)
            el.style.cssText = `top: ${parent.getBoundingClientRect().height + offset}px; max-height: ${el.scrollHeight}px;`
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