<template>
    <div class="chat-input">
        <div class="overlay" @click="$emit('close')" />
        <div class="input-area" :style="inputStyle" :class="{ 'is-visible': viewportHeight }">
            <BaseInputTextArea
                v-model="newComment.content"
                ref="input"
                type="text"
                placeholder="Add your comment.."
                @blur="onBlur"
            />

            <BaseButton
                class="submit"
                ref="submit"
                :disabled="newComment.content.length <= 0"
                buttonClass="primary circle md"
                @click="onSubmit"
            >
                <i class="fas fa-paper-plane"></i>
            </BaseButton>
        </div>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
    name: 'chatInputArea',
    data: function() {
        return {
            newComment: {
                id: null,
                content: '',
                user: null,
            },
            viewportHeight: null,
            preventClose: false,
        }
    },
    computed: {
        ...mapGetters('auth', ['authUser']),
        ...mapGetters('videoPresentation', {
            video: 'getCurrentVideo',
        }),
        inputStyle() {
            if (!this.viewportHeight) return
            return {
                transform: `translateY(calc(${this.viewportHeight}px - 100%))`,
                opacity: 1,
            }
        },
    },
    methods: {
        ...mapActions('videoComments', ['insertVideoComment']),
        onBlur(e) {
            if (!e.relatedTarget == this.$refs.submit) this.$emit('close')
        },
        async onSubmit() {
            if (this.newComment.content.length <= 0) return
            this.newComment.user = this.authUser
            this.insertVideoComment({ video: this.video, newComment: this.newComment })
            this.$emit('submit')
            this.$emit('close')
        },
    },
    mounted() {
        this.$refs.input.focus()
        this.$refs.input.select()
        setTimeout(() => {
            this.viewportHeight = window.visualViewport.height
            // alert(`widnow height: ${this.viewportHeight}`)
            // this.$refs.input.$el.style.height = `${window.innerHeight}px`
            // this.$refs.input.$el
        }, 150)
    },
}
</script>

<style lang="scss" scoped>
.chat-input {
    position: absolute;
    z-index: 9;
    top: 0;
    left: 0;
    width: 100%;
    .overlay {
        display: block;
        z-index: 0;
    }
    .input-area {
        // transition: transform 0.2s ease-out;
        position: relative;
        // visibility: hidden;
        opacity: 0;
        .submit {
            position: absolute;
            right: 12px;
            top: 12px;
            i {
                margin-left: 4px;
            }
            &.disabled {
                pointer-events: none;
            }
        }
    }
    ::v-deep {
        textarea {
            font-size: 16px;
            min-height: 60px;
            padding-right: 64px;
        }
    }
}
</style>
