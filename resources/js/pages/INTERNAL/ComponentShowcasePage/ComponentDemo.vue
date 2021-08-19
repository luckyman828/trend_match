<template>
    <div class="component-demo">
        <h3 class="name">{{ name }}</h3>
        <section class="examples-section theme-border" :class="darkMode ? 'bg-theme-dark' : 'bg-theme-white'">
            <div class="header"><strong>Examples</strong></div>
            <slot name="examples" />
            <BaseSegmentedControl
                class="dark-mode-toggle"
                activeClass="white"
                sizeClass="sm"
                countKey="count"
                theme="light"
                v-model="darkMode"
                :options="[
                    {
                        label: 'Dark',
                        value: true,
                    },
                    {
                        label: 'Light',
                        value: false,
                    },
                ]"
            />
        </section>
        <section class="props-section">
            <h4>
                <span>Props</span>
                <BaseSegmentedControl
                    class="dark-mode-toggle"
                    activeClass="white"
                    sizeClass="sm"
                    countKey="count"
                    theme="light"
                    v-model="showProps"
                    :options="[
                        {
                            label: 'Show props',
                            value: true,
                        },
                        {
                            label: 'Hide props',
                            value: false,
                        },
                    ]"
                />
            </h4>

            <template v-if="showProps">
                <slot name="props" />
                <div class="prop" v-for="prop in demoProps" :key="prop.name">
                    <div class="name">{{ prop.displayName ? prop.displayName : prop.name }}</div>
                    <BaseInputField v-if="prop.inputType == 'text'" @input="$emit(`update:${prop.name}`, $event)" />
                    <BaseCheckbox v-if="prop.inputType == 'boolean'" @change="$emit(`update:${prop.name}`, $event)" />
                    <div class="values-list">
                        <div class="value" v-for="value in prop.availableValues" :key="value.name">
                            <p>
                                <small
                                    ><strong>{{ value.name }}</strong
                                    >: {{ value.values.join(' | ') }}</small
                                >
                            </p>
                        </div>
                    </div>
                </div>
            </template>
        </section>
    </div>
</template>

<script>
export default {
    name: 'componentDemo',
    props: ['name', 'demoProps'],
    data() {
        return {
            darkMode: false,
            showProps: false,
        }
    },
}
</script>

<style scoped lang="scss">
.component-demo {
    margin-bottom: 28px;
    padding-bottom: 20px;
    border-bottom: $borderModule;
}
section {
    margin-bottom: 20px;
}
.input-field {
    max-width: 200px;
}
.prop {
    margin-bottom: 20px;
    .name {
        font-weight: 900;
    }
}
.examples-section {
    padding: 8px;
    border-radius: 8px;
    position: relative;
    > .header {
        margin-bottom: 12px;
    }
    &.bg-theme-dark strong {
        color: white;
    }
    .dark-mode-toggle {
        position: absolute;
        right: 8px;
        top: 8px;
    }
}
</style>
