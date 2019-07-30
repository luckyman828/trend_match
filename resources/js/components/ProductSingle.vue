<template>
    <div class="product-single card">
        <template v-if="Object.keys(product).length != 0">
            <div class="grid-2">
                <div>
                    <h3>{{product.title}}</h3>
                    <p>ID: {{product.id}}</p>
                    <h4>Ins: </h4>
                    <!-- <p v-for=""></p> -->
                    <h4>Outs: </h4>
                    <h4>Not decided: </h4>
                </div>
                <div class="comments">
                    <h4>Comments</h4>
                    <div class="card" v-for="comment in product.comments" :key="comment.id">
                        <div class="inline-children">
                            <p>{{comment.user.country.title}}</p>
                            <!-- <img v-bind:src="'/images/flag-' + comment.user.country.title + '.png'"> -->
                            <p>{{comment.comment}}</p>
                        </div>
                        <small>{{comment.user.email}}</small>
                    </div>
                    <form action="/images/">
                        <input type="text" name="comment" id="comment-input" placeholder="Write a comment..">
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
export default {
    name: 'productSingle',
    props: [
        'product',
        'loading',
        'authUser',
    ],
}
</script>

<style scoped lang="scss">

</style>
