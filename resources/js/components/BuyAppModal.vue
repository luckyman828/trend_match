<template>
    <BaseModal :show="show" @close="$emit('close')" classes="min">
        <div class="buy-app-modal" v-if="app">
            <div class="flex-list center-h flex-v">
                <div class="flex-list flex-v lh-xs space-sm center-h">
                    <div class="ft-16 ft-bd">
                        Unlock Kollekt <span style="text-transform: uppercase;">{{ app.name }}</span> today
                    </div>
                    <div class="ft-12 color-grey ft-md">
                        Contact our sales department
                    </div>
                </div>
            </div>
            <div class="card card-md flex-list center-h flex-v">
                <BaseImageSizer class="logo-wrapper" aspect="1:1">
                    <img :src="app.logo.colorOnWhite" />
                </BaseImageSizer>
                <div class="name ft-16 ft-bd">
                    Kollekt <span style="text-transform: uppercase;">{{ app.name }}</span>
                </div>
                <a href="tel:+4523381938" class="pill secondary"><span>+45 23 38 19 38</span></a>
                <a href="mailto:sales@kollekt.dk" class="pill white no-bg ghost-hover"><span>sales@kollekt.dk</span></a>
            </div>
        </div>
    </BaseModal>
</template>

<script>
export default {
    name: 'buyAppModal',
    props: ['app', 'show'],
}
</script>

<style lang="scss" scoped>
@import '~@/_variables.scss';
.buy-app-modal {
    padding-top: 24px;
    .logo-wrapper {
        width: 64px;
        margin-top: 12px;
    }
    .name {
        margin-top: 28px;
    }
    .pill.secondary {
        margin-top: 20px;
    }
    .card {
        background: $dark;
        margin-top: 20px;
        width: 248px;
        height: 248px;
        color: white;
    }
}
</style>
