<template>
    <BaseModal :show="show" @close="onCancel" :hideClose="true">
        <div class="flex-list flex-v space-md rename-modal">
            <div class="ft-20 ft-bd">Rename Presentation</div>
            <div class="flex-list space-md">
                <img :src="presentation.thumbnail" />
                <BaseInputField
                    class="lg"
                    ref="nameInput"
                    innerLabel="Presentation name"
                    v-model="presentation.name"
                    theme="light"
                    @submit="onSubmit"
                    @cancel="onCancel"
                />
            </div>
            <div class="action-list flex-list flex-end-h space-md">
                <button class="ghost pill" @click="onCancel">
                    <span>Cancel</span>
                </button>
                <button class="dark pill" @click="onSubmit">
                    <i class="far fa-check"></i>
                    <span>Save</span>
                </button>
            </div>
        </div>
    </BaseModal>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
    name: 'play.renamePresentationModal',
    props: ['show'],
    data() {
        return {
            oldName: '',
        }
    },
    computed: {
        ...mapGetters('playPresentation', {
            presentation: 'getPresentation',
        }),
    },
    watch: {
        show(isVisible) {
            if (isVisible) this.oldName = this.presentation.name
        },
    },
    methods: {
        ...mapActions('playPresentations', ['updatePresentationDetails']),
        close() {
            this.$emit('update:show', false)
        },
        onSubmit() {
            this.updatePresentationDetails(this.presentation)
            this.close()
        },
        onCancel() {
            this.presentation.name = this.oldName
            this.close()
        },
    },
    mounted() {
        this.$nextTick(() => {
            this.$refs.nameInput.focus()
        })
    },
    created() {
        this.oldName = this.presentation.name
    },
}
</script>

<style lang="scss" scoped>
@import '~@/_variables.scss';
.input-field {
    flex: 1;
}
img {
    width: 88px;
    height: 48px;
    object-fit: cover;
    object-position: center;
    border-radius: $borderRadiusSm;
    flex-shrink: 0;
    background: $themeLightBg;
}
</style>
