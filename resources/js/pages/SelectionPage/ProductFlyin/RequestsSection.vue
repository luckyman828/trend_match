<template>
    <BaseFlyinColumn class="requests">

        <template v-slot:header class="random">
            <h3><span>Requests</span>
                <span class="pill primary sm"><span>{{product.requests.length}}</span></span>
            </h3>
        </template>

        <template v-slot>
            <div class="comments-wrapper">
                <div class="selection-request" v-if="selectionRequest">
                    <request :request="selectionRequest"/>
                </div>
                <div v-if="product.requests.find(x => x.selection_id != currentSelection.id)" class="break-line">Showing requests from other selections(s)</div>
                <div class="requests-wrapper">
                    <request :request="request" v-for="request in product.requests.filter(x => x.selection_id != currentSelection.id)" :key="request.id"/>
                </div>
            </div>


            <div class="form-wrapper">
                <strong class="form-header">Your Request</strong>

                <form @submit="onSubmit" :class="[{active: writeActive}]">
                    <!-- <button class="ghost red-hover delete-request sm" 
                    v-if="selectionRequest && writeActive"
                    @click="onDeleteRequest">
                        <i class="far fa-trash-alt"></i>
                        <span>Delete request</span>
                    </button> -->

                    <div class="input-parent request">
                        <BaseInputTextArea ref="requestField" :disabled="selectionRequest && !writeActive"
                        placeholder="Write your request here..." v-model="newRequest.content" 
                        @keydown.native.enter.exact.prevent @click.native="activateWrite"
                        @keyup.native.esc="deactivateWrite(); cancelRequest()" @keyup.native.enter.exact="onSubmit"></BaseInputTextArea>
                        <!-- <div class="edit-request" v-if="selectionRequest && !writeActive"
                        @click="activateWrite">
                            <span>Edit Request <span class="circle small light"><i class="fas fa-pencil"></i></span></span>
                        </div> -->
                    </div>
                    <div class="flex-wrapper" v-if="writeActive">
                        <div class="left">
                            <small class="id" v-if="selectionRequest">Request ID: {{selectionRequest.id}}</small>
                            <div class="hotkey-tip" v-if="writeActive">
                                <span class="square ghost">ENTER</span>
                                <span>To save</span>
                            </div>
                        </div>
                        <div class="right">
                            <BaseTempAlert :duration="2000" ref="requestSucces" :hidden="writeActive"><small class="request-succes">Request saved <i class="fas fa-clipboard-check green"></i></small></BaseTempAlert>
                            <template>
                                <button type="button" class="invisible" @click="cancelRequest"><span>Cancel</span></button>
                                <button type="button" class="green" :class="{disabled: submitDisabled}" @click="onSubmit"><span>Save</span></button>
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
        'product',
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
        selectionRequest: null,
    }},
    watch: {
        product: function(newVal, oldVal) {
            if (newVal.id != oldVal.id)
                this.update()
        },
    },
    computed: {
        ...mapGetters('auth', ['authUser']),
        ...mapGetters('selections', ['currentSelection']),
        submitDisabled () {
            return this.newRequest.content.length < 1 
            || (this.selectionRequest && this.newRequest.content == this.selectionRequest.content)
        },
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
            this.newRequest.content = (this.selectionRequest) ? this.selectionRequest.content : ''
        },
        onDeleteRequest() {
            this.deleteRequest({product: this.product, request: this.selectionRequest})
            this.selectionRequest = null
        },
        async onSubmit(e) {

            if (e) e.preventDefault()
            if (this.submitDisabled) return

            // Set submitting to true
            this.submitting = true

            // Instantiate the request to post
            const requestToPost = {
                id: this.selectionRequest ? this.selectionRequest.id : null,
                author_id: this.authUser.id,
                product_id: this.product.id,
                selection_id: this.currentSelection.id,
                content: this.newRequest.content,
                author: this.authUser,
                selection: this.currentSelection
            }
            // dispatch action
            this.insertOrUpdateRequest({product: this.product, request: requestToPost})
            this.submitting = false

            // Update the selection request
            this.selectionRequest = requestToPost

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
            this.selectionRequest = this.product.requests.find(x => x.selection_id == this.currentSelection.id)
            // Set the new request equal to the existing if one exists
            this.newRequest.content = (this.selectionRequest) ? this.selectionRequest.content : ''
            // Set the id of the new request if one exists
            this.newRequest.id = (this.selectionRequest) ? this.selectionRequest.id : null
            this.writeActive = false

            // Preset the height of the request field
            this.resizeTextareas()
        },
        resizeTextareas() {
            this.$nextTick(() => {
                this.$refs.requestField.resize()
            })
        },
        hotkeyHandler(e) {
            const key = e.code
            // if (event.target.type != 'textarea' && event.target.tagName.toUpperCase() != 'INPUT') {
            //     if (key == 'Enter') {
            //         e.preventDefault()
            //         this.activateWrite()
            //     }
            // }
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
        &.fly-in-column {
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
    }
    .comments-wrapper {
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
        color: $dark2;
        font-size: 12px;
        font-weight: 500;
        display: flex;
        align-items: center;
        margin-top: 20px;
        margin-bottom: 12px;
    }
    .request-succes {
        margin-right: 8px;
        font-weight: 500;
    }
</style>
