<template>
    <div class="changelog-post">
        <div class="featured-img-wrapper" v-if="featuredImgUrl">
            <img :src="featuredImgUrl" alt="featured-image">
        </div>
        <div class="body">
            <h2 class="title">{{title}}</h2>

            <h3>Notes</h3>
            <p>
                We have made changes to multiple core areas of Kollekt. 
                The filtering options have been vastly improved which enables you to create customized exports.
                It's now finally possible to have multiple selections in individual presentations!
            </p>
            <p>
                See the list below for the things we’ve been working on for the last month. 
                In addition to the things you see here, there are bug fixes and refactoring 
                (a fancy word for developer housekeeping).
            </p>
            
            <h4>Advanced filters</h4>
            <p>
                We have included the option to use operators (> greater than, &lt; less than, = equal to, and != not equal to) on multiple parameters. 
                This enables you to make custom PDF and .CSV reports and customize your view when going through your collection in Kollekt.
            </p>

            <h4>Selection input filter</h4>
            <p>
                Choose relevant selections you want to view input from when making decisions. 
                This is also powerful for your .CSV and PDF exports.
            </p>

            <h4>Box size on product detail page</h4>
            <p>
                Box size is now shown under assortment data.
            </p>

            <h4>Clear presentation queue button</h4>
            <p>
                One button to clear your entire presentation queue.
            </p>

            <h4>Improved "create users"</h4>
            <p>
                We have made it more obvious when a user already exists on a workspace and improved the error message, when the email is in the wrong format.
            </p>

            <h4>Export focus styles</h4>
            <p>
                It is now possible to only export styles marked with Focus due to the added “Advanced Filter” option.
            </p>

            <h4>Edit product save</h4>
            <p>
                Pressing save for each field will now also save changes to the product. This should make it easier to get your data saved.
            </p>

            <h4>Allow any selection to be presenting</h4>
            <p>
                All selections can now enter presentation mode individually. 
                Note that if a parent of a selection enters presentation mode, this will take priority, and broadcast for all children.
            </p>

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
        h4 {
            margin-bottom: 12px;
            margin-top: 32px;
        }
    }
}

</style>