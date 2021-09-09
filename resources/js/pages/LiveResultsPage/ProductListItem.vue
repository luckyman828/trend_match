<template>
    <div class="product-list-item">
        <div class="index">{{ index + 1 }}</div>
        <div class="card flex-list md center-v theme-light">
            <div class="img-wrapper">
                <div class="img-sizer">
                    <BaseVariantImage :variant="product.variants[0]" size="sm" />
                </div>
            </div>
            <div class="details">
                <div class="name">{{ product.name }}</div>
                <div class="id">{{ product.datasource_id }}</div>
            </div>
            <div class="action-count ghost">
                <i v-if="actions.includes('Out')" class="fas fa-times-circle red"></i>
                <i v-else-if="actions.includes('Focus') && actions.length == 1" class="fas fa-star primary"></i>
                <i v-else-if="actions.includes('In')" class="fas fa-heart green"></i>
                <span>{{ actionCount }}</span>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'productListItem',
    props: ['product', 'index', 'actions', 'actionScope'],
    computed: {
        actionCount() {
            const selectionInput = this.product.getActiveSelectionInput
            if (!selectionInput) return 0
            return selectionInput[this.actionScope].filter(feedback => this.actions.includes(feedback.action)).length
        },
    },
}
</script>

<style lang="scss" scoped>
.product-list-item {
    padding-left: 20px;
    position: relative;
    &:not(:last-child) {
        margin-bottom: 8px;
    }
    .index {
        position: absolute;
        font-weight: 500;
        color: white;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
    }
    .card {
        border-radius: 4px;
        padding: 4px 8px;
        box-shadow: $shadowEl;
        .details {
            overflow: hidden;
            white-space: nowrap;
        }
        .name {
            font-weight: 700;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .img-wrapper {
            width: 40px;
            border-radius: 2px;
            // border: $borderEl;
            .img-sizer {
                width: 100%;
                height: 0;
                padding-top: 133.3333%;
                position: relative;
                img {
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 100%;
                    height: 100%;
                    object-fit: contain;
                }
            }
        }
        .action-count {
            margin-left: auto;
            white-space: nowrap;
        }
    }
}
</style>
