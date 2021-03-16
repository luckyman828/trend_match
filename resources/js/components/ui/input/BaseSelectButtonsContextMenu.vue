<template>
    <BaseContextMenu ref="contextMenu" :inline="inline">
        <template v-slot:header>
            {{ header }}
        </template>
        <template v-slot>
            <BaseLoader v-if="loading" />
            <div class="item-group" v-else>
                <BaseSelectButtons
                    ref="selectButtons"
                    v-model="localValue"
                    :type="type"
                    :options="options"
                    :optionValueKey="optionValueKey"
                    :submitOnChange="submitOnChange"
                    :optionDescriptionKey="optionDescriptionKey"
                    :unsetOption="unsetOption"
                    :unsetValue="unsetValue"
                    :emitOnChange="emitOnChange"
                    :multipleOptionArrays="multipleOptionArrays"
                    :optionGroupNameKey="optionGroupNameKey"
                    :optionGroupOptionsKey="optionGroupOptionsKey"
                    :optionNameKey="optionNameKey"
                    :search="search"
                    :uniqueKey="uniqueKey"
                    @submit="submit"
                    @unset="$emit('unset')"
                />
            </div>
        </template>
        <template v-slot:footer="slotProps" v-if="!submitOnChange">
            <div class="item-wrapper">
                <button
                    class="primary"
                    :class="{ disabled: submitDisabled }"
                    style="margin-right: 8px;"
                    @click="
                        submit()
                        slotProps.hide()
                    "
                >
                    <span>{{ submitText || 'Save' }}</span>
                </button>
                <button
                    class="invisible ghost-hover"
                    @click="
                        slotProps.hide()
                        $emit('cancel')
                    "
                >
                    <span>Cancel</span>
                </button>
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
        'uniqueKey',
        'unsetOption',
        'unsetValue',
        'emitOnChange',
        'inline',
        'loading',
    ],
    // data: function() {return {
    //     currentValue
    // }},
    computed: {
        localValue: {
            get() {
                return this.value
            },
            set(localValue) {
                this.$emit('input', localValue)
            },
        },
    },
    methods: {
        show(e) {
            this.$refs.contextMenu.show(e)
        },
        hide() {
            this.$refs.contextMenu.hide()
        },
        submit() {
            this.$emit('input', this.$refs.selectButtons.selection)
            this.$emit('submit', this.$refs.selectButtons.selection)
            this.hide()
        },
    },
}
</script>

<style scoped lang="scss">
::v-deep {
    .body {
        overflow: hidden;
        // height: 100vh;
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
        padding-bottom: 40px;
    }
}
</style>
