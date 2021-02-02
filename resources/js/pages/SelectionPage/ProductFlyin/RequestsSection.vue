<template>
    <BaseFlyinColumn class="requests" :class="{ 'thread-open': !!currentRequestThread }">
        <template v-slot:header class="random">
            <h3>
                <span>Requests</span>
                <span class="pill primary sm"
                    ><span>{{ requests.length }}</span></span
                >
            </h3>
        </template>

        <template v-slot>
            <div class="requests-wrapper">
                <div
                    class="selection-request"
                    v-for="request in requests.filter(x => x.selection_id == currentSelection.id)"
                    :key="request.id"
                >
                    <request
                        :request="request"
                        :selectionInput="selectionInput"
                        :class="{ 'thread-open': currentRequestThread && currentRequestThread.id == request.id }"
                    />
                </div>
                <div v-if="requests.find(x => x.selection_id != selectionInput.selection_id)" class="break-line">
                    Showing requests from other selections(s)
                </div>
                <request
                    :request="request"
                    :key="request.id"
                    :selectionInput="selectionInput"
                    :class="{ 'thread-open': currentRequestThread && currentRequestThread.id == request.id }"
                    v-for="request in requests
                        .filter(x => x.selection_id != selectionInput.selection_id)
                        .sort((a, b) => (a.selection.type == 'Master' ? -1 : 1))"
                />
            </div>

            <!-- Deny access for feedback -->
            <NewRequestForm
                v-if="currentSelectionMode == 'Alignment'"
                ref="newRequestForm"
                :selectionInput="selectionInput"
            />
        </template>
    </BaseFlyinColumn>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import Request from './Request'
import NewRequestForm from './NewRequestForm'
import BaseTempAlert from '../../../components/ui/BaseTempAlert'

export default {
    name: 'requestsSection',
    props: ['requests', 'selectionInput'],
    components: {
        Request,
        NewRequestForm,
        BaseTempAlert,
    },
    computed: {
        ...mapGetters('requests', {
            currentRequestThread: 'getCurrentRequestThread',
        }),
        ...mapGetters('selections', ['currentSelection', 'getSelectionCurrentMode']),
        currentSelectionMode() {
            return this.getSelectionCurrentMode(this.selectionInput.selection)
        },
    },
    methods: {
        ...mapActions('requests', ['insertOrUpdateRequest', 'deleteRequest']),
        ...mapMutations('requests', ['SET_CURRENT_REQUEST_THREAD']),
        onDeleteRequest() {
            this.deleteRequest({ selectionInput: this.selectionInput, request: this.selectionRequest })
        },
        activateWrite() {
            this.$refs.newRequestForm.activateWrite()
        },
    },
}
</script>

<style lang="scss" scoped>
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
        .request-wrapper:not(.edit-active) {
            .request {
                transition: opacity 0.2s, box-shadow 0.2s, transform 0.2s;
            }
        }
    }
    &.thread-open {
        ::v-deep {
            .request {
                opacity: 0.5;
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

.break-line {
    &::after,
    &::before {
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
</style>
