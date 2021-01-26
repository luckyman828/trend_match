<template>
    <div class="request-input-area" :class="{ 'edit-active': writeActive }">
        <button
            class="request-label square ghost primary xs"
            v-for="(label, index) in request.labels"
            :key="index"
            @click="removeLabel(index)"
        >
            <span>{{ label }}</span>
            <i class="far fa-times"></i>
        </button>

        <v-popover
            trigger="manual"
            :open="showLabelList && labelsFiltered.length > 0"
            placement="top"
            :handleResize="true"
        >
            <BaseInputTextArea
                :class="{ 'has-label': request.labels.length > 0 }"
                ref="requestField"
                :disabled="disabled"
                v-tooltip="disabled && disabledTooltip ? disabledTooltip : ''"
                v-model="request.content"
                :placeholder="'Write your request here...'"
                @input.native="onInput"
                @keydown.native="onKeyDown"
                @click.native="!disabled && !writeActive && activateWrite()"
            />
            <div class="available-label-list" slot="popover">
                <div
                    class="label-list-item"
                    v-for="(label, index) in labelsFiltered"
                    :key="index"
                    :class="{ focus: labelListFocusIndex == index }"
                    @click="insertLabel(index)"
                >
                    <span>#{{ label }}</span>
                </div>
            </div>
        </v-popover>

        <div class="controls" v-if="writeActive">
            <div class="left">
                <div class="hotkey-tip" v-if="writeActive">
                    <span class="square ghost">ENTER</span>
                    <span>To save</span>
                </div>
            </div>
            <div class="right">
                <BaseTempAlert :duration="2000" ref="requestSucces" :hidden="writeActive"
                    ><small class="request-success">Request saved <i class="fas fa-clipboard-check green"></i></small
                ></BaseTempAlert>
                <template>
                    <button type="button" class="invisible ghost-hover" @click="onCancel">
                        <span>Cancel</span>
                    </button>
                    <button type="button" class="primary" :class="{ disabled: submitDisabled }" @click="onSubmit">
                        <span>Save</span>
                    </button>
                </template>
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
    name: 'requestInputArea',
    props: ['request', 'disabled', 'disabledTooltip', 'selectionInput', 'selectOnActivate'],
    data: function() {
        return {
            showLabelList: false,
            labelListFocusIndex: 0,
            writeActive: false,
            submitting: false,
        }
    },
    computed: {
        ...mapGetters('auth', ['authUser']),
        ...mapGetters('requests', {
            availableRequestLabels: 'getAvailableRequestLabels',
        }),
        ...mapGetters('selections', {
            ticketModeActive: 'getTicketModeActive',
        }),
        labelsFiltered() {
            // Get the current label string
            const requestContent = this.request.content
            const labelRegex = new RegExp(/(?:#([^ ]*))/)
            const labelStringMatches = requestContent.match(labelRegex)
            if (!labelStringMatches) return this.availableRequestLabels
            const labelString = labelStringMatches[1]
            return this.availableRequestLabels.filter(label =>
                label.toLowerCase().startsWith(labelString.toLowerCase())
            )
        },
        submitDisabled() {
            return this.request.content.length < 1
        },
    },
    methods: {
        ...mapActions('requests', ['insertOrUpdateRequest']),
        onShowLabelList(e) {
            this.showLabelList = true
        },
        insertLabel(index) {
            this.labelListFocusIndex = index

            // Set the new label
            const newLabel = this.labelsFiltered[index]
            this.request.labels.splice(0, 1, newLabel)

            // Remove the label from the text
            const requestContent = this.request.content
            const labelRegex = new RegExp(/#[^ ]*/)
            const labelStringMatches = labelRegex.exec(requestContent)
            const stringStart = requestContent.slice(0, labelStringMatches.index)
            const stringEnd = requestContent.slice(labelStringMatches.index + labelStringMatches[0].length)
            this.request.content = stringStart + stringEnd

            // Hide the label list
            this.showLabelList = false
        },
        removeLabel(index) {
            this.request.labels.splice(index, 1)
        },

        onInput(e) {
            if (!this.ticketModeActive) return
            if (this.showLabelList) {
                if (this.labelListFocusIndex > this.labelsFiltered.length - 1) this.labelListFocusIndex = 0
                if (e.target.value.search('#') < 0) this.showLabelList = false
            }
            if (e.data == '#') {
                this.showLabelList = true
            }
        },
        onKeyDown(e) {
            // Label list actions
            if (this.showLabelList) {
                if (e.code == 'ArrowUp' || e.code == 'ArrowDown') {
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
                if (e.code == 'Escape') {
                    this.showLabelList = false
                }
                if (e.code == 'Enter') {
                    e.preventDefault()
                    this.insertLabel(this.labelListFocusIndex)
                }
            }

            // Label list not visible
            else {
                if (e.code == 'Escape') {
                    this.onCancel()
                }
                if (e.code == 'Enter' && !(e.altKey || e.shiftKey || e.metaKey || e.ctrlKey)) {
                    e.preventDefault()
                    this.onSubmit()
                }
            }
        },
        onCancel() {
            this.deactivateWrite()
            this.$emit('cancel')
        },
        async onSubmit(e) {
            if (e) e.preventDefault()
            if (this.submitDisabled) return

            // Set submitting to true
            this.submitting = true

            this.request.author_id = this.authUser.id
            this.request.author = this.authUser
            this.request.lastReadAt = new Date().toISOString()
            this.request.created_at = new Date().toISOString()
            // dispatch action
            await this.insertOrUpdateRequest({ selectionInput: this.selectionInput, request: this.request })
            this.submitting = false

            // Update the selection request
            // this.selectionRequest = requestToPost

            // Reset comment
            this.deactivateWrite()
            this.$emit('submit')
        },
        activateWrite() {
            this.$refs.requestField.focus()
            if (this.selectOnActivate) {
                this.$refs.requestField.select()
            }
            this.writeActive = true
        },
        deactivateWrite() {
            // Unset the focus
            this.writeActive = false
            document.activeElement.blur()
        },
    },
}
</script>

<style <style lang="scss" scoped>
@import '~@/_variables.scss';
.request-input-area {
    position: relative;
    .request-label {
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
    .controls {
        display: flex;
        justify-content: space-between;
        margin-top: 8px;
        // align-items: center;
        .right {
            white-space: nowrap;
        }
    }
    .hotkey-tip {
        display: flex;
        flex-direction: column;
        .square {
            border-width: 1px;
            height: auto;
            padding: 2px 4px;
            min-width: 0;
            font-weight: 400;
            border-radius: 2px;
            font-size: 9px;
            margin-right: 2px;
        }
        font-size: 10px;
        color: $dark2;
    }
}
</style>

<style lang="scss">
@import '~@/_variables.scss';
.available-label-list {
    padding: 8px 0;
    // background: white;
    // border: $borderEl;
    // border-radius: $borderRadiusEl;
    // box-shadow: $shadowEl;
    .label-list-item {
        padding: 0 8px;
        height: 32px;
        display: flex;
        align-items: center;
        font-weight: 500;
        font-size: 13px;
        cursor: pointer;
        &.focus {
            background: $primary;
            color: white;
        }
        &:hover {
            background: $primary;
            color: white;
        }
    }
}
</style>
