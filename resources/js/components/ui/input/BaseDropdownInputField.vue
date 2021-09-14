<template>
    <v-popover
        trigger="click"
        :disabled="readOnly"
        @apply-show="onShow"
        @apply-hide="$emit('close')"
        :handleResize="resize"
    >
        <!-- TRIGGER -->
        <!-- <div class="dropdown-input-field input-wrapper"></div> -->
        <div
            class="dropdown-field"
            v-tooltip="disabled && disabledTooltip"
            :class="{ 'manual-entry': allowManualEntry }"
        >
            <BaseInputField
                v-if="!allowManualEntry"
                :disabled="true"
                :placeholder="placeholder"
                type="select"
                :value="valueToDisplay"
                :inputClass="inputClass"
                :readOnly="readOnly"
                :innerLabel="innerLabel"
            />
            <BaseInputField
                ref="manualEntry"
                class="manual-input"
                v-else
                :placeholder="placeholder"
                :value="manualEntryInProgress ? localValue : valueToDisplay"
                v-model="localValue"
                :inputClass="inputClass"
                :readOnly="readOnly || disabled"
                :innerLabel="innerLabel"
                @paste="onPasteToManual"
                @input="onManualInput"
                @focus="manualEntryInProgress = true"
                @blur="manualEntryInProgress = false"
            />
            <i class="dropdown-icon fas fa-caret-down" v-if="!readOnly"></i>
        </div>

        <!-- DROPDOWN -->
        <div slot="popover" v-close-popover="type == 'radio'" v-if="!readOnly">
            <!-- <BaseSelectButtonsContextMenu :options="options" :emitOnChange="true" :inline="true" :search="search" /> -->
            <BaseSelectButton
                v-if="showSelectAll && type != 'radio'"
                label="Select all"
                :modelValue="value.length > 0"
                @input="onSelectAll"
            >
                <span>Select all</span>
            </BaseSelectButton>
            <BaseSelectButtons
                ref="selectButtons"
                :options="options"
                :emitOnChange="true"
                :search="search"
                :focusSearchOnMount="!allowManualEntry"
                :type="type"
                :value="value"
                :optionNameKey="optionNameKey"
                :optionValueKey="optionValueKey"
                :uniqueKey="uniqueKey"
                :optionDescriptionKey="descriptionKey"
                :cloneOptionOnSubmit="cloneOptionOnSubmit"
                :unsetOption="unsetOption"
                :unsetValue="unsetValue"
                :displayFunction="displayFunction"
                @input="onSelect($event)"
                @unset="$emit('input', unsetValue)"
            />
            <div class="footer" v-if="$slots.default">
                <slot />
            </div>
        </div>
    </v-popover>
</template>

