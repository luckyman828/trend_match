<template>
    <div class="changelog-post">
        <div class="featured-img-wrapper" v-if="featuredImgUrl">
            <img :src="featuredImgUrl" alt="featured-image">
        </div>
        <div class="body">
            <h2 class="title">{{title}}</h2>
            <p>Here are some items we have released recently:</p>
            <ul>
                <li>Item 1</li>
                <li>Item 2</li>
                <li>Item 3</li>
            </ul>
        </div>
    </div>
</template>

<script>
export default {
    name: 'changelogPost',
    props: [
        'featuredImgUrl',
        'title',
    ]
}
</script>

<style lang="scss" scoped>
@import '~@/_variables.scss';

.changelog-post {
    background: white;
    border: $borderModule;
    border-radius: $borderRadiusModule;
    overflow: hidden;
    max-width: 680px;
    margin: auto;
    margin-bottom: 60px;
    .featured-img-wrapper {
        // background: $grey400;
        background: $primary;
        height: 300px;
        display: flex;
        justify-content: center;
        align-items: center;
        img {
            height: 80%;
            width: 80%;
            object-fit: contain;
            object-position: center;
        }
    }
    .body {
        padding: 32px;
        .title {
            font-size: 40px;
            font-weight: 500;
        }
    }
}

</style>