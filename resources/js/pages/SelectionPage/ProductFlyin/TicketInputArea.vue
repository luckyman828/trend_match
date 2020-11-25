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
        <BaseContentEditable
            ref="inputField"
            placeholder="Try adding a label. Type #"
            v-model="ticket.content"
            @input.native="onInput"
            @keydown.native="onKeyDown"
            @mousedown.native="onClick"
        />
    </div>
</template>

<script>
export default {
    name: 'ticketInputArea',
    props: ['ticket'],
    data: function() {
        return {
            showLabelList: false,
            availableTicketLabels: ['color_added', 'color_removed', 'price_wish', 'add_delivery', 'change_delivery'],
            labelListFocusIndex: 0,
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
            this.ticket.content = `<div class="label square ghost sm"><span>#${this.labelsFiltered[index]}</span></div> `
            this.showLabelList = false
        },

        onInput(e) {
            console.log('on input', e)
            if (e.data == '#' && e.target.innerText.length <= 1) {
                this.showLabelList = true
            }
            if (this.showLabelList) {
                if (this.labelListFocusIndex > this.labelsFiltered.length - 1) this.labelListFocusIndex = 0
                if (e.target.innerText.search('#') < 0) this.showLabelList = false
            }
            if (e.inputType == 'deleteContentBackward') {
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
        onClick(e) {
            // If we click on the label, do nothing
            const inputEl = this.$refs.inputField.$el
            if (inputEl.contains(e.target) && inputEl != e.target) {
                e.preventDefault()
            }
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
</style>
