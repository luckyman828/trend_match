<template>
    <div class="date-picker">
        <div class="input-parent controls-right controls-inside control-items-2">
            <date-picker
                :id="id"
                :type="type"
                :valueType="formatIn"
                :clearable="false"
                inputClass="input-wrapper"
                :disabled-dates="disabledDates"
                v-model="localValue"
                :format="formatOut"
            />

            <!-- <div class="controls">
                <button v-if="value != oldValue" v-tooltip.top="`Revert to original (${oldValue})`" @click.stop="revert" class="square true-square yellow-green"><span>E</span></button>
            </div> -->
        </div>
    </div>
</template>

<script>
export default {
    name: 'baseDatePicker',
    props: ['type', 'value', 'oldValue', 'id', 'formatIn', 'formatOut', 'disabledDates'],
    computed: {
        localValue: {
            get() {
                return this.value
            },
            set(value) {
                this.$emit('input', value)
                this.$emit('submit', value)
            },
        },
    },
    methods: {
        revert(e) {
            e.preventDefault()
            this.localValue = this.oldValue
            this.$emit('revert')
        },
    },
}
</script>

<style scoped lang="scss">
::v-deep {
    .mx-datepicker {
        width: 100%;
        input {
            cursor: pointer;
        }
    }
}

.date-picker {
    cursor: pointer;
    .input-wrapper {
        transition: 0.3s;
        cursor: pointer;
    }
    .buttons {
        display: none;
    }
    .input-parent {
        .edit {
            opacity: 0;
            transition: 0.2s;
        }
        &:hover {
            .edit {
                opacity: 1;
            }
        }
    }
    .buttons {
        margin-top: 8px;
        display: flex;

        > *:not(:last-child) {
            margin-right: 16px;
        }
        button {
            min-width: 80px;
        }
    }
}
</style>
