<template>
    <div class="tab-list">
        <div class="tab-item flex-list flex-v xs" :class="{ active: cartView == 'ins' }" @click="onSetCartView('ins')">
            <span class="count">
                {{ actionGroups.ins.length }}
            </span>
            <span class="label">In</span>
        </div>
        <div
            class="tab-item flex-list flex-v xs"
            :class="{ active: cartView == 'outs' }"
            @click="onSetCartView('outs')"
        >
            <span class="count">
                {{ actionGroups.outs.length }}
            </span>
            <span class="label">Out</span>
        </div>
        <div class="tab-item flex-list flex-v xs" :class="{ active: cartView == 'nds' }" @click="onSetCartView('nds')">
            <span class="count">
                {{ actionGroups.nds.length }}
            </span>
            <span class="label">Not decided</span>
        </div>
        <div class="tab-item flex-list flex-v xs" :class="{ active: cartView == 'all' }" @click="onSetCartView('all')">
            <span class="count">
                {{ actionGroups.all.length }}
            </span>
            <span class="label">All</span>
        </div>
    </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
export default {
    name: 'tabList',
    props: ['cartView'],
    computed: {
        ...mapGetters('products', {
            products: 'products',
        }),
        actionGroups() {
            return {
                ins: this.products.filter(x => ['In', 'Focus'].includes(x.yourAction)),
                focus: this.products.filter(x => x.yourAction == 'Focus'),
                outs: this.products.filter(x => x.yourAction == 'Out'),
                nds: this.products.filter(x => x.yourAction == 'None'),
                all: this.products,
            }
        },
    },
    methods: {
        onSetCartView(newView) {
            this.$emit('update:cartView', newView)
        },
    },
}
</script>

<style lang="scss" scoped>
@import '~@/_variables.scss';
.tab-list {
    display: flex;
    width: 100%;
    box-shadow: $shadowModule;
    border-top: $borderModule;
    > * {
        width: 25%;
    }
    .tab-item {
        justify-content: center;
        align-items: center;
        text-align: center;
        padding: 8px 0 4px;
        background: $grey400;
        border-bottom: solid 4px $grey400;
        cursor: pointer;
        .count {
            font-size: 12px;
            font-weight: 500;
        }
        .label {
            font-size: 11px;
            font-weight: 500;
            color: $fontSoft;
        }
        &.active {
            background: white;
            border-color: $primary;
            cursor: default;
            .label {
                color: $font;
            }
        }
    }
}
</style>
