<template>
    <BaseFlyin class="request-thread-flyin" :show="show" @close="close" placement="right">
        <template v-slot:header v-if="show">
            <BaseFlyinHeader v-if="show" :disableNavigation="true"
            @close="close">
                <template v-slot:left>
                    <h3>Request: {{request.id}}</h3>
                </template>
            </BaseFlyinHeader>
        </template>

        <template v-slot:default>
            <div class="inner">
                <Request :request="request" :disableControls="true"/>

                <div class="comment-section">
                    <RequestComment v-for="comment in request.comments" :key="comment.id"
                    :comment="comment"/>
                </div>

                <div class="form-wrapper">
                    <strong class="form-header">Write comment</strong>

                    <form @submit="onSubmit" :class="[{active: writeActive}]">
                        <div class="input-parent comment">
                            <BaseInputTextArea ref="commentField"
                            v-model="newComment.content" 
                            @click.native="activateWrite()" @keydown.native.enter.exact.prevent  
                            @keyup.native.esc="deactivateWrite" @keyup.native.enter.exact="onSubmit"/>
                        </div>
                        <div class="flex-wrapper" v-if="writeActive">
                            <div class="left">
                                <div class="hotkey-tip">
                                    <span class="square ghost">ENTER</span>
                                    <span>To submit</span>
                                </div>
                            </div>
                            <div class="right">
                                <button type="button" class="invisible" @click="writeActive = false"><span>Cancel</span></button>
                                <button type="button" class="primary" :class="{disabled: submitDisabled}" @click="onSubmit"><span>Submit</span></button>
                            </div>
                        </div>
                    </form>
                </div>

            </div>
        </template>
        
    </BaseFlyin>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex'
import Request from './Request'
import RequestComment from './RequestComment'

export default {
    name: 'requestThreadFlyin',
    components: {
        Request,
        RequestComment,
    },
    data: function () { return {
        newComment: {
            content: '',
            important: false,
        },
        writeActive: false,
        submitting: false,
    }},
    computed: {
        ...mapGetters('auth', ['authUser']),
        ...mapGetters('requests', {
            show: 'getRequestThreadVisible',
            request: 'getCurrentRequestThread'
        }),
        ...mapGetters('selections', ['getCurrentSelection']),
        submitDisabled () {
            return this.newComment.content.length < 1 || this.submitting
        },
    },
    methods: {
        ...mapMutations('requests', {
            close: 'SET_CURRENT_REQUEST_THREAD'
        }),
        ...mapActions('requests', ['insertOrUpdateRequestComment']),
        activateWrite() {
            this.$refs.commentField.focus()
            this.$refs.commentField.select()
            this.writeActive = true
        },
        deactivateWrite() {
            // Unset the focus
            this.writeActive = false
            document.activeElement.blur()
            this.resizeTextareas()
        },
        async onSubmit() {

            if (this.submitDisabled) return

            // Set submitting to true
            this.submitting = true

            // Instantiate the comment to post
            const commentToPost = {
                user_id: this.authUser.id,
                user: this.authUser,
                request_id: this.request.id,
                content: this.newComment.content,
                role: this.getCurrentSelection.role
            }
            // dispatch action
            await this.insertOrUpdateRequestComment({request: this.request, comment: commentToPost})
            this.submitting = false

            // Reset comment
            this.newComment.content = ''
            
            // this.deactivateWrite()

        },
    }
}
</script>

<style lang="scss" scoped>
@import '~@/_variables.scss';

.request-thread-flyin {
    ::v-deep {
        .flyin.placement-right {
            width: 400px;
            min-width: 0;
        }
    }
    .inner {
        height: 100%;
        padding: 16px 16px 64px;
        display: flex;
        flex-direction: column;
    }
    .comment-section {
        height: 100%;
        overflow-y: auto;
    }
}

</style>