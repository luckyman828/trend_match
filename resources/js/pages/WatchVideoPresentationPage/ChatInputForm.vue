<template>
    <div class="chat-form" :class="{ 'has-focus': inputHasFocus }">
        <i class="far fa-comment chat-icon md dark"></i>
        <BaseTextarea
            ref="inputField"
            v-model="newComment.content"
            placeholder="Press ENTER to start typing"
            class="input-wrapper multiline"
            :hasFocus.sync="inputHasFocus"
            @keydown.exact.enter.native="onSubmit"
            @keydown.enter.exact.native.prevent
            @keydown.native.escape="onCancel"
        />
        <button class="dark sm pill" @click="onSubmit">
            <i class="far fa-paper-plane"></i>
            <span>Send</span>
        </button>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
    name: 'chatInputForm',
    data: function() {
        return {
            newComment: null,
            inputHasFocus: false,
        }
    },
    computed: {
        ...mapGetters('auth', ['authUser']),
        ...mapGetters('videoPresentation', {
            video: 'getCurrentVideo',
        }),
    },
    methods: {
        ...mapActions('videoComments', ['insertVideoComment']),
        resetNewComment() {
            this.newComment = {
                id: null,
                content: '',
                user: this.authUser,
            }
        },
        async onSubmit() {
            if (this.newComment.content.length <= 0) return
            await this.insertVideoComment({ video: this.video, newComment: this.newComment })
            this.$emit('submit')
            this.resetNewComment()
        },
        onCancel(e) {
            e.preventDefault()
            document.activeElement.blur()
        },
        keydownHandler(e) {
            if (e.target.type == 'textarea' || e.target.tagName.toUpperCase() == 'INPUT') return
            if (e.code == 'Enter') {
                e.preventDefault()
                this.$refs.inputField.focus()
            }
        },
    },
    created() {
        this.resetNewComment()
        document.addEventListener('keydown', this.keydownHandler)
    },
    destroyed() {
        document.removeEventListener('keydown', this.keydownHandler)
    },
}
</script>

<style lang="scss" scoped>
@import '~@/_variables.scss';
.chat-form {
    position: relative;
    overflow: hidden;
    width: 260px;
    .chat-icon {
        position: absolute;
        left: 12px;
        top: 50%;
        transform: translateY(-50%);
        z-index: 1;
        transition: transform 0.1s ease-out, opacity 0.1s ease-out;
    }
    button {
        position: absolute;
        right: 6px;
        z-index: 1;
        top: 50%;
        transition: transform 0.1s ease-out, opacity 0.1s ease-out;
        transform: translateY(-50%) translateX(100%);
        opacity: 0;
    }
    &.has-focus {
        .chat-icon {
            transform: translateY(-50%) translateX(-24px);
            opacity: 0;
        }
        button {
            transform: translateY(-50%);
            opacity: 1;
        }
        .input-wrapper {
            padding-left: 16px;
            padding-right: 80px;
        }
    }
    .input-wrapper {
        border-radius: 16px;
        min-height: 0;
        transition: padding-left 0.1s ease-out, padding-right 0.1s ease-out;
        padding-left: 40px;
        font-size: 12px;
        font-weight: 500;
        &::placeholder {
            // font-size: 12px;
            // font-weight: 500;
            color: $grey700;
        }
        &.empty {
            line-height: 14px;
        }
    }
}
</style>
