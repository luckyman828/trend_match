<template>
    <div class="variant-list-item ui-square flex-list justify space-md hover-shadow">
        <div class="details-wrapper flex-list flex-v">
            <div class="name ft-12 ft-bd">
                {{ variant.name }}
            </div>
            <div class="qty-wrapper">
                <div class="pill white xs qty">
                    <span>{{ variant.quantity ? variant.quantity : 0 }}</span>
                </div>
            </div>
        </div>
        <div
            :key="variant.id"
            class="square lg variant-color white"
            :style="{ backgroundImage: `url(${variantImage(variant, { size: 'sm' })})` }"
        ></div>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import variantImage from '../../../../mixins/variantImage'

export default {
    name: 'variantListItem',
    props: ['variant'],
    mixins: [variantImage],
    computed: {},
    methods: {},
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';
.variant-list-item {
    width: 164px;
    overflow: hidden;
    flex-shrink: 0;
    cursor: pointer;
    .details-wrapper {
        overflow: hidden;
    }
    .name {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
    .qty {
        min-width: 32px;
    }
    .variant-color {
        background-position: center;
        background-size: 400%;
        margin: -4px;
        margin-left: 0;
    }
}
</style>
