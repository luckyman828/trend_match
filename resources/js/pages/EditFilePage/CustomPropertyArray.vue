<template>
    <div class="custom-property-array-list flex-list flex-v">
        <div class="array-item flex-list" v-for="(value, index) in valueProperty" :key="index">
            <BaseEditInputWrapper
                class="input-field"
                :type="'text'"
                :value="valueProperty[index]"
                :oldValue="valueProperty[index]"
                v-model="valueProperty[index]"
                ref="input"
                :submitOnBlur="true"
                @submit="$emit('submit')"
            />
            <button class="ghost" @click="valueProperty.splice(index, 1)">
                <i class="far fa-trash"></i>
            </button>
        </div>
        <button class="ghost full-width" @click="onAddProperty">
            <i class="far fa-plus"></i><span>Add value</span>
        </button>
    </div>
</template>

<script>
export default {
    name: 'customPropertyArray',
    props: ['property', 'extraData'],
    computed: {
        valueProperty() {
            return this.extraData[this.property.name]
        },
    },
    methods: {
        onAddProperty() {
            this.valueProperty.push('New value')
            this.$nextTick(() => {
                const newInput = this.$refs.input[this.valueProperty.length - 1]
                newInput.setActive()
            })
        },
    },
    created() {
        if (!this.valueProperty) this.$set(this.extraData, this.property.name, [])
    },
}
</script>

<style scoped lang="scss">
.input-field {
    flex: 1;
}
</style>
