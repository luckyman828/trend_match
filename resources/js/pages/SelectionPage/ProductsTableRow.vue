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
                <img :key="product.id" v-if="product.variants[0] != null" :src="variantImage(product.variants[0])">
                <!-- <img v-if="product.variants[0] != null" :src="variantImage(product.variants[0])"> -->
            </div>
        </td>
        <td class="id clickable" @click="$emit('onViewSingle',product)">{{product.datasource_id}}</td>
        <td class="title"><span class="clickable" @click="$emit('onViewSingle',product)">
            <span v-tooltip="!!product.title && product.title.length > 24 && product.title">{{product.title | truncate(24)}}</span>
        </span></td>
        
        <!-- Start Distribution -->
        <v-popover class="focus" :disabled="product.focus.length <= 0 && product.alignmentFocus.length <= 0">
            <td class="focus tooltip-target">
                <button tabindex="-1" class="ghost sm"><span>{{product.alignmentFocus.length +product.focus.length}}</span><i class="far fa-star"></i></button>
            </td>
            <template slot="popover">
                <BaseTooltipList header="Focus Alignment" v-if="product.alignmentFocus.length > 0">
                    <BaseTooltipListItem v-for="(action, index) in product.alignmentFocus" :key="index"
                    :label="action.selection.name" :value="action.user ? action.user.name : 'Anonymous'"/>
                </BaseTooltipList>
                <BaseTooltipList header="Focus Feedback" v-if="product.focus.length > 0">
                    <BaseTooltipListItem v-for="(action, index) in product.focus" :key="index"
                    :label="action.selection.name" :value="action.user ? action.user.name : 'Anonymous'"/>
                </BaseTooltipList>
            </template>
        </v-popover>
        <v-popover class="ins" :disabled="product.ins.length <= 0 && product.alignmentIns.length <= 0">
            <td class="ins tooltip-target">
                <button class="ghost sm"><span>{{product.alignmentIns.length + product.ins.length}}</span><i class="far fa-heart"></i></button>
            </td>
            <template slot="popover">
                <BaseTooltipList header="Ins Alignment" v-if="product.alignmentIns.length > 0">
                    <BaseTooltipListItem v-for="(action, index) in product.alignmentIns" :key="index"
                    :label="action.selection.name" :value="action.user ? action.user.name : 'Anonymous'"/>
                </BaseTooltipList>
                <BaseTooltipList header="Ins Feedback" v-if="product.ins.length > 0">
                    <BaseTooltipListItem v-for="(action, index) in product.ins" :key="index"
                    :label="action.selection.name" :value="action.user ? action.user.name : 'Anonymous'"/>
                </BaseTooltipList>
            </template>
        </v-popover>
        <v-popover class="outs" :disabled="product.outs.length <= 0 && product.alignmentOuts.length <= 0">
            <td class="outs tooltip-target">
                <button class="ghost sm"><span>{{product.alignmentOuts.length + product.outs.length}}</span><i class="far fa-times-circle"></i></button>
            </td>
            <template slot="popover">
                <BaseTooltipList header="Outs Alignment" v-if="product.alignmentOuts.length > 0">
                    <BaseTooltipListItem v-for="(action, index) in product.alignmentOuts" :key="index"
                    :label="action.selection.name" :value="action.user ? action.user.name : 'Anonymous'"/>
                </BaseTooltipList>
                <BaseTooltipList header="Outs Feedback" v-if="product.outs.length > 0">
                    <BaseTooltipListItem v-for="(action, index) in product.outs" :key="index"
                    :label="action.selection.name" :value="action.user ? action.user.name : 'Anonymous'"/>
                </BaseTooltipList>
            </template>
        </v-popover>
        <v-popover class="nds" :disabled="product.nds.length <= 0 && product.alignmentNds <= 0">
            <td class="nds tooltip-target">
                <button class="ghost sm"><span>{{product.alignmentNds.length+ product.nds.length}}</span></button>
            </td>
            <template slot="popover">
                <BaseTooltipList header="ND Alignment" v-if="product.alignmentNds.length > 0">
                    <BaseTooltipListItem v-for="(action, index) in product.alignmentNds" :key="index"
                    :label="action.selection.name"/>
                </BaseTooltipList>
                <BaseTooltipList header="ND Feedback" v-if="product.nds.length > 0">
                    <BaseTooltipListItem v-for="(action, index) in product.nds" :key="index"
                    :label="action.selection.name" :value="action.user ? action.user.name : 'Anonymous'"/>
                </BaseTooltipList>
            </template>
        </v-popover>
        <!-- End Distribution -->

        <td class="requests">
            <button class="ghost sm" @click="$emit('onViewSingle',product)">
                <span>{{product.comments.length}}</span><i class="far fa-comment"></i>
            </button>
            <button class="requests-button ghost sm" @click="$emit('onViewSingle',product)">
                <span>{{product.requests.length}}</span><i class="far fa-clipboard-check"></i>
                <i v-if="product.hasAuthUserRequest" class="own-request fas fa-user-circle"></i>
            </button>
        </td>
        <td class="action">
            <BaseButton :buttonClass="product[currentAction] != 'Focus' ? 'ghost': 'primary'"
            :disabled="!userWriteAccess.actions.has_access" 
            v-tooltip="!userWriteAccess.actions.has_access && userWriteAccess.actions.msg"
            @click="onUpdateAction(product, 'Focus')">
                <i class="far fa-star"></i>
            </BaseButton>
            <BaseButton :buttonClass="product[currentAction] != 'In' ? 'ghost': 'green'" 
            :disabled="!userWriteAccess.actions.has_access" 
            v-tooltip="!userWriteAccess.actions.has_access && userWriteAccess.actions.msg"
            @click="onUpdateAction(product, 'In')">
                <i class="far fa-heart"></i>
                <span>In</span>
            </BaseButton>
            <BaseButton :buttonClass="product[currentAction] != 'Out' ? 'ghost': 'red'" 
            :disabled="!userWriteAccess.actions.has_access" 
            v-tooltip="!userWriteAccess.actions.has_access && userWriteAccess.actions.msg"
            @click="onUpdateAction(product, 'Out')">
                <i class="far fa-times-circle"></i>
                <span>out</span>
            </BaseButton>
            <button class="invisible ghost-hover primary" 
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
        variantImage,
    ],
    filters: {
        truncate: function(text, length) {
            const clamp = '...'
            var node = document.createElement('div')
            node.innerHTML = text
            var content = node.textContent
            // return `<span>124</span>`
            return content.length > length ? content.slice(0, length) + clamp : content
        }
    },
    computed: {
        ...mapGetters('selections', ['currentSelectionMode', 'getAuthUserSelectionWriteAccess']),
        ...mapGetters('products', ['currentFocusIndex']),
        userWriteAccess () {
            return this.getAuthUserSelectionWriteAccess(this.selection)
        },
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
                document.activeElement.blur()
                this.$emit('onViewSingle', this.product)
            }
        },
        keypressHandler(event) {
            const key = event.code
            if (this.currentSelectionMode != 'Approval') {
                if (key == 'KeyI')
                    this.onUpdateAction(this.product, 'In')
                if (key == 'KeyO')
                    this.onUpdateAction(this.product, 'Out')
                if (key == 'KeyF' || key == 'KeyU')
                    this.onUpdateAction(this.product, 'Focus')
            }
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
    .requests-button {
        position: relative;
        .own-request {
            position: absolute;
            right: -10px;
            bottom: -8px;
            color:  $primary;
            border-radius: 20px;
            font-size: 16px;
            &::before {
                background: white;
                border-radius: 20px;
            }
        }
    }
</style>