<script>
export default {
    name: 'baseDropdownInputField',
    props: [
        'placeholder',
        'options',
        'search',
        'type',
        'valueKey',
        'nameKey',
        'descriptionKey',
        'value',
        'inputClass',
        'cloneOptionOnSubmit',
        'readOnly',
        'innerLabel',
        'valueToDisplayOverwrite',
        'unsetOption',
        'unsetValue',
        'disabled',
        'disabledTooltip',
        'displayFunction',
        'allowManualEntry',
        'uniqueKey',
        'resize',
        'showSelectAll',
    ],
    data: function() {
        return {
            manualEntryInProgress: false,
            localValue: '',
            manualEntryTimeout: null,
        }
    },
    computed: {
        optionValueKey() {
            if (!!this.valueKey) return this.valueKey
            if (!this.options || this.options.length <= 0) return
            return Object.keys(this.options[0]).includes('value') ? 'value' : null
        },
        optionNameKey() {
            if (!!this.nameKey) return this.nameKey
            if (!this.options || this.options.length <= 0) return
            return Object.keys(this.options[0]).includes('name') ? 'name' : null
        },
        valueToDisplay() {
            const getValue = () => {
                if (this.valueToDisplayOverwrite) return this.valueToDisplayOverwrite
                if (!this.value) return
                if (!this.options || this.options.length <= 0) return this.value

                // If we have no option name key, we must have a simple value that we want to display
                if (!this.optionNameKey) return Array.isArray(this.value) ? this.value.join(', ') : this.value

                // If we have no value key, we must have selected an entire object
                if (!this.optionValueKey) {
                    return Array.isArray(this.value)
                        ? this.value.map(x => x[this.optionNameKey]).join(', ')
                        : this.value[this.optionNameKey]
                }

                // In case we have both a name key and a value key
                // Read the available options and find our values match there
                const selectedOption = this.options.find(option => option[this.valueKey] == this.value)
                if (!selectedOption) return
                return selectedOption[this.optionNameKey]
            }

            const value = getValue()
            if (!value) return ''
            return this.displayFunction ? this.displayFunction(value) : value
        },
    },
    methods: {
        onManualInput(input) {
            if (this.manualEntryTimeout) clearTimeout(this.manualEntryTimeout)
            this.manualEntryTimeout = setTimeout(() => {
                // Throttle manual entry
                let valueToReturn = input
                if (this.type != 'radio') {
                    valueToReturn = input
                        .split(/,|;/) // Split by , and trim spaces
                        .map(x => {
                            let value = x.trim() // trim just in case
                            // if (parseInt(value)) value = parseInt(value) // Let numbers be numbers
                            return value
                        })
                }
                this.$emit('input', valueToReturn)
            }, 300) // Throttle duration
        },
        onPasteToManual(e) {
            e.preventDefault()
            const clipData = e.clipboardData.getData('text/plain')
            clipData.trim('\r\n')
            const rows = clipData.split('\r\n')
            const allCells = []
            rows.map(row => {
                const cells = row.split('\t').filter(cellValue => !!cellValue)
                allCells.push(...cells)
            })
            const newStr = allCells.join(', ')

            // Insert the modified pasta in the correct spot
            const selectionStart = e.target.selectionStart
            const selectionEnd = e.target.selectionEnd
            const oldVal = e.target.value
            const newVal = oldVal.slice(0, selectionStart) + newStr + oldVal.slice(selectionEnd)
            this.localValue = newVal
            this.onManualInput(newVal)
        },
        onSelect(value) {
            this.$emit('input', value)
            this.$nextTick(() => {
                this.localValue = this.valueToDisplay
            })
        },
        onShow() {
            if (this.search) {
                this.$refs.selectButtons.focusSearch()
                const focusSearchTester = setInterval(() => {
                    if (document.activeElement.type == 'search') {
                        clearInterval(focusSearchTester)
                        return
                    }
                    this.$refs.selectButtons.focusSearch()
                }, 100)
            }
        },
        async onSelectAll() {
            const shouldBeChecked = this.value.length != this.options.length
            for (const optionBox of this.$refs.selectButtons.$refs.selectBox) {
                await this.$nextTick(() => {
                    if (optionBox.shouldBeChecked != shouldBeChecked) optionBox.check()
                })
            }
        },
    },
    mounted() {
        this.localValue = this.valueToDisplay
    },
}
</script>

<style lang="scss" scoped>
.dropdown-field {
    position: relative;
    .dropdown-icon {
        position: absolute;
        right: 8px;
        top: 0;
        height: 100%;
        display: flex;
        align-items: center;
    }
    ::v-deep {
        input {
            font-weight: 700;
            .manual-input & {
                padding-right: 28px;
            }
        }
        .footer {
            padding: 8px 12px 12px;
            border-top: $borderEl;
            margin-top: -8px;
        }
    }
    .manual-input {
        &::v-deep {
            input {
                padding-right: 28px;
            }
        }
    }
}
::v-deep {
    .footer {
        padding: 8px 12px 12px;
        border-top: $borderEl;
        margin-top: -8px;
    }
}
</style>
