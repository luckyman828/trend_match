<template>
    <BaseContextMenu ref="contextMenu">
        <template v-slot:header>
            {{header}}
        </template>
        <template v-slot>
            <div class="item-group">
                <BaseSelectButtons v-model="localValue" :type="type" :options="options" :optionValueKey="optionValueKey"
                :submitOnChange="submitOnChange" :optionDescriptionKey="optionDescriptionKey"
                :multipleOptionArrays="multipleOptionArrays" :optionGroupNameKey="optionGroupNameKey" :optionGroupOptionsKey="optionGroupOptionsKey"
                :optionNameKey="optionNameKey" :search="search" @submit="$event => localValue = $event" @unset="$emit('unset')"/>
            </div>
        </template>
        <template v-slot:footer="slotProps">
            <div class="item-wrapper">
                <button class="primary" :class="{disabled: submitDisabled}" style="margin-right: 8px;" 
                @click="submit() ;slotProps.hide();">
                    <span>{{submitText || 'Save'}}</span>
                </button>
                <button class="invisible ghost-hover" @click="slotProps.hide(); $emit('cancel')"><span>Cancel</span></button>
            </div>
        </template>
</BaseContextMenu>
</template>

<script>
export default {
    name: 'baseSelectButtonsContextMenu',
    props: [
        'header',
        'type',
        'options',
        'submitOnChange',
        'optionValueKey',
        'optionDescriptionKey',
        'optionNameKey',
        'search',
        'value',
        'submitDisabled',
        'submitText',
        'multipleOptionArrays',
        'optionGroupNameKey',
        'optionGroupOptionsKey',
    ],
    computed: {
        localValue: {
            get() { return this.value },
            set(localValue) {this.$emit('input', localValue)}
        }
    },
    methods: {
        show(e) {
            this.$refs.contextMenu.show(e)
        },
        hide() {
            this.$refs.contextMenu.hide()
        },
        submit() {
            this.$emit('submit', this.localValue)
            // this.$emit('input', this.localValue)
        }
    }
}
</script>

<style scoped lang="scss">
::v-deep {
    .body {
        overflow: hidden;
        height: 100vh;
        .item-group {
            height: 100%;
            padding: 0;
            .select-buttons {
                display: flex;
                flex-direction: column;
                height: 100%;
            }
        }
    }
    .select-buttons .wrapper {
        max-height: 340px;
    }
}
</style>