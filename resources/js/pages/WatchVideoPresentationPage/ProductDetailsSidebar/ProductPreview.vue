<template>
    <div class="product-preview">
        <div id="preview-spawner">
            <div class="preview" ref="preview">
                <div class="header">
                    <span class="name">{{ product.name }}</span>
                </div>
                <div class="img-wrapper">
                    <BaseVariantImage :variant="product.variants[0]" size="sm" />
                    <div class="square white price sm">
                        <span>{{ product.yourPrice.wholesale_price }} {{ product.yourPrice.currency }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
    name: 'productPreview',
    computed: {
        ...mapGetters('videoPlayer', {
            product: 'getCurrentProduct',
        }),
    },
    watch: {
        product(newVal, oldVal) {
            if (!newVal) return
            if (!oldVal || newVal.id != oldVal.id) {
                // Make a copy of the old element and insert
                const container = document.getElementById('preview-spawner')
                const el = this.$refs.preview
                if (el) {
                    el.classList.add('hide')
                    // Wait for next tick to get the updated preview
                    this.$nextTick(() => {
                        const newClone = el.cloneNode(true)
                        newClone.classList.add('new-clone')
                        newClone.classList.remove('hide')
                        container.appendChild(newClone)
                        setTimeout(() => {
                            el.classList.remove('hide')
                            newClone.remove()
                        }, 200)
                    })
                }
            }
        },
    },
}
</script>

<style scoped lang="scss">
@import '~@/_variables.scss';

.preview {
    display: inline-flex;
    flex-direction: column;
    background: white;
    margin-top: 8px;
    margin-left: 16px;
    border-radius: 4px;
    animation: 0.2s ease-out flyin;
    width: 120px;
    border: solid 1px white;
    box-shadow: $shadowElHard;
    position: relative;
    cursor: pointer;
    overflow: hidden;
    z-index: 1;
    &.hide {
        visibility: hidden;
    }
    // animation-iteration-count: 1;
    &.old-clone,
    &.new-clone {
        position: absolute;
        top: 0;
        left: 0;
    }
    &.old-clone {
        animation: none;
    }
    .header {
        overflow: hidden;
        padding: 4px 6px;
        height: 32px;
        display: flex;
        align-items: center;
    }
    .name {
        font-weight: 700;
        display: block;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
    }
    .img-wrapper {
        position: relative;
        height: 0;
        padding-top: 133.3333%;
        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
            position: absolute;
            left: 0;
            top: 0;
        }
        .price {
            position: absolute;
            left: 8px;
            bottom: 8px;
            font-weight: 700;
            opacity: 0.9;
        }
    }
}
@keyframes flyin {
    from {
        transform: translateX(-100%);
    }
    to {
        transform: none;
    }
}
</style>
