<template>
    <div class="product-single card">
        <template v-if="Object.keys(product).length != 0">
            <div class="grid-2">
                <h3>{{product.title}}</h3>
                <div class="grid-2">
                    <span class="button" @click="onCloseSingle()">Close</span>
                    <span class="button" @click="onNextSingle()" :class="[{ disabled: nextProductID < 0}]">Next product</span>
                </div>
            </div>
            <div class="grid-2">
                <div>
                    <p>ID: {{product.id}}</p>
                    <h4>Ins: {{product.ins.length}}</h4>
                    <p v-for="action in product.focus" :key="action.user_id">
                        <img v-bind:src="'/images/flags/flag-' + action.user.country.title + '.png'" style="display: inline">
                        <small>{{action.user.email}}</small>
                        <small>Focus</small>
                    </p>
                    <p v-for="action in product.ins" :key="action.user_id">
                        <img v-bind:src="'/images/flags/flag-' + action.user.country.title + '.png'" style="display: inline">
                        <small>{{action.user.email}}</small>
                    </p>
                    <h4>Outs: {{product.outs.length}}</h4>
                    <p v-for="action in product.outs" :key="action.user_id">
                        <img v-bind:src="'/images/flags/flag-' + action.user.country.title + '.png'" style="display: inline">
                        <small>{{action.user.email}}</small>
                    </p>
                    <h4>Not decided: {{product.nds.length}}</h4>
                    <p v-for="user in product.nds" :key="user.id">
                        <img v-bind:src="'/images/flags/flag-' + user.country.title + '.png'" style="display: inline">
                        <small>{{user.email}}</small>
                    </p>
                </div>
                <div class="comments">
                    <h4>Comments</h4>
                    <div class="card" v-for="comment in product.comments" :key="comment.id">
                        <div class="inline-children">
                            <img v-bind:src="'/images/flags/flag-' + comment.user.country.title + '.png'" style="display: inline">
                            <span>{{comment.comment}}</span>
                        </div>
                        <small>{{comment.user.email}},</small>
                        <small> important: {{comment.important}},</small>
                        <small> final: {{comment.final}}</small>
                    </div>
                    <form @submit="onSubmitComment">
                        <input type="text" name="comment" id="comment-input" placeholder="Write a comment.." v-model="comment.comment">
                        <label>Mark as important
                            <input type="checkbox" v-model="comment.important" name="comment-important">
                        </label>
                        <input type="submit" value="Submit comment">
                    </form>
                </div>
            </div>
        </template>
        <template v-else>
            
        </template>
    </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
    name: 'productSingle',
    props: [
        'product',
        'loading',
        'authUser',
        'nextProductID',
    ],
    data: function () { return {
            comment: {
                user_id: '',
                product_id: '',
                comment: '',
                important: false,
                final: false
            },
            user_id: this.authUser.id
    }},
    watch: {
        product: function (newVal, oldVal) {
            this.comment.product_id = newVal.id
        },
        authUser: function (newVal, oldVal) {
            this.comment.user_id = newVal.id
        },
    },
    methods: {
        ...mapActions('entities/comments', ['createComment']),
        onCloseSingle() {
            // Emit event to parent
            this.$emit('closeSingle', -1)
        },
        onSubmitComment(e) {
            e.preventDefault()
            this.createComment({comment: this.comment})
        },
        onNextSingle() {
            this.$emit('nextSingle')
        }
    }
}
</script>

<style scoped lang="scss">

</style>
