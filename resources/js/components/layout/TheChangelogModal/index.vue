<template>
    <BaseModal :show="show" @close="SHOW_CHANGELOG(false)"
    header="What's new?" 
    classes="full-body">

        <ChangelogPost 
            title="Cashmere"
            date="Late August 2020 Release"
            featuredImgUrl="/images/blog/undraw_coolness_dtmq (1).svg"
            singoff="Michael & David"
        >

            <template v-slot:lead>
                <p>
                    Say hello to Cashmere, our first named new major release. What better fit than to name our releases after types of fabric?
                </p>
                <p>
                    Cashmere brings the much requested feature; multiple images per variant, as well as laying the foundation for extremely powerful workflows surrounding buyer-inclusion.
                </p>
                <p>Dig in below to see what you can find in the Kollekt dashboard and app now.</p>
            </template>

            <template v-slot:body>
                <h3>New features</h3>

                <h4>Threads on Requests + multiple master requests</h4>
                <p>
                    The request system has been upgraded. It is now possible to add multiple requests when in a master selection and requests can be marked as open (default) or resolved. This works with the new ability to comment on a specific request (thread).
                    <br>
                    All open/unresolved requests will be shown in the new tab “tickets” on overview.
                    <br>
                    We hope this enables you to track progress on requests and provide a better overview of your tasks. 
                </p>

                <h4>Multiple images pr. variant</h4>
                <p>
                    Both dashboard and app now support multiple images for each variant. 
                    No more hacks to have multiple images for a single variant - you can keep all variant-specific info on just one variant now. 
                    <br>To get multiple images per variant for your selections, simply upload CSV files that have multiple images for each variant and Kollekt will do the rest. 
                    You can also add additional images manually when editing your products.


                </p>

                <h4>Quantity as feedback</h4>
                <p>
                    Last release added the ability to enter a quantity for each variant, when doing alignment. Now you will also have access to this feature, when doing feedback.
                    <br>To start collecting quantity input, all you need to do is add a budget for your selections.
                    <br>Quantity feedback mode will automatically calculate your spend for each selection, to better help you reach your budget targets.

                </p>

                <h4>Advanced filter: selection filter</h4>
                <p>
                    The advanced features now allow selection-based filtering. Advanced filters come in 2 forms. Product filters, and user/selection filters. 
                </p>
                <p><strong>Product filters</strong>: Filter by product data, like price, number of comments, OUTs, etc.</p>
                <p><strong>User/Selection filters</strong>: Filter by a user or selections input. For instance, use it to show only products where your selection has authored requests, a certain user has said “IN”, and much more.</p>

                <h4>Allow sub-masters</h4>
                <p>
                    This is the first step towards adding “phases” to a files feedback process. 
                    The goal is for Kollekt to be able to handle Handovers and Sales Meetings seamlessly,
                    sharing relevant information between the two and keeping them always in-sync. 
                </p>


                <h3>Fixes</h3>
                <ul>
                    <li>Number of products listed in table with active filter was showing the wrong number</li>
                    <li>Scrolling with the advanced filters window open caused a visual bug</li>
                    <li>Newly created users did not show up in the table without a page refresh</li>
                    <li>Cloning selection setup from another file caused mixed selection settings</li>
                    <li>Deleting multiple teams at once would not delete all teams</li>
                </ul>

            </template>

            <template v-slot:signoff>
                <SignoffPortrait
                    imageUrl="/images/team/Michael-Laugesen-Trendmatch (Thumbnail).png"
                    name="Michael"
                    title="Co-founder & Design lead"
                />
                <SignoffPortrait
                    imageUrl="/images/team/David-Grady-Trendmatch (Thumbnail).png"
                    name="David"
                    title="Co-founder & Web dev"
                />
            </template>
            
        </ChangelogPost>

        <ChangelogPost 
            title="Canvas"
            date="August 2020 Release"
            featuredImgUrl="/images/blog/undraw_Gift_box_re_vau4.svg"
        >
            <template v-slot:body>
                <h3>Notes</h3>
                <p>
                    We have made changes to multiple core areas of Kollekt. <br>
                    The filtering options have been vastly improved which enables you to create customized exports.<br>
                    It's now finally possible to have multiple selections in individual presentations!
                </p>
                <p>
                    See the list below for the things we’ve been working on for the last month.<br>
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
                    Choose relevant selections you want to view input from when making decisions.<br>
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
                    All selections can now enter presentation mode individually.<br>
                    Note that if a parent of a selection enters presentation mode, this will take priority, and broadcast for all children.
                </p>

                <h4>Change settings for multiple selections at once</h4>
                <p>
                    The selections table will now have select-boxes (checkboxes) next to the selection names.<br>
                    Any selected selection will have their settings updated, when you save new settings.
                </p>
            </template>

            <template v-slot:signoff>
                <SignoffPortrait
                    imageUrl="/images/team/Michael-Laugesen-Trendmatch (Thumbnail).png"
                    name="Michael"
                    title="Co-founder & Design lead"
                />
            </template>
        </ChangelogPost>
    </BaseModal>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import ChangelogPost from './ChangelogPost'
import SignoffPortrait from './SignoffPortrait'

export default {
    name: 'changelogModal',
    components: {
        ChangelogPost,
        SignoffPortrait,
    },
    computed: {
        ...mapGetters('changelog', {
            show: 'getShowChangelog'
        })
    },
    methods: {
        ...mapMutations('changelog', ['SHOW_CHANGELOG'])
    }
}
</script>

<style>

</style>