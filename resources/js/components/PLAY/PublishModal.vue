<template>
    <BaseModal :show="show" @close="$emit('update:show', false)" :hideClose="true" :header="presentation.name">
        <div class="flex-list flex-v space-md rename-modal">
            <div class="ft-20 ft-bd">Share presentation</div>
            <!-- <BaseInputField class="lg" innerLabel="Direct link" v-model="presentation.name" theme="light" type="copy">
                <button class="pill white">
                    <i class="far fa-copy"></i>
                    <span>Copy link</span>
                </button>
            </BaseInputField> -->
            <BaseDropdownInputField
                type="radio"
                innerLabel="Presentation locale"
                v-model="selectedLocale"
                :options="allLocales"
                :unsetOption="'No locale'"
                :unsetValue="null"
                placeholder="Select Locale"
            />

            <BaseInputField
                class="lg"
                innerLabel="Open presenation attribute"
                :value="
                    `data-kollekt-play-id=&quot;${presentation.id}&quot;${
                        selectedLocale ? ` data-kollekt-play-locale=&quot;${selectedLocale}&quot;` : ''
                    }`
                "
                theme="light"
                type="copy"
            >
                <button class="pill white">
                    <i class="far fa-copy"></i>
                    <span>Copy</span>
                </button>
            </BaseInputField>
            <div class="ft-12 ft-md color-grey">
                Add this attribute to any HTML element you would like to trigger showing this presentation on your
                website.
            </div>
            <!-- <div class="embed-section">
                <div class="ft-14 ft-bd">Embed this presentation</div>
                <BaseInputField
                    class="lg"
                    innerLabel="Embed link"
                    :value="
                        `<iframe style=&quot;display: block; height: 100%; width: 100%; min-height: 300px; min-width: 400px; border: none; outline: none;&quot; src=&quot;https://kollekt_feature.test/#/play/watch/${presentation.id}&quot;></iframe>`
                    "
                    theme="light"
                    type="copy"
                >
                    <button class="pill white">
                        <i class="far fa-copy"></i>
                        <span>Copy</span>
                    </button>
                </BaseInputField>
            </div> -->
            <div class="script-section">
                <div class="ft-14 ft-bd">Embed script</div>
                <div class="ft-12 ft-md color-grey">
                    Make sure you have this script included on your site, to enable PLAY to interact with your website.
                </div>
                <BaseInputField
                    class="lg"
                    innerLabel="Embed link"
                    :value="`<script src=&quot;${origin}/js/play-dkc.js&quot;></script>`"
                    theme="light"
                    type="copy"
                >
                    <button class="pill white">
                        <i class="far fa-copy"></i>
                        <span>Copy</span>
                    </button>
                </BaseInputField>
            </div>
        </div>
    </BaseModal>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
    name: 'play.pulishModal',
    props: ['show'],
    data() {
        return {
            selectedLocale: null,
            allLocales: ['da-dk', 'de-ch', 'de-de', 'en-en', 'en-eu', 'nl-be', 'nl-nl', 'sv-se'],
        }
    },
    computed: {
        ...mapGetters('playPresentation', {
            presentation: 'getPresentation',
        }),
        origin() {
            return window.origin
        },
    },
    methods: {},
}
</script>

<style lang="scss" scoped>
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
