<template>
    <div class="changelog-post">
        <div class="featured-img-wrapper" v-if="featuredImgUrl">
            <img :src="featuredImgUrl" alt="featured-image" />
        </div>
        <div class="body">
            <h2 class="title" v-html="title" />
            <span class="date" v-html="date" />

            <div class="lead">
                <slot name="lead" />
            </div>
            <slot name="body" />

            <div v-if="$scopedSlots.signoff" class="signoff">
                <p class="author">Kind regards:</p>
                <div class="portrait-list">
                    <slot name="signoff" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'changelogPost',
    props: ['featuredImgUrl', 'title', 'date'],
}
</script>

<style lang="scss" scoped>
@import '~@/_variables.scss';

.changelog-post {
    background: white;
    border: $borderModule;
    border-radius: $borderRadiusModule;
    box-shadow: $shadowModule;
    overflow: hidden;
    max-width: 680px;
    margin: auto;
    margin-bottom: 60px;
    .featured-img-wrapper {
        // background: $grey400;
        // background: $primary;
        height: 300px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-bottom: $borderModule;
        border-width: 2px;
        img {
            height: 80%;
            width: 80%;
            object-fit: contain;
            object-position: center;
        }
    }
    .body {
        padding: 0 68px 60px 40px;
        .title {
            font-size: 52px;
            font-weight: 500;
        }
        .date {
            font-size: 20px;
            font-weight: 400;
            color: $fontSoft;
            margin-top: -4px;
            margin-bottom: 20px;
            display: block;
        }
        .lead {
            font-weight: 500;
            font-weight: 16px;
        }
        h2 {
            font-size: 32px;
            margin-top: 64px;
        }
        h3 {
            font-size: 20px;
        }
        h4 {
            margin-bottom: 12px;
            margin-top: 32px;
            font-size: 16px;
        }
        p:not(:last-child) {
            margin-bottom: 20px;
        }
        ul {
            padding-left: 24px;
            li {
                margin-bottom: 16px;
            }
        }
    }
    .signoff {
        margin-top: 32px;
        padding-top: 12px;
        border-top: $borderModule;
        .author {
            margin: 0;
            font-size: 12px;
            font-style: italic;
        }
        .portrait-list {
            display: flex;
        }
    }
}
</style>
