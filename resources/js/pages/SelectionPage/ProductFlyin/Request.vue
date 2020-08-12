<template>
    <div class="request-wrapper" :class="[{own: isOwn}, {master: isMaster}, 
    {'has-traits': request.focus}, {'edit-active': editActive}]">
        <div class="traits">
            <span v-if="request.focus" class="pill small primary"><i class="fas fa-star"></i> Focus</span>
        </div>
        <div class="request">
            <strong class="sender">
                {{request.selection.name}} | 
                {{request.author_id == authUser.id ? 'You' : request.author ? request.author.name : 'Anonymous'}}</strong>

            <span v-if="!editActive" class="content">{{request.content}}</span>
            <span v-else class="content">
                <BaseInputTextArea ref="requestInputField" v-model="requestToEdit.content"
                @keyup.enter.exact.native="onUpdateRequest" @keydown.enter.exact.native.prevent
                @keydown.esc.native="onCancel"/>
            </span>

            <!-- Request Controls -->
            <div class="controls" v-if="!editActive">

                <button v-tooltip.top="{content: 'Delete', delay: {show: 300}}" class="button invisible ghost-hover"
                @click="onDeleteRequest">
                    <i class="far fa-trash-alt"></i>
                </button>

                <button v-tooltip.top="{content: 'Edit', delay: {show: 300}}" class="button invisible ghost-hover"
                @click="onEditRequest">
                    <i class="far fa-pen"></i>
                </button>

            </div>
            <!-- End Comment Controls -->
        </div> 
        <div class="save-controls" v-if="editActive">
            <button class="invisible ghost-hover" style="margin-right: 8px"
            @click="onCancel">
                <span>Cancel</span>
            </button>
            <BaseButton buttonClass="primary" :hotkey="{key: 'ENTER', label: 'Save', align: 'right'}" 
            @click="onUpdateRequest">
                <span>Save</span>
            </BaseButton>
        </div>

        <BaseDialog ref="confirmDeleteRequest" type="confirm"
        confirmColor="red" confirmText="Yes, delete it">
            <div class="icon-graphic">
                <i class="lg primary far fa-clipboard-check"></i>
                <i class="lg far fa-arrow-right"></i>
                <i class="lg dark far fa-trash"></i>
            </div>
            <h3>Are you sure you want to delete this request?</h3>
        </BaseDialog>

    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
    name: 'request',
    props: [
        'request',
        'selectionInput'
    ],
    data: function() { return {
        requestToEdit: this.request,
        editActive: false,
    }},
    computed: {
        ...mapGetters('auth', ['authUser']),
        ...mapGetters('selections', ['currentSelection']),
        isOwn() {
            return this.request.selection_id == this.currentSelection.id
        },
        isMaster() {
            return this.request.selection.type == 'Master'
        }
    },
    methods: {
        ...mapActions('requests', ['insertOrUpdateRequest', 'deleteRequest']),
        async onDeleteRequest() {
            if (await this.$refs.confirmDeleteRequest.confirm()) {
                this.deleteRequest({selectionInput: this.selectionInput, request: this.request})
            }
        },
        onCancel() {
            this.editActive = false
        },
        onUpdateRequest() {
            this.request.content = this.requestToEdit.content
            this.insertOrUpdateRequest({selectionInput: this.selectionInput, request: this.request})
            this.editActive = false
        },
        onEditRequest() {
            this.editActive = true
            this.requestToEdit = JSON.parse(JSON.stringify(this.request))
            this.$nextTick(() => {
                this.$refs.requestInputField.focus()
                this.$refs.requestInputField.select()
            })
        }
    }
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';

    .request-wrapper {
        margin-bottom: 4px;
        position: relative;
        &.has-traits {
            margin-top: 24px;
        }
        &.edit-active {
            width: 100%;
            max-width: none;
            margin-bottom: 72px;
            .request {
                padding: 2px;
                width: 100%;
                .sender {
                    margin-left: 10px;
                    margin-top: 10px;
                }
                .content {
                    margin-bottom: 0;
                }
                ::v-deep {
                    .input-wrapper {
                        border: none;
                        min-height: 160px;
                    }
                }
            }
        }
    }
    .save-controls {
        position: absolute;
        bottom: -8px;
        right: 0;
        transform: translateY(100%);
        display: flex;
    }
    .traits {
        position: absolute;
        top: -16px;
        left: -10px;
        z-index: 1;
        white-space: nowrap;
        > * {
            box-shadow: 0 3px 6px rgba(0,0,0,.2);
            &:not(:last-child) {
                margin-right: 8px;
            }
        }
    }
    .pill {
        i {
            font-size: 8px;
            margin-right: 4px;
        }
    }
    .save-controls {
        position: absolute;
        bottom: -8px;
        right: 0;
        transform: translateY(100%);
        display: flex;
    }
    .request {
        padding: 12px;
        border-radius: 6px;
        display: flex;
        flex-direction: column;
        background: white;
        position: relative;
        &:hover {
            .controls {
                display: block;
            }
        }
        .sender {
            font-size: 12px;
        }
        .id {
            font-size: 12px;
            font-weight: 500;
        }
        .own:not(.master) & {
            background: $primary;
            color: white;
            strong {
                color: white;
            }
        }
        .master & {
            background: $yellow;
        }
        .content {
            white-space: pre-wrap;
            word-wrap: break-word;
            margin: 12px 0;
        }
        .controls {
            transition: .3s;
            position: absolute;
            right: 0;
            bottom: 0;
            padding: 4px;
            display: none;
            background: white;
            border-radius: 4px;
            box-shadow: 0 3px 6px rgba(0,0,0,.2);
            z-index: 1;
            > *:not(:first-child) {
                margin-left: 8px;
                &::before {
                    content: "";
                    display: block;
                    width: 1px;
                    height: 28px;
                    background: #cfcfcf;
                    position: absolute;
                    left: -6px;
                }
            }
            .loader {
                height: 24px;
                flex-direction: row;
            }
        }
    }
</style>