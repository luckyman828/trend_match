<template>
    <BaseFlyinColumn class="requests" :class="{'thread-open': !!currentRequestThread}">

        <template v-slot:header class="random">
            <h3><span>Requests</span>
                <span class="pill primary sm"><span>{{requests.length}}</span></span>
            </h3>
        </template>

        <template v-slot>
            <div class="requests-wrapper">
                <div class="selection-request" 
                v-for="request in requests.filter(x => x.selection_id == currentSelection.id)" 
                :key="request.id">
                    <request :request="request" :selectionInput="selectionInput"
                    :class="{'thread-open': currentRequestThread && currentRequestThread.id == request.id}"/>
                </div>
                <div v-if="requests.find(x => x.selection_id != selectionInput.selection_id)" class="break-line">Showing requests from other selections(s)</div>
                <request :request="request" :key="request.id" :selectionInput="selectionInput"
                v-for="request in requests
                .filter(x => x.selection_id != selectionInput.selection_id)
                .sort((a, b) => a.selection.type == 'Master' ? -1 : 1)"/>
            </div>

            <!-- Deny access for feedback -->
            <div class="form-wrapper" v-if="currentSelectionMode == 'Alignment'">
                <strong class="form-header">{{currentSelection.type == 'Master' ? 'Open ticket' : 'Your Request'}}</strong>

                <form @submit="onSubmit" :class="[{active: writeActive}]">

                    <div class="input-parent request">
                        <BaseInputTextArea ref="requestField" :disabled="!userWriteAccess.requests.hasAccess"
                        v-tooltip="!userWriteAccess.requests.hasAccess && userWriteAccess.requests.msg"
                        :placeholder="userWriteAccess.comments.hasAccess ? 'Write your request here...' : userWriteAccess.requests.msg"
                        v-model="newRequest.content" 
                        @keydown.native.enter.exact.prevent @click.native="userWriteAccess.requests.hasAccess && activateWrite()"
                        @keyup.native.esc="deactivateWrite(); cancelRequest()" @keyup.native.enter.exact="onSubmit"></BaseInputTextArea>
                    </div>
                    <div class="flex-wrapper" v-if="writeActive">
                        <div class="left">
                            <div class="hotkey-tip" v-if="writeActive">
                                <span class="square ghost">ENTER</span>
                                <span>To save</span>
                            </div>
                        </div>
                        <div class="right">
                            <BaseTempAlert :duration="2000" ref="requestSucces" :hidden="writeActive"><small class="request-success">Request saved <i class="fas fa-clipboard-check green"></i></small></BaseTempAlert>
                            <template>
                                <button type="button" class="invisible" @click="cancelRequest"><span>Cancel</span></button>
                                <button type="button" class="primary" :class="{disabled: submitDisabled}" @click="onSubmit"><span>Save</span></button>
                            </template>
                        </div>
                    </div>
                </form>
            </div>
        </template>
    </BaseFlyinColumn>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import Request from './Request'
import BaseTempAlert from '../../../components/ui/BaseTempAlert'

export default {
    name: 'requestsSection',
    props: [
        'requests',
        'selectionInput',
    ],
    components: {
        Request,
        BaseTempAlert
    },
    data: function () { return {
        newRequest: {
            content: '',
            important: false,
        },
        writeScope: 'comment',
        writeActive: false,
        submitting: false,
        // selectionRequest: null,
    }},
    watch: {
        selectionInput: function(newVal, oldVal) {
            this.update()
        },
        requests: function(newVal, oldVal) {
            this.update()
        },
        selectionRequest: function(newVal, oldVal) {
            this.update()
        },
    },
    computed: {
        ...mapGetters('requests', {
            currentRequestThread: 'getCurrentRequestThread'
        }),
        ...mapGetters('auth', ['authUser']),
        ...mapGetters('selections', ['currentSelection', 'getSelectionCurrentMode', 'getAuthUserSelectionWriteAccess']),
        currentSelectionMode () { return this.getSelectionCurrentMode(this.selectionInput.selection) },
        submitDisabled () {
            return this.newRequest.content.length < 1 
        },
        userWriteAccess () {
            return this.getAuthUserSelectionWriteAccess(this.selectionInput.selection)
        },
        selectionRequest () {
            return this.selectionInput.selectionRequest
        }
    },
    methods: {
        ...mapActions('requests', ['insertOrUpdateRequest', 'deleteRequest']),
        activateWrite() {
            this.$refs.requestField.focus()
            this.$refs.requestField.select()
            this.writeActive = true
        },
        deactivateWrite() {
            // Unset the focus
            this.writeActive = false
            document.activeElement.blur()
            this.resizeTextareas()
        },
        cancelRequest() {
            this.deactivateWrite()
            this.newRequest.content = this.selectionRequest && this.currentSelection.type != 'Master' ? this.selectionRequest.content : ''
        },
        onDeleteRequest() {
            this.deleteRequest({selectionInput: this.selectionInput, request: this.selectionRequest})
        },
        async onSubmit(e) {

            if (e) e.preventDefault()
            if (this.submitDisabled) return

            // Set submitting to true
            this.submitting = true

            // Instantiate the request to post
            const requestToPost = {
                id: this.selectionRequest && this.currentSelection.type != 'Master' ? this.selectionRequest.id : null,
                author_id: this.authUser.id,
                product_id: this.selectionInput.product_id,
                selection_id: this.selectionInput.selection_id,
                content: this.newRequest.content,
                author: this.authUser,
                selection: this.selectionInput.selection
            }
            // dispatch action
            this.insertOrUpdateRequest({selectionInput: this.selectionInput, request: requestToPost})
            this.submitting = false

            // Update the selection request
            // this.selectionRequest = requestToPost

            // Reset comment
            this.writeActive = false
            // Unset the focus
            document.activeElement.blur()
            
            // Reset request
            this.newRequest.content = this.selectionRequest.content
            this.resizeTextareas()

        },
        update() {
            // Find the existing selection request if any
            // this.selectionRequest = this.requests.find(x => x.selection_id == this.selection.id)
            // Set the new request equal to the existing if one exists
            this.newRequest.content = this.selectionRequest && this.currentSelection.type != 'Master' ? this.selectionRequest.content : ''
            // Set the id of the new request if one exists
            this.newRequest.id = this.selectionRequest && this.currentSelection.type != 'Master' ? this.selectionRequest.id : null
            this.writeActive = false

            // Preset the height of the request field
            this.resizeTextareas()
        },
        resizeTextareas() {
            if (this.currentSelectionMode == 'Alignment') {
                this.$nextTick(() => {
                    this.$refs.requestField.resize()
                })
            }
        },
        hotkeyHandler(e) {
            const key = e.code
            if (event.target.type != 'textarea' && event.target.tagName.toUpperCase() != 'INPUT') {
                if (key == 'Enter') {
                    this.$emit('hotkeyEnter', e)
                }
                if (key == 'Tab' && this.writeActive) {
                    this.deactivateWrite()
                    this.$emit('activateCommentWrite')
                }
            }
        },
    },
    mounted() {
        this.update()
    },
    created() {
        // Insert small delay before we add our event listener to stop the same event that showed this section, do things inside the component
        setTimeout(() => {
            document.body.addEventListener('keyup', this.hotkeyHandler)
        }, 10)
    },
    destroyed() {
        document.body.removeEventListener('keyup', this.hotkeyHandler)
    }
}
</script>

