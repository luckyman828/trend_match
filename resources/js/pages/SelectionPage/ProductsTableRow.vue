<template>
    <tr class="products-table-row" :class="product.currentAction && 'action-'+ product.currentAction.action" tabindex="0"
    @keydown="hotkeyHandler($event)" @keyup="keypressHandler($event)" ref="row">

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
        <td class="title"><span class="clickable" @click="$emit('onViewSingle',product)">{{product.title}}</span></td>
        
        <v-popover class="focus" :disabled="product.focus.length <= 0" tabindex="-1">
            <td class="focus tooltip-target">
                <button tabindex="-1" class="ghost sm"><span>{{product.focus.length}}</span><i class="far fa-star"></i></button>
            </td>
            <template slot="popover">
                <BaseTooltipList header="Focus">
                    <BaseTooltipListItem v-for="(action, index) in product.focus" :key="index"
                    :label="action.selection_name" :value="action.user.name"/>
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
                    :label="action.selection_name" :value="action.user.name"/>
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
                    :label="action.selection_name" :value="action.user.name"/>
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
            <button :class="product[currentAction] != 'Focus' ? 'ghost': 'primary'" 
            @click="onUpdateAction(product, 'Focus')">
                <i class="far fa-star"></i>
            </button>
            <button :class="product[currentAction] != 'In' ? 'ghost': 'green'" 
            @click="onUpdateAction(product, 'In')">
                <i class="far fa-heart"></i>
                <span>In</span>
            </button>
            <button :class="product[currentAction] != 'Out' ? 'ghost': 'red'" 
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
        'selectedProducts',
        'selection',
        'currentAction',
        'index',
    ],
    mixins: [
        variantImage
    ],
    computed: {
        ...mapGetters('selections', ['currentSelectionMode']),
        ...mapGetters('products', ['currentFocusIndex']),
        localSelectedProducts: {
            get() { return this.selectedProducts },
            set(localSelectedProducts) {this.$emit('input', localSelectedProducts)}
        },
    },
    watch: {
        // Watch for changes to the current focus index 
        currentFocusIndex: function(newVal, oldVal) {
            // console.log(newVal)
            if (newVal == this.index) {
                // console.log('focus this row')
                // console.log(this.$refs.row)
                // console.log(this.$refs.row.$el)
                this.$refs.row.focus()
            }
        }
    },
    methods: {
        ...mapMutations('products', ['setCurrentFocusIndex']),
        onUpdateAction(product, action) {
            this.$emit('updateAction', product, action)
        },
        focusNextRow(event) {
            // Get the next row
            event.preventDefault()
            this.setCurrentFocusIndex(this.index+1)
        },
        focusPrevRow(event) {
            // Get the previous row
            event.preventDefault()
            this.setCurrentFocusIndex(this.index-1)
        },
        hotkeyHandler(event) {
            const key = event.code
            if (key == 'Tab') {
                if (event.shiftKey) {
                    this.focusPrevRow(event)
                } else {
                    this.focusNextRow(event)
                }
            }
            if (key == 'ArrowLeft')
                this.focusPrevRow(event)
            if (key == 'ArrowRight')
                this.focusNextRow(event)
            if (key == 'Enter') {
                this.$emit('onViewSingle', this.product)
            }
        },
        keypressHandler(event) {
            const key = event.code
            if (key == 'KeyI')
                this.onUpdateAction(this.product, 'In')
            if (key == 'KeyO')
                this.onUpdateAction(this.product, 'Out')
            if (key == 'KeyF' || key == 'KeyU')
                this.onUpdateAction(this.product, 'Focus')
        }
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