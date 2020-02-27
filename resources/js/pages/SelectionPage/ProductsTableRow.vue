<template>
    <tr class="products-table-row" :class="product.currentAction && 'action-'+ product.currentAction.action">

        <span v-if="product.newComment" class="circle tiny primary"></span>
        
        <td class="select" 
        @click.self="$refs.selectCheckbox.check()">
            <BaseCheckbox ref="selectCheckbox" :value="product" :modelValue="localSelectedProducts" v-model="localSelectedProducts"/>
        </td>
        <td class="image clickable" @click="$emit('onViewSingle',product)">
            <div class="img-wrapper">
                <img v-if="product.variants[0] != null" :src="variantImage(product.variants[0])">
            </div>
        </td>
        <td class="id clickable" @click="$emit('onViewSingle',product)">{{product.datasource_id}}</td>
        <td class="title clickable" @click="$emit('onViewSingle',product)"><span>{{product.title}}</span></td>
        
        <v-popover class="focus" :disabled="product.focus.length <= 0">
            <td class="focus tooltip-target">
                <button class="ghost sm"><span>{{product.focus.length}}</span><i class="far fa-star"></i></button>
            </td>
            <template slot="popover">
                <BaseTooltipList header="Focus">
                    <BaseTooltipListItem v-for="(action, index) in product.focus" :key="index"
                    :label="action.selection_name" :value="action.user_name"/>
                </BaseTooltipList>
            </template>
        </v-popover>
        <v-popover class="in" :disabled="product.ins.length <= 0">
            <td class="in tooltip-target">
                <button class="ghost sm"><span>{{product.ins.length}}</span><i class="far fa-heart"></i></button>
            </td>
            <template slot="popover">
                <BaseTooltipList header="Ins">
                    <BaseTooltipListItem v-for="(action, index) in product.ins" :key="index"
                    :label="action.selection_name" :value="action.user_name"/>
                </BaseTooltipList>
            </template>
        </v-popover>
        <v-popover class="out" :disabled="product.outs.length <= 0">
            <td class="out tooltip-target">
                <button class="ghost sm"><span>{{product.outs.length}}</span><i class="far fa-times-circle"></i></button>
            </td>
            <template slot="popover">
                <BaseTooltipList header="Outs">
                    <BaseTooltipListItem v-for="(action, index) in product.outs" :key="index"
                    :label="action.selection_name" :value="action.user_name"/>
                </BaseTooltipList>
            </template>
        </v-popover>
        <v-popover class="nd" :disabled="product.nds.length <= 0">
            <td class="nd tooltip-target">
                <button class="ghost sm"><span>{{product.nds.length}}</span></button>
            </td>
            <template slot="popover">
                <BaseTooltipList header="Not decided">
                    <BaseTooltipListItem v-for="(user, index) in product.nds" :key="index"
                    :label="user.selection_name" :value="user.name"/>
                </BaseTooltipList>
            </template>
        </v-popover>

        <td class="requests">
            <button class="ghost sm" @click="$emit('onViewSingle',product)">
                <span>{{product.comments.length}}</span><i class="far fa-comment"></i>
            </button>
            <button class="ghost sm" @click="$emit('onViewSingle',product)">
                <span>{{product.requests.length}}</span><i class="far fa-clipboard-check"></i>
            </button>
        </td>
        <td class="action">
            <button :class="product.your_feedback != 'Focus' ? 'ghost': 'primary'" 
            @click="onUpdateAction(product, 'Focus')">
                <i class="far fa-star"></i>
            </button>
            <button :class="product.your_feedback != 'In' ? 'ghost': 'green'" 
            @click="onUpdateAction(product, 'In')">
                <i class="far fa-heart"></i>
                <span>In</span>
            </button>
            <button :class="product.your_feedback != 'Out' ? 'ghost': 'red'" 
            @click="onUpdateAction(product, 'Out')">
                <i class="far fa-times-circle"></i>
                <span>out</span>
            </button>
            <button class="invisible ghost-hover" 
            @click="$emit('onViewSingle',product)"><span>View</span></button>
        </td>

    </tr>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
// Mixins
import variantImage from '../../mixins/variantImage'

export default {
    name: 'productsRow',
    props: [
        'product',
        'selectedProducts'
    ],
    mixins: [
        variantImage
    ],
    computed: {
        localSelectedProducts: {
            get() { return this.selectedProducts },
            set(localSelectedProducts) {this.$emit('input', localSelectedProducts)}
        }
    },
    methods: {
        onUpdateAction(product, action) {
            this.$emit('updateAction', product, action)
        },
    },
}
</script>

<style scoped lang="scss">
    @import '~@/_variables.scss';
    .products-table-row {
        height: 76px;
        .circle.tiny {
            margin-left: 8px;
        }
        &.action-1 {
            box-shadow: 4px 0 $green inset
        }
        &.action-0 {
            box-shadow: 4px 0 $red inset
        }
        .img-wrapper {
            border: solid 1px $light2;
            height: 60px;
            width: 48px;
            img {
                width: 100%;
                height: 100%;
                object-fit: contain;
            }
        }
    }
</style>