<style <style lang="scss" scoped>
@import '~@/_variables.scss';
    ::v-deep {
        &.flyin-column {
            .header {
                display: flex;
                align-items: center;
            }
            .body {
                display: flex;
                flex-direction: column;
                padding: 0;
            }
        }
    }
    h3 {
        display: flex;
        align-items: center;
        .pill {
            margin-left: 12px;
        }
    }
    .requests {
        background: $bg;
        ::v-deep {
            .request {
                transition: .2s;
            }
        }
        &.thread-open {
            ::v-deep {
                .request {
                    opacity: .5;
                }
                .request-wrapper.thread-open {
                    .request {
                        opacity: 1;
                        box-shadow: $shadowElHard;
                        transform: translateY(2px);
                    }
                }
            }
        }
    }
    .requests-wrapper {
        height: 100%;
        overflow-y: auto;
        padding: 16px 16px 64px;
        .sender {
            display: block;
            font-size: 12px;
            font-weight: 500;
            color: $dark2;
        }
    }
    .form-wrapper {
        padding: 20px 16px 28px;
        .form-header {
            margin-left: 4px;
            margin-bottom: 4px;
            display: block;
        }
        .controls {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
            .left {
                > :first-child {
                    margin-left: -12px;
                }
                // > :not(:last-child) {
                //     margin-right: 8px;
                // }
            }
        }
        form {
            position: relative;
            .delete-request {
                position: absolute;
                right: 0;
                top: -6px;
                transform: translateY(-100%)
            }
            .id {
                font-size: 12px;
                color: $dark2;
                display: block;
                margin-top: -2px;
            }
            .edit-request {
                position: absolute;
                right: 12px;
                font-size: 10px;
                color: $dark;
                font-weight: 500;
                top: 50%;
                transform: translateY(-50%);
                cursor: pointer;
                .circle {
                    height: 24px;
                    width: 24px;
                    margin-left: 4px;
                }
            }
            .flex-wrapper {
                display: flex;
                justify-content: space-between;
                margin-top: 8px;
                // align-items: center;
                .right {
                    white-space: nowrap;
                }
            }
        }
        .checkmark {
            height: 32px;
            width: 32px;
            line-height: 32px;
            text-align: center;
            border-radius: 16px;
            background: $light1;
            color: $dark2;
            position: absolute;
            right: 16px;
            top: 4px;
            cursor: pointer;
            &.active {
                color: $primary;
            }
        }
        input[type=submit] {
            margin-top: 12px;
        }
    }



    .hotkey-tip {
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
    .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
    }
    .tab-headers {
        .tab {
            justify-content: space-between;
        }
    }
    .request-wrapper {
        margin-bottom: 16px;
    }
    .sender-wrapper {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        margin-bottom: 4px;
        &.own {
            align-items: flex-end
        }
    }
    .sender {
        margin-bottom: 20px;
    }
    .break-line {
        &::after, &::before {
            content: '';
            display: block;
            height: 2px;
            background: $dark2;
            flex: 1;
        }
        &::after {
            margin-left: 12px;
        }
        &::before {
            margin-right: 12px;
        }
        color: $font;
        font-size: 12px;
        font-weight: 500;
        display: flex;
        align-items: center;
        margin-top: 20px;
        margin-bottom: 12px;
    }
    .request-success {
        margin-right: 8px;
        font-weight: 500;
    }
</style>
