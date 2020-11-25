<template>
    <div class="ticket-input-area">
        <div class="available-label-list" v-if="showLabelList && availableTicketLabels.length > 0">
            <div
                class="label-list-item"
                v-for="(label, index) in labelsFiltered"
                :key="index"
                :class="{ focus: labelListFocusIndex == index }"
                @click="insertLabel(index)"
            >
                <span># {{ label }}</span>
            </div>
        </div>
        <div class="ticket-label square ghost primary xs" v-if="ticketLabel" @click="ticketLabel = null">
            <span>{{ ticketLabel }}</span>
            <i class="far fa-times"></i>
        </div>
        <!-- <BaseContentEditable
            ref="inputField"
            placeholder="Try adding a label. Type #"
            v-model="ticket.content"
            @input.native="onInput"
            @keydown.native="onKeyDown"
            @mousedown.native="onClick"
        /> -->
        <BaseInputTextArea
            :class="{ 'has-label': ticketLabel }"
            v-model="ticket.content"
            ref="inputField"
            :placeholder="placeholder"
            :disabled="disabled"
            @input.native="onInput"
            @keydown.native="onKeyDown"
        />
    </div>
</template>

<script>
export default {
    name: 'ticketInputArea',
    props: ['ticket', 'placeholder', 'disabled'],
    data: function() {
        return {
            showLabelList: false,
            availableTicketLabels: ['color_added', 'color_removed', 'price_wish', 'add_delivery', 'change_delivery'],
            labelListFocusIndex: 0,
            ticketLabel: null,
        }
    },
    computed: {
        labelsFiltered() {
            // Get the current label string
            const ticketContent = this.ticket.content
            const labelRegex = new RegExp(/(?:#([^ ]*))/)
            const labelStringMatches = ticketContent.match(labelRegex)
            if (!labelStringMatches) return this.availableTicketLabels
            const labelString = labelStringMatches[1]
            return this.availableTicketLabels.filter(label => label.toLowerCase().startsWith(labelString.toLowerCase()))
        },
    },
    methods: {
        onShowLabelList(e) {
            this.showLabelList = true
        },
        insertLabel(index) {
            // Set the new label
            const newLabel = this.labelsFiltered[index]
            this.ticketLabel = newLabel

            // Remove the label from the text
            const ticketContent = this.ticket.content
            const labelRegex = new RegExp(/#[^ ]*/)
            const labelStringMatches = labelRegex.exec(ticketContent)
            const stringStart = ticketContent.slice(0, labelStringMatches.index)
            const stringEnd = ticketContent.slice(labelStringMatches.index + labelStringMatches[0].length)
            this.ticket.content = stringStart + stringEnd

            // Hide the label list
            this.showLabelList = false
        },

        onInput(e) {
            if (this.showLabelList) {
                if (this.labelListFocusIndex > this.labelsFiltered.length - 1) this.labelListFocusIndex = 0
                if (e.target.value.search('#') < 0) this.showLabelList = false
            }
            if (e.data == '#') {
                this.showLabelList = true
            }
        },
        onKeyDown(e) {
            if (this.showLabelList && (e.code == 'ArrowUp' || e.code == 'ArrowDown')) {
                e.preventDefault()
                if (e.code == 'ArrowDown') {
                    if (this.labelsFiltered.length - 1 == this.labelListFocusIndex) {
                        this.labelListFocusIndex = 0
                    } else this.labelListFocusIndex++
                }
                if (e.code == 'ArrowUp') {
                    if (this.labelListFocusIndex == 0) {
                        this.labelListFocusIndex = this.labelsFiltered.length - 1
                    } else this.labelListFocusIndex--
                }
            }
            if (this.showLabelList && e.code == 'Escape') {
                this.showLabelList = false
            }
            if (this.showLabelList && e.code == 'Enter') {
                e.preventDefault()
                this.insertLabel(this.labelListFocusIndex)
            }
        },
        setCaretAfterLabel() {
            this.$refs.inputField.setCaret()
        },
    },
}
</script>

<style <style lang="scss" scoped>
@import '~@/_variables.scss';
.available-label-list {
    padding: 16px 0;
    background: white;
    border: $borderEl;
    border-radius: $borderRadiusEl;
    box-shadow: $shadowEl;
    margin-bottom: -4px;
    position: relative;
    .label-list-item {
        padding: 0 8px;
        height: 32px;
        display: flex;
        align-items: center;
        cursor: pointer;
        &.focus {
            background: $primary;
            color: white;
        }
        &:hover {
            background: $primary300;
        }
    }
}
.ticket-label {
    position: absolute;
    top: 8px;
    left: 8px;
    z-index: 1;
    i {
        display: none;
    }
    &:hover {
        i {
            display: block;
        }
    }
}
::v-deep {
    .has-label {
        .input-wrapper {
            padding-top: 40px;
        }
    }
}
</style>
