<template>
    <div class="variant-rail">
        <div class="rail">
            <div
                class="variant-list-item"
                v-for="variant in product.variants"
                :key="variant.id"
                :class="{ 'is-current': variant.id == currentVariant.id }"
                @click="$emit('show-variant', variant)"
            >
                <div class="name">
                    <span>{{ variant.name }}</span>
                </div>
                <div class="img-wrapper">
                    <BaseVariantImage
                        class="variant-image"
                        :variant="variant"
                        size="sm"
                        :class="{ 'sold-out': !variant.inStock }"
                    />
                    <div class="labels">
                        <button class="pill red xs" v-if="!variant.inStock">
                            <span>Sold out</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'variantRail',
    props: ['product', 'currentVariant'],
}
</script>

<style lang="scss" scoped>
.variant-rail {
    .rail {
        display: flex;
        overflow-x: auto;
        padding-bottom: 8px;
        margin-bottom: -8px;
        width: 100%;
        .variant-list-item {
            border-radius: 4px;
            border: $borderElSoft;
            overflow: hidden;
            margin-right: 8px;
            width: 94px;
            min-width: 94px;
            .name {
                padding: 2px 8px;
                font-size: 12px;
                font-weight: 500;
                span {
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    display: block;
                    overflow: hidden;
                }
            }
            &.is-current {
                background: $primary;
                border: solid $primary 2px;
                .name {
                    color: white;
                }
            }
        }
        .img-wrapper {
            position: relative;
            width: 100%;
            flex: 1 0 auto;
            height: 0;
            padding-top: 133.3333%;
            background: $grey300;
            .variant-image {
                object-fit: cover;
                width: 100%;
                height: 100%;
                position: absolute;
                left: 0;
                top: 0;
            }
        }
        &::after {
            content: '';
            height: 1px;
            width: 16px;
            display: block;
        }
    }
    .labels {
        position: absolute;
        bottom: 4px;
        left: 4px;
    }
    img.sold-out {
        opacity: 0.5;
    }
}
</style>
