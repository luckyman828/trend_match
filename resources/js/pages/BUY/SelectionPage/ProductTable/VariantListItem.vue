<template>
    <div class="variant-list-item ui-square flex-list justify space-md hover-shadow">
        <div :key="variant.id" class="square lg variant-color white" :style="imageBackground"></div>
        <div class="details-wrapper flex-list flex-v space-sm">
            <div class="name ft-12 ft-bd">
                {{ variant.name }}
            </div>
            <div class="flex-list">
                <div class="size-list flex-list">
                    <div
                        class="size-list-item ui-square white sm flex-list flex-v"
                        v-for="(sizeObj, index) in variant.sizes"
                        :key="index"
                    >
                        <div class="size-label ft-10">{{ sizeObj.size }}</div>
                        <div class="size-label ft-12 ft-bd">{{ sizeObj.quantity }}</div>
                    </div>
                </div>
                <div class="qty-wrapper">
                    <div class="square white qty">
                        <span>{{ variant.quantity ? variant.quantity : 0 }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import variantImage from '../../../../mixins/variantImage'
import { getVariantBackgroundStyle } from '../../../../helpers/dkcIntegration'

export default {
    name: 'variantListItem',
    props: ['variant'],
    mixins: [variantImage],
    computed: {
        imageBackground() {
            return getVariantBackgroundStyle(this.variant)
        },
    },
    methods: {},
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';
.variant-list-item {
    min-width: 164px;
    overflow: hidden;
    flex-shrink: 0;
    cursor: pointer;
    padding-bottom: 8px;
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
        height: 100%;
    }
    .variant-color {
        background-position: center;
        background-size: 400%;
        margin-top: 4px;
        height: 100%;
    }
    .size-list-item {
        opacity: 0.7;
        transition: width 0.1s ease-out, min-width 0.1s ease-out;
        flex-shrink: 0;
        &:focus-within {
            opacity: 1;
            min-width: 40px;
        }
        .size-label {
            width: 100%;
            text-align: center;
            pointer-events: none;
            text-overflow: ellipsis;
            overflow: hidden;
        }
        ::v-deep {
            input {
                padding-top: 12px;
                font-weight: 700;
                text-align: center;
                margin: auto;
            }
        }
    }
}
</style>
