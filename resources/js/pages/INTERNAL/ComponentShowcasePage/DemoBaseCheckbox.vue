<template>
    <ComponentDemo name="BaseCheckbox">
        <template v-slot:examples>
            <BaseCheckbox />
        </template>
    </ComponentDemo>
</template>

<script>
import ComponentDemo from './ComponentDemo.vue'

export default {
    name: 'demoBaseCheckbox',
    components: { ComponentDemo },
    data() {
        return {
            demoProps: [],
        }
    },
}
</script>
