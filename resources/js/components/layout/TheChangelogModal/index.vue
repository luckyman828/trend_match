<template>
    <BaseModal :show="show" @close="SHOW_CHANGELOG(false)"
    header="What's new?" 
    classes="full-body">

        <ChangelogPost 
                title="Cotton: Alice blue"
                date="Early October Release"
                featuredImgUrl="/images/blog/undraw_Done_checking_re_6vyx.svg"
            >
            <template v-slot:lead>
                <p>We are ready with another improvement to the new ticket workflow, thanks to your continued feedback.</p>
                <p>This release allows any selection to make tickets - if you give them permission.</p>
            </template>

            <template v-slot:body>
                <h3>New features</h3>

                <h4>Tickets from sub-selections</h4>
                <p>Any selection can now be allowed to make tickets.</p>
                <p>Tickets replace requests on selections that can make them. The difference is that a ticket can be "Accepted" or "Rejected" by approvers, and you can discuss the ticket in a comment thread.</p>
                <p><strong>How to enable tickets:</strong><br>
                To enable tickets for a selection, open its settings and you will find the option at the bottom of the "Requests" column.</p>

                <h4>Omni-potent Approvers</h4>
                <p>Approvers on master selections are now approvers for all sub-selections as well.<br>
                This was a necessary technical change to enable the workflow of tickets from sub-selections.</p>

                <h3>Fixes</h3>
                <ul>
                    <li>Selecting all products and deleting them did not actually delete any products. It does now :)</li>
                </ul>
            </template>

            <template v-slot:signoff>
                <SignoffPortrait
                    imageUrl="/images/team/David-Grady-Trendmatch (Thumbnail).png"
                    name="David"
                    title="Co-founder & Web dev"
                />
            </template>
        </ChangelogPost> 

        <ChangelogPost 
                title="Cotton"
                date="Late September 2020 Release"
                featuredImgUrl="/images/blog/undraw_Portfolio_re_qwm5.svg"
                singoff="David"
            >
            <template v-slot:lead>
                <p>September has been a busy month, and we are happy to be able to release a lot of new features for you.</p>
                <p>Followng this dashboard update will also be an update of the iOS app, bringing you new features across the board.</p>
            </template>

            <template v-slot:body>
                <h3>New features</h3>

                <h4>Bulk image upload</h4>
                <p>From the edit products page, you can now select a bulk of images to upload at once.<br>
                The only requirement is that your image names start with the following pattern: <br>
                {PRODUCT ID}_{VARIANT NAME}.</p>
                <p>Kollekt will automatically figure out what product and variant the image belongs to and upload it.
                    I hope that this will save you a lot of time.
                </p>
                
                <h4>Support multiple delivery dates</h4>
                <p>Finally you can set multiple delivery dates for a single product.</p>
                <p>This will be displayed both on the dashboard and in the updated iOS app.</p>

                <h4>Assortment and box-size split</h4>
                <p>Assortment names and available box sizes have been split into 2 seperate fields now.</p>
                <p>This should make it easier to get a quick overview of the box-sizes and assortments available for a style.</p>

                <h4>CSV export overhaul</h4>
                <p>We decided to change the CSV export modal entirely to give you more control over the exact data you get out.</p>
                <p>We plan to continue improving this feature as we get more feedback from you, our users, so please tell us how we can make it even better for you.</p>

                <h3>Fixes</h3>
                <ul>
                    <li>Limit number of decimals displayed for numbers to 2.</li>
                    <li>Fixed delivery dates sometimes being wrong due to wrong reading of timezone data.</li>
                    <li>Fixed "Add new team" and "Add new folder" sometimes submitting/cancelling automtically.</li>
                </ul>
            </template>

            <template v-slot:signoff>
                <SignoffPortrait
                    imageUrl="/images/team/David-Grady-Trendmatch (Thumbnail).png"
                    name="David"
                    title="Co-founder & Web dev"
                />
            </template>
        </ChangelogPost> 

        <ChangelogPost 
            title="Chiffon"
            date="Mid-September 2020 Tweaks & Fixes"
            featuredImgUrl="/images/blog/undraw_birthday_girl_n46w(1).svg"
            singoff="David"
        >
            <template v-slot:lead>
                <p>As with any major release, a lot of minor tweaks must follow.<br>Following the release of Chenille, we already have a new update ready for you.</p>
                <p>This update contains a range of minor tweaks and bug-fixes.</p>
                <p>Enjoy.</p>
            </template>

            <template v-slot:body>
                <h3>Tweaks & Fixes</h3>
                <ul>
                    <li>
                        Fix ctrl+c completing a product (now only works if NOT holding ctrl).
                    </li>
                    <li>
                        Allow sorting by Ins OR focus separately.
                    </li>
                    <li>
                        Now auto-mapping multiple currencies in the same file in multiple columns (i.e. you have columns; WHS DKK, WHS NOK, WHS SEK, in the same file).
                    </li>
                    <li>
                        Fixed bug in upload to existing file that would only allow uploading if a variant key had been mapped (even when not replacing variants).
                    </li>
                    <li>
                        Fix bug in upload from workbook that would only create 1 currency, when having mapped a single header with multiple currencies in it. Now correctly creating all the currencies on the products.
                    </li>
                    <li>
                        Fix map field dropdowns showing the currently mapped field as being any field with the same name as the currently mapped field, no matter the mapped file.
                    </li>
                    <li>
                        Added hotkey esc to unfocus table search fields
                    </li>

                </ul>

                <h3>Thank you so much for your support</h3>
                <p>Thank you for helping us become aware of new bugs, and for bringing us your wishes for improvements.<br>
                It is what makes us able to make Kollekt even better.</p>
                <p>Of course we have already started working on the next features, and will have another release ready within the next 2 weeks, if we do our job well.</p>
                <p>Are you afraid of missing an update? If you want to receive our update newsletter, write to our CEO, Simon (<a href="mailto:simon@kollekt.dk">simon@kollekt.dk</a>), and he will make sure to include you in our maling list.</p>
                <p>As always, if you have any questions about the update, please reach out to us, and we will be more than happy to give you a tour.</p>
            </template>

            <template v-slot:signoff>
                <SignoffPortrait
                    imageUrl="/images/team/David-Grady-Trendmatch (Thumbnail).png"
                    name="David"
                    title="Co-founder & Web dev"
                />
            </template>
        </ChangelogPost>

        <ChangelogPost 
            title="Chenille"
            date="September 2020 Release"
            featuredImgUrl="/images/blog/undraw_fashion_photoshoot_mtq8.svg"
            singoff="Michael & David"
        >
            <template v-slot:lead>
                <p>Chenille is here and this is a big one.</p>
                <p>This update features both a new release of the dashboard and the iOS app.<br>
                    The focus has been on improving approver/aligner communincation amongst other things.</p>
                <p>Enjoy <br>
                    - David, co-founder and web developer</p>
            </template>

            <template v-slot:body>
                <h2>Mobile App</h2>
                <h3>New features</h3>

                <h4>Magic link for login, when you have forgot your password</h4>
                <p>You can now log in with a link sent to your e-mail. (Yes that's right, no reason to reset your password every time).</p>

                <h4>Magic link to selection from Dashboard</h4>
                <p>Dashboard admins can send a "magic link" to selection members. The members who follow the link will be shown the selection in question on the mobile app, in addition to being automatically logged in.</p>

                <h4>Custom product order</h4>
                <p>Products will now be shown in a predetermined order, that can be set on the dashboard</p>

                <h3>Bug fixes</h3>
                <p>We've squashed a bug that caused the app to crash if a product with QTY input got extra variants added.</p>

                <h2>Web dashboard</h2>
                <h3>New features</h3>
                <h4>Filter style overhaul</h4>
                <p>
                    The filter bar was getting quite cluttered. We have now collected all filters in a "filters" menu, that should satisfy all your filter needs.
                </p>

                <h4>Threads on requests v2</h4>
                <p>
                    Our last release saw the inclusion of threads on requests to facilitate better communication between aligners and approvers.
                </p>
                <p>This release, greatly expands upon the features added:</p>
                <ul>
                    <li>Alligners and Approvers can now Accept / Reject requests.</li>
                    <li>The visual style of requests has been changed to better display the current state of a request (open/accepted/rejected).</li>
                    <li>Styles can now be marked as <strong>complete</strong>, to stop the style from showing up as needing attention.</li>
                    <li>We have added hotkey support to tab between requests. Use tab (Tab) to focus a request thread and use (A) to Accept or (R) to Reject.</li>
                    <li>Tickets tab has been added in addition to Ins/Outs/Nds. This tab will show all products with requests made from master selections.</li>
                    <li>Added filter to hide completed products, available from the Tickets tab.</li>
                </ul>

                <h4>Send login link</h4>
                <p>You can send a login link to all selection members from the dashboard now. The link will open the corresponding selection for the user on the mobile app.</p>
                <p>You have the option of sending a link to every member of every selection on the file, to all the members of a specific selection, or to a select number of members on a specific selection.</p>

                <h4>Export selected styles</h4>
                <p>You now have the option of only exporting the styles you have selected to PDF or CSV.</p>

                <h4>Upload CSV / Products overhaul</h4>
                <p>This release introduces great improvements to the upload functions available.</p>

                <h4>Workbook upload overhaul (Excel files supported!)</h4>
                <p>We now accept every workbook type supported by SheetJS (this includes Excel files).</p>
                <p>This means that you can have comma as a decimal separator (in Excel files only) and period as a thousand separator (in Excel files only).</p>

                <h4>Upload to existing file overhaul</h4>
                <p>More options for adding to / editing existing files by uploading new workbooks.</p>
                <ul>
                    <li>Added different data update strategies: Smart | Add only | Replace.</li>
                    <li><strong>Smart:</strong> Replace old data if new is available, add new data, leave the rest of the existing data untouched.</li>
                    <li><strong>Add only: </strong> Only add new data, leaving all the existing data untouched.</li>
                    <li><strong>Replace:</strong> Clear all existing data and insert the new instead.</li>
                    <li>You of course still have the option of choosing which data you would like to update: Prices only, name, category, assortments - the choice is yours.</li>
                    <li>Added ability to create missing products in existing file based on the styles in the uploaded workbook(s)</li>
                    <li>Added ability to delete existing styles not present in the uploaded workbook(s).</li>
                </ul>

                <h4>Improved auto-mapping</h4>
                <p>Automapping of workbook fields has also been improved.</p>
                <p>Now currencies are automatically added to match the number of currencies present in the uploaded files.</p>
                <p>The same is true with assortments + more minor improvements to the automapping.</p>

                <h4>Custom product order</h4>
                <p>Added option to set custom product order for users of both dashboard and app. This can be edited on "edit file" page.</p>

                <h3>Fixes</h3>
                <ul>
                    <li>Fixed Markup could have more than 2 decimals.</li>
                    <li>Adding image to new product before giving it an ID would throw an error.</li>
                    <li>Added confirm dialog when about to close create product flyin before the new product has been saved (to avoid discarding the new product).</li>
                    <li>Implemented variant ean and variant size ean support to upload workbook functions.</li>
                    <li>Allow editing variant sizes on edit PDP.</li>
                </ul>

                <h3>Got questions or feedback?</h3>
                <p>If you have any questions, or would like more explanations on how to use the features, please feel free to get in touch with Simon on simon@kollekt.dk</p>

            </template>

            <template v-slot:signoff>
                <SignoffPortrait
                    imageUrl="/images/team/Michael-Laugesen-Trendmatch (Thumbnail).png"
                    name="Michael"
                    title="Co-founder & Design lead"
                />
                <SignoffPortrait
                    imageUrl="/images/team/Simon-Kollekt-64x64.png"
                    name="Simon"
                    title="Co-founder & CEO"
                />
                <SignoffPortrait
                    imageUrl="/images/team/David-Grady-Trendmatch (Thumbnail).png"
                    name="David"
                    title="Co-founder & Web dev"
                />
            </template>
            
        </ChangelogPost>

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