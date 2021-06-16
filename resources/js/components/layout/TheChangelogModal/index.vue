<template>
    <BaseModal :show="show" @close="SHOW_CHANGELOG(false)" header="What's new?" classes="full-body changelog">
        <ChangelogPost
            title="Lace: Brickred"
            date="June 2021: The Jobs Release"
            featuredImgUrl="/images/blog/undraw_Work_chat_re_qes4.svg"
        >
            <template v-slot:lead>
                <p>
                    This release is mainly focused on updating SELECT. This release introduces a feature we have been
                    aching to implement for a very long time; the split from selection roles to roles and jobs. More
                    about this below.
                </p>
            </template>
            <template v-slot:body>
                <h2>SELECT</h2>
                <h3>Jobs</h3>
                <p>Until this point what a user does on a selection has been determined by their role.</p>
                <p>The following pattern was followed:</p>
                <ul>
                    <li>Role: Owner => Job = Alignment</li>
                    <li>Role: Member => Job = Feeeback</li>
                    <li>Role: Approver => Job = Approval</li>
                </ul>
                <p>This has now changed so you can decide a users <i>role</i> and <i>job</i> indepedently.</p>
                <p>
                    This is especially great in cases where you want many users to collaborate around alignment (job =
                    Alignment), but you don't want everyone to have edit access for the selection (role = Member)
                </p>
                <p>
                    This should give you more flexibility in the way you setup your selections, and make it easier
                    at-a-glance of the selection users to determine who does what.
                </p>

                <h3>Improved Selection-Team linking</h3>
                <p>
                    A team can now be used to determine the role and job for the users of a selection added via that
                    team.
                </p>
                <p>
                    What this means, is that you can add a team to a selection. The users on that team then get
                    automatically added to that selection.
                </p>
                <p>
                    Changing a team-members role or job will also update their role/job on the selections on which the
                    team has been added.
                </p>
                <p>You are however, still able to overwrite a users role/job for each individual selection.</p>
                <p>
                    The result should be a much smarter system, saving you the trouble of updating user roles/jobs in
                    multiple places, while still keeping the flexibility of the old system.
                </p>

                <h2>General Tweaks & Fixes</h2>
                <ul>
                    <li>
                        Fixed an issue where you weren't able to update existing products by uploading from spreadsheet
                        when you had variant EAN or variant delivery date mapped and checked.
                    </li>
                    <li>Fixed an issue where selection links, would sometimes lead to the wrong selection.</li>
                    <li>
                        Fixed a bug where you couldn't set the delivery date on a newly created product, without saving
                        it first.
                    </li>
                    <li>
                        The edit-product fly-in should no longer show the "Really discard this product?" dialog, after
                        viewing products newly created through import-from-spreadsheet.
                    </li>
                    <li>
                        Fixed joining a presentation through a link, on a user with no name set, would cause the page to
                        load infinitely.
                    </li>
                    <li>Minor style tweaks.</li>
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
            title="Jersey: Blush"
            date="May 2021 Release"
            featuredImgUrl="/images/blog/undraw_Dev_focus_re_6iwt.svg"
        >
            <template v-slot:body>
                <h2>General updates</h2>
                <h3>Support Super Powers</h3>
                <p>Workspace admins and owners are now able to request super powers.</p>
                <p>
                    Workspace owners can purchase support credits, and your workspace owners and admins will be able to
                    request assistance from a Kollekt team member.
                </p>
                <p>Support only needs to be payed for, in cases where you need us to set up Kollekt on your behalf.</p>
                <p><strong>Questions, guidance, traning, etc. is still free.</strong></p>
                <p>
                    We still encourage you to ask us anything at all you may be in doubt of or would like to learn more
                    about.
                </p>
                <p>
                    Workspace owners and admins will get access to the new navbar item "Support" in the left-side menu.
                    From here they can access an overview of their remaining available support hours.
                </p>

                <h3>Search modifiers: Invert</h3>
                <p>
                    You can now start your search query in any search-field on Kollekt, with the string ":invert"
                    followed by a space and your search query.
                </p>
                <p>Kollekt will then show you any search result that did not match your query.</p>

                <h2>SELECT</h2>

                <h3>Labels as input</h3>
                <p>Labels are now part of alignment and feedback.</p>
                <p>
                    This means that each individual user can cast votes on product labels through feedback, and in
                    alignment a unified decision can be made.
                </p>
                <p>
                    This should let you gather much more granular input, and further increase the possibilities of
                    Kollekt SELECT.
                </p>
                <p>The votes cast for a specific label are visible upon hovering on the label.</p>
                <p>
                    You can swtich between viewing votes from feedback or alignment via the "View input from:
                    X"-switcher.
                </p>
                <p>
                    When one or more labels are voted for, that product is automatically marked as IN, if not already IN
                    or Focus.
                </p>
                <p>If a product is marked as OUT or undecided, any votes cast will be removed as well.</p>

                <h3>General Tweaks & Fixes</h3>
                <ul>
                    <li>
                        Fixed joining selection via link, sometimes not working for users on multiple workspaces.
                    </li>
                    <li>
                        Fixed the presenter queue from SELECT presentation mode, sometimes not showing up. Plus the
                        animation when displaying the presentation queue search flyin should now run smoother.
                    </li>
                    <li>
                        Breadcrumbs no longer persist when navigating to the Teams or Users pages.
                    </li>
                    <li>
                        You can now add a default overwrite to SELECT, deciding whether you always want to view input
                        from Alignment or Feedback, first. To enable this feature on your workspace, reach out to anyone
                        from our Team.
                    </li>
                    <li>Fixed advanced filters not displaying the first time they were clicked.</li>
                    <li>
                        "Import selection input" now correctly imports ticket labels when importing requests/tickets.
                    </li>
                    <li>Various button styling fixes.</li>
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
        <ChangelogPost title="Jersey: Dyonysus" date="April 2021 Hotfix Release">
            <template v-slot:body>
                <h3>Tweaks & Fixes</h3>
                <ul>
                    <li>Sorting products with a search query present now works again.</li>
                    <li>
                        <strong>BUY:</strong> Now correctly summing quantities from sub-selection on the selection
                        overview.
                    </li>
                    <li>
                        <strong>BUY:</strong> Fixed the scrollbar not being visible when making quantity input by
                        assortments.
                    </li>
                    <li>
                        <strong>BUY:</strong> Now displaying colors as fallback when no image is available for variants.
                    </li>
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
            title="Jersey: Blue Violet"
            date="April 2021 Tweaks Release"
            featuredImgUrl="/images/blog/undraw_Environmental_study_re_q4q8.svg"
        >
            <template v-slot:lead>
                <p>Tweaks and fixes for the grand release of BUY are here.</p>
            </template>
            <template v-slot:body>
                <h3>Tweaks & Fixes</h3>
                <ul>
                    <li>Export CSV Dump has been fixed.</li>
                    <li>Alignment is now grouped by chapter in the product flyin and on PDF exports</li>
                    <li>
                        Alignment input is now sorted logically in the product flyin, always starting with the chapter
                        first (if any).
                    </li>
                    <li>Notification bullets and various buttons have had their sizes / aspect ratios fixed.</li>
                    <li>The "Selection Input" filter is no longer persistent between files and workspaces.</li>
                    <li>
                        Kollekt's CSV export engine has been upgraded, making it easier to create new csv export
                        templates for you.
                    </li>
                    <li>Fixed hotkeys triggering actions in context menus, even when they weren't visible.</li>
                    <li>Fixed no search results being returned when setting selection currency.</li>
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
            title="Jersey: Blue Green"
            date="April 2021 Release"
            featuredImgUrl="/images/blog/undraw_shopping_eii3.svg"
        >
            <template v-slot:lead>
                <p>Introducing BUY! The first addition to the Kollekt product family.</p>
                <p>
                    This is only the first step towards our goal of helping you all the way from sketch, to loom, to
                    consumer.
                </p>
                <p>Of course this release has lots of other tweaks and fixes as well. Enjoy!</p>
            </template>
            <template v-slot:body>
                <h3>What is SELECT?</h3>
                <p>SELECT is what we call Kollekt as you have known it so far.</p>
                <p>
                    SELECT will continue being your tool for collaborating on collections. Whether that is to do trim,
                    gather feedback from key partners, or something entirely different enabled by the feedback and
                    alignment tools of SELECT.
                </p>

                <h3>What is BUY?</h3>
                <p>What about BUY then? BUY is a new tool developed to empower purchasers.</p>
                <p>Buy alows purchasers to handle their purhcase in 1 place.</p>
                <p>The BUY process is split into 3 steps</p>
                <ol>
                    <li>The purchaser looks through the available products, deciding which ones to buy</li>
                    <li>The purchaser decides how many to buy</li>
                    <li>The order is reviewed to ensure that it contains no gaps</li>
                </ol>

                <p><strong>Interested in hearing more about BUY?</strong></p>
                <p>
                    Get in touch with CEO Simon (<a href="mailto:simon@kollekt.dk">simon@kollekt.dk</a>) or phone (<a
                        href="tel:004523381938"
                        >+45 23 38 19 38</a
                    >)
                </p>

                <h3>Dashboard style overhaul</h3>
                <p>You will probably notice that the dashboard has gotten a bit of a facelift.</p>
                <p>
                    Most things should still look familiar, with the only new feature added being the app-switcher,
                    which can be accessed when clicking the app-logo in the top left corner of the screen.
                </p>

                <h3>Tweaks & Fixes</h3>
                <ul>
                    <li>Tickets can no longer be accepted/rejected on products marked as "Complete".</li>
                    <li>Added "Exact" function to filters (useful for labels for instance)</li>
                    <li>
                        You can now stop presentations started by someone else, if you have rights to the same
                        selections.
                    </li>
                    <li>You can now be logged in on the dashboard and the iOS app at the same time!</li>
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
            title="Gingham: Blue"
            date="March 2021, 1st Bonus Release"
            featuredImgUrl="/images/blog/undraw_fireworks_q5ji.svg"
        >
            <template v-slot:lead>
                <p>We are on <i>fuego</i>, bringing you yet a another set of requested tweaks. Enjoy!</p>
            </template>
            <template v-slot:body>
                <h3>Tweaks & Fixes</h3>
                <ul>
                    <li>
                        Product labels can now be accessed via the hotkey "#" when a product row is focused, and when
                        viewing the product details flyin (PDP).
                    </li>
                    <li>
                        Product labels can now be viewed and edited from the PDP.
                    </li>
                    <li>
                        Products can now be sorted by amount of labels.<br />
                        Find the new <i>Sort</i> button next to <i>Filter</i>, on the products overview.
                    </li>
                </ul>

                <p>
                    What tweaks would make your work easier on Kollekt?<br />
                    Let us know, so we can keep making the best version of Kollekt for you.
                </p>
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
            title="Gingham: Black"
            date="February 2021 Bonus Release"
            featuredImgUrl="/images/blog/undraw_Content_structure_re_ebkv.svg"
        >
            <template v-slot:lead>
                <p>
                    Finally we are able to bring you Black, featuring lots of quality-of-life updates requested by you.
                    Enjoy.
                </p>
            </template>
            <template v-slot:body>
                <h3>Mighty selection owners</h3>
                <ul>
                    <li>
                        Selection owners are now able to delete any comment, request, or ticket on their selection or a
                        descendant of it.
                    </li>
                    <li>
                        Selection owners can now set labels for any ticket or request made in their selection or a
                        descendant of it.
                    </li>
                </ul>

                <h3>Import selection input</h3>
                <p>
                    It is now possible to import feedback, alignment, comments, and/or request/tickets from one
                    selection to another.
                </p>
                <p>
                    Simply go to the selection you wish to import to and find the new "Import input" button in the top
                    navbar.
                </p>
                <p>
                    Importing variant input from one file to another is only available if the files are clones of each
                    other.
                </p>

                <h3>Export IN variants only</h3>
                <p>When making a custom CSV export, you can now check a box to export "IN-variant only".</p>
                <p>The CSV will then only include variants where the action is IN or FOCUS.</p>

                <h3>Create New Products option on import from spreadsheet modal</h3>
                <p>
                    When importing from spreadsheet to an existing file, a new option has been added to "Create new
                    products".
                </p>
                <p>
                    This vastly simplifies the process of adding more products to a file with existing products, without
                    affecting the existing products.
                </p>
                <p>This option takes care of all import settings for you, so you can safely import more products.</p>

                <h3>Minor tweaks & fixes</h3>
                <ul>
                    <li>
                        Exporting results to CSV: Requests/tickets now have a column in the CSV per label, to make it
                        easier to analyze by labels.
                    </li>
                    <li>Various small fixes to the newly introduced chapters.</li>
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
            title="Gingham: Bittersweet"
            date="February 2021 Release"
            featuredImgUrl="/images/blog/undraw_Hiking_re_k0bc.svg"
        >
            <template v-slot:lead>
                <p>
                    Our Winter Break here at Kollekt, has been spend finally getting ready to bring you a new update,
                    featuring lots of new features!
                </p>
                <p>
                    This update will be shortly followed by 1 or 2 quality of life updates, including some requested
                    features.
                </p>
                <p>
                    As always, please reach out if you would like a personal introduction to our new features, and learn
                    of the new ways in which Kollekt might optimize your work.
                </p>
            </template>
            <template v-slot:body>
                <h3>Broadcast Channels</h3>
                <p>No more broadcast up, listen down etc.:</p>
                <p>Introducing a, hopefully, more intuitive alternative to selection settings.</p>
                <p>
                    You can now create broadcast channels on a file. Every selection added to a broadcast channel will
                    "listen" to everything that is broadcast to the channel.
                </p>
                <p>You choose yourself which selections broadcast what to the broadcast channel.</p>
                <p>
                    Apart from being easier to understand, this also let's selections broadcast and listen to each other
                    no matter how they are structured.
                </p>
                <p>All in all, a powerful new tool we hope you will find useful.</p>

                <h3>More Chapter Rule options</h3>
                <ul>
                    <li>Create filter based on list of Product Ids / EANs.</li>
                    <li>Filter by Brand</li>
                </ul>

                <h3>Live Status screen</h3>
                <p>We have added a live-updating status screen, where you can see the top In, Focus, and Out styles.</p>
                <p>
                    You decide which selections to include in the screen, and you can enable automatic cycling between
                    the selections.
                </p>
                <p>
                    This feature should be perfect for sharing live-results with your team, for instance by showing it
                    on a monitor.
                </p>

                <h3>Product Labels</h3>
                <p>You can now define a number of labels available to add to your products.</p>
                <p>Products can be filtered by these labels and they can be exported to CSV.</p>

                <h3>Tweak & Fixes</h3>
                <ul>
                    <li>You are now able to sort products with filters enabled - once again.</li>
                    <li>
                        Kollekt now remembers what page you were trying to reach, when you get shown the login screen,
                        and sends you there after logging in.
                    </li>
                    <li>
                        Variants set to <strong>Focus</strong> no longer change to <strong>In</strong>, when setting a
                        quantity.
                    </li>
                    <li>
                        When joining a selection / presentation via link, users should more seldom be asked to complete
                        a
                        <i>captcha</i>-test, and will no longer be redirected, in order to login to an existing account.
                    </li>
                    <li>
                        Selections can no longer overflow their container when choosing which to include in a livestream
                        presentation.
                    </li>
                    <li>
                        Timings on the PLAY timeline should no longer be able to overflow the timeline or lay on top of
                        each other, which should prevent other timings from moving when deleting some.
                    </li>
                    <li>
                        You are now correctly able to filter by custom properties of type <i>Array</i>, and belong to
                        <i>Variant</i>.
                    </li>
                    <li>Fixed various cases where a selection's chapter was not correctly displayed.</li>
                    <li>Advanced filters now work again.</li>
                    <li>
                        Optimized initial loading of the selection page, which should make loading selections with lots
                        of input faster.
                    </li>
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
            title="Damask: Beaver"
            date="January 2021 Tweaks & Fixes Release 2"
            featuredImgUrl="/images/blog/undraw_Co_workers_re_1i6i.svg"
        >
            <template v-slot:body>
                <h3>Chatpers: Linked Chapters</h3>
                <p>
                    Now you can keep handover and sales meeting in the same file, and automatically exclude OUT-styles,
                    from the sales meeting.
                </p>
                <p>This should mean less trouble uploading and setting up files in Kollekt for you.</p>
                <p><strong>How it works</strong></p>
                <p>
                    Chapters can now be linked to another. The linked chatper inherits all the rules of the chapter it
                    is linked it.
                </p>
                <p>
                    Additionally, linked chapters have access to a special rule, filtering the products in the chapter,
                    based on the alignment aciton in the linked chapter.
                </p>

                <h3>Fixes & Tweaks</h3>
                <ul>
                    <li>
                        When posting comments as Approver the comment would disappear after closing and reopening the
                        product details flyin.
                    </li>
                    <li>
                        Uploading images to existing variants no longer matches any variant with either the same color
                        or variant name, sometimes overwriting the wrong variant. There now has to be a match between
                        both the variant color and variant name, before it overwrites an existing variant.
                    </li>
                    <li>
                        Various tweaks to the way chapters are displayed throughout the dashboard.
                    </li>
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
            title="Damask: Banana Mania"
            date="January 2021 Tweaks & Fixes Release 1"
            featuredImgUrl="/images/blog/undraw_relaxing_walk_mljx.svg"
        >
            <template v-slot:lead>
                <p>Thanks to your input, we are already ready with a new batch of tweaks & fixes.</p>
            </template>

            <template v-slot:body>
                <h3>Kollekt PLAY</h3>
                <ul>
                    <li>
                        On the product preivew, the price has now been moved below the image, so it will no longer
                        obscure your bags.
                    </li>
                </ul>
                <h3>Import from spreadsheet</h3>
                <ul>
                    <li>
                        Fixed a bug, where no validation error would be shown for number errors, where the spreadsheet
                        value included a number, but was not in fact a number. Go fiure 🤷.
                    </li>
                </ul>
                <h3>Custom product data</h3>
                <ul>
                    <li>
                        Custom product properties can now belong to variants. Useful, if you have variant properties
                        like size, or similar (we already have variant sizes as a default property, don't worry - I just
                        can't think of a better example.).
                    </li>
                    <li>
                        Added custom property type <strong>Array</strong>. This means a property can hold a list of
                        values if needed. Like sizes: S, M, L.
                    </li>
                    <li>
                        The new cutom property updates work with importing from spreadsheet, and can be included in CSV
                        exports.
                    </li>
                    <li>
                        If you need these custom properties, you can set them from the workspace settings screen, if you
                        are the owner of your workspace.
                    </li>
                </ul>
                <p>
                    We are of course, also working on a ton of other features for you!
                </p>
                <p>
                    For one, we are going to expand on the usefulness of <strong>Chapters</strong>, which we hope will
                    make it even easier for you to organize and analyze your results.
                </p>
                <p>It should also reduce manual labor in connection with importing data to Kollekt.</p>
                <p>
                    We would always love to give you a tour of our new features. All you need to do is reach out to me,
                    Simon or Michael.
                </p>
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
            title="Damask: Atomic Tangerine"
            date="January 2021 Release"
            featuredImgUrl="/images/blog/undraw_Powerful_re_frhr.svg"
        >
            <template v-slot:lead>
                <p>The new year is here, and so is an update for Kollekt. Cheers.</p>
            </template>

            <template v-slot:body>
                <h3>Selection Chapters</h3>
                <p>We are very happy to introduce our new feature: Chapters.</p>
                <p>Chapters are a special kind of selection on a file.</p>
                <p>The thing about chapters is that you can apply a product filter to the chapter.</p>

                <p><strong>What does that mean for you?</strong></p>
                <p>
                    Where you before had to upload multiple files in order to have them split out in the iOS app, you
                    can now do the same thing with Chapters.
                </p>
                <p>You just upload 1 set of products, and create sub-divisions via chapters.</p>

                <p><strong>Handover and Sales Meetings</strong></p>
                <p>
                    You can make the chapter filters by product category, delivery or other product related data.
                </p>
                <p>
                    This will let you keep one dynamic file, where you can see all of your results by chapter, or
                    together.
                </p>

                <h3>Custom CSV Export</h3>
                <p>When exporting to CSV you now have a new option available: Custom.</p>
                <p>Custom let's you decide exactly what product data should be included in the export.</p>
                <p>
                    You can re-arrange the columns as you please, and can even rename the columns to the name you need.
                </p>

                <h3>Tweaks & Fixes</h3>
                <ul>
                    <li>
                        The add-users modal now automatically checks a user with the entered e-mail already exists on
                        Kollekt, so you don't have to enter a new name or e-mail.
                    </li>
                    <li>Workspace owners can now set custom product data fields from workspace settings.</li>
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
            title="Damask: Asparagus"
            date="The Christmas 2020 Release"
            featuredImgUrl="/images/blog/undraw_christmas_tree_56sw.svg"
        >
            <template v-slot:lead>
                <p>
                    Joy to the world, a new update for Kollekt is here 🎄.
                </p>
                <p>
                    We have put lots of tweaks and features in the Christmas stockings, for both iOS app and dashboard,
                    so strap in for the sleigh ride and let's unwrap the presents.
                </p>
            </template>

            <template v-slot:body>
                <h2>Dashboard</h2>
                <h3>Custom product data</h3>
                <p>Do you need <i>sample location</i> or <i>country of origin</i> data for your styles?</p>
                <p>
                    You can now define any number of custom properties for your products.
                    <br />These properties can be used to filter products by in the dashboard, and will be included in
                    your exports.
                </p>
                <p>
                    The custom product data can be set just like any other product data: By uploading a spreadsheet, or
                    manually entering the data.
                </p>
                <p>
                    If you have a column with the same header name as your custom propety in a spreadsheet, Kollekt will
                    automatically map them, when importing from a spreadsheet.
                </p>
                <p><strong>How to get started</strong></p>
                <p>
                    Enabling custom properties can currently only be done by a Kollekt developer, but we are more than
                    happy to do this for you. Don't hesitate to reach out to us, to get started.
                </p>

                <h3>Variants = Color + Variant</h3>
                <p>Variant variants? You got it.</p>
                <p>
                    Until now we have only been using color to uniquely identify product variants. Now each variant in
                    Kollekt consists of a <i>color</i> and a <i>variant</i>.
                </p>
                <p>
                    This should help Kollekt better reflect the reality of your data, where one item might come in the
                    same color but with different details (variants).
                </p>
                <p>
                    When bulk uploading images to a file, colors and variants can automatically be generated on your
                    products.
                </p>
                <p>This change should not affect the way you use Kollekt.</p>

                <h3>Import product data from external database</h3>
                <p>
                    If you get an integration between Kollekt and a datasoure of yours that holds your product data, it
                    is now easier than ever before, to import product data to your files.
                </p>
                <p>
                    All you have to do is provide a list of the product ids you would like added, and the products will
                    be fetched automatically. This can be done by scanning barcodes, uploading a spreadsheet with the
                    ids or manually entering them.
                </p>
                <p>
                    No need to map column headers to Kollekt's product properties anymore, as we simply create the
                    translation map one time at setup.
                </p>
                <p><strong>How to get started</strong></p>
                <p>
                    Grab a hold of your local IT-person and put them in touch with us. We are ready and more than to
                    happy to build integrations.
                </p>

                <h3>Ticket labels</h3>
                <p>You can now add a label to your product tickets.</p>
                <p>Labels will be included in your exports, and products can be filtered by them in Kollekt.</p>
                <p>Currently the available tickets are:</p>
                <ul>
                    <li>color_added</li>
                    <li>color_removed</li>
                    <li>price_wish</li>
                    <li>add_delivery</li>
                    <li>change_delivery</li>
                </ul>
                <p>
                    We plan to allow you to set the available labels yourself in the future. For now just write to us if
                    there is a label you are missing, and we will add it in no time.
                </p>
                <p><strong>How to use</strong></p>
                <p>
                    When writing a ticket type <i>#</i> and a list of available tickets will appear for you to choose
                    from.
                </p>
                <p>
                    Labels are only available for tickets - i.e. not for regular requests, so make sure you enable
                    tickets in your selection settings if you wish to use it
                </p>
                <h3>General Tweaks & Fixes</h3>
                <ul>
                    <li>
                        Both files and folder can now be created from either the navbar or the footer of the files
                        table.
                    </li>
                    <li>
                        The <i>Create new file</i> flow has been overhauled and (hopefully) simplified. When creating a
                        new file, you are now taken to the <i>Edit products screen</i>, from where you can import
                        products to the file file, from one of 3 sources: Existing files in Kollekt, spreadsheets (Excel
                        / CSV), or a linked external database.
                    </li>
                    <li>Updated the name-matching logic of bulk upload images.</li>
                    <li>
                        Fixed barcode scanner not working when it had been configured to insert a line carriage after
                        each scan.
                    </li>
                    <li>
                        When searching for users to add to a team you can now search by either name or e-mail.
                    </li>
                    <li>
                        Fixed a bug when mapping spreadsheet headers that caused searching for header to always return 0
                        results.
                    </li>
                </ul>

                <h2>App</h2>
                <h3>Alignment in app</h3>
                <p>It is finally possible to make both feedback and alignment in the iOS app.</p>
                <p>
                    This means you can use exactly the platform that fits your needs best at the time, and should
                    prevent us from needing to convert input from feedback to alignment in the future.
                </p>
                <p>
                    For now, only comments (not tickets/requests) can be made in the app, so you will still need the
                    dashboard to finish your selections.
                </p>

                <h3>General Tweaks</h3>
                <ul>
                    <li>Hidden selections are now completely hidden in the app, helping you avoid clutter.</li>
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
            title="Crêpe: Apricot"
            date="Late November 2020 Release"
            featuredImgUrl="/images/blog/undraw_export_files_re_99ar.svg"
        >
            <template v-slot:lead>
                <p>
                    Before December is upon us, we are squeezing in one last November update.
                </p>
                <p>
                    This one is a huge tweaks and fixes update, also featuring new options for how you can re-use
                    products already in Kollekt between multiple files.
                </p>
            </template>

            <template v-slot:body>
                <h3>Features, tweaks & fixes</h3>

                <h4>Export/Import products</h4>
                <ul>
                    <li>
                        You can now export the selected products from one file on Kollekt, to a new or existing file in
                        Kollekt.
                    </li>
                    <li>
                        You can export selected products to a CSV-dump that can be uploaded to Kollekt to create a copy
                        of the file (essentially a backup).
                    </li>
                    <li>You can import products from another file on Kollekt to a file you are editing.</li>
                    <li>
                        All Import/Export features can be accessed through the dropdown menus of the same names from the
                        navbar on the selection or edit products pages.
                    </li>
                    <li>
                        Currently only product data is copied over. We plan to add support for feedback and comments in
                        the future.
                    </li>
                </ul>

                <h4>Upload product data via CSV</h4>
                <ul>
                    <li>
                        Fixed bug where delivery dates including Danish month names, would not always get read correctly
                        as a date value, when uploading from CSV.
                    </li>
                </ul>

                <h4>Quantity input mode</h4>
                <ul>
                    <li>
                        Changed the way selection quantity inputs are summed.<br />
                        Setting a quantity for a parent selection will now overwrite the total quantity of the
                        selection's child-selections.
                    </li>
                    <li>
                        Now automatically setting the quantity input for a product when marking it IN. The automated
                        quantity set will be the summed quantity of the selections' children.
                    </li>
                </ul>

                <h4>Export to PDF</h4>
                <ul>
                    <li>
                        The sum total of INs and OUTs for each product have been added to PDF exports.
                    </li>
                </ul>

                <h4>Bulk image upload</h4>
                <ul>
                    <li>
                        Bulk image upload name-matching has been improved to match images to the correct varaint, even
                        though their names might not be exact matches.
                    </li>
                    <li>
                        Fixed bug where you might get thrown off and logged out of Kollekt, when bulk-uploading 200+
                        images at once.
                    </li>
                </ul>

                <h3>Other fixes</h3>
                <ul>
                    <li>
                        Selection settings will now work as they show every time.<br />
                        Before there was an error, where updating multiple selections' settings at once or cloning a
                        setup, might cause selections to not be properly aware of each other.
                    </li>
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
            title="Crêpe"
            date="November 2020 Release"
            featuredImgUrl="/images/blog/undraw_building_websites_i78t.svg"
        >
            <template v-slot:lead>
                <p>
                    A new update is finally here featuring a presentation mode overhaul. As well as other fixes and
                    features of course.
                </p>
            </template>

            <template v-slot:body>
                <h3>New features</h3>

                <h4>Presentation mode: Select which selections to include</h4>
                <p>When entering presentation mode you can now freely choose which selections to include.</p>
                <p>You can include any selection you are the owner of and any of their descendants.</p>
                <p>
                    This let's you create focused presentation groups, without complicating the overall selection setup.
                </p>
                <p><strong>How to use</strong></p>
                <p>
                    Simply enter a selection you are the owner of as you would before and enter presentation mode. You
                    will be prompted to select the selections to include.
                </p>

                <h4>iOS App: EAN Scanner overhaul</h4>
                <p>Add feedback to styles by using the EAN scanner.</p>
                <p>Choose what action you need to happen when scanning styles (IN/OUT or focus) or just view.</p>

                <h4>iOS App: Capture and upload pictures to styles</h4>
                <p>
                    Now you are able to manage files from the app - open the menu, select the files you want to edit,
                    and take pictures with your phone.
                </p>
                <p>
                    Filter only on products without pictures makes it easy for you to get an overview of styles you need
                    to update.
                </p>

                <h3>Tweaks and fixes</h3>
                <ul>
                    <li>
                        The vertical scrollbar has been broadened to make it easier to click using a touchpad.
                    </li>
                </ul>

                <p>
                    <strong
                        >We also have another new feature almost ready that we are very excited about sharing with you!
                        Stay tuned as we will unveil this feature very soon.</strong
                    >
                </p>
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
            title="Cotton: Almond"
            date="2nd Early October Release"
            featuredImgUrl="/images/blog/undraw_User_flow_re_bvfx (1).svg"
        >
            <template v-slot:lead>
                <p>This one is a small, but powerful update. Introducing: <strong>Scanner Mode</strong>.</p>
            </template>

            <template v-slot:body>
                <h3>New features</h3>

                <h4>Scanner Mode</h4>
                <p>You can now use a hand-held barcode scanner connected to your laptop to make input in Kollekt.</p>
                <p>
                    We have implemented 4 options for what happens with scanned items: Set IN, OUT, or FOCUS, or simply
                    view the scanned product.
                </p>
                <p>
                    You can also toggle whether you want to make the input for an entire product, or just the scanned
                    variant.
                </p>
                <p><strong>How to get started</strong></p>
                <p>
                    To get started, go to the selection in which you want to make your feedback and start scanning! It's
                    that simple.
                </p>
                <p>
                    Scanner mode will activate automatically, when Kollekt detects an incoming scan.
                </p>
                <p>
                    You can also manually activate scanner mode from the top navigation bar, if you wish to choose what
                    happens to scanned items beforehand.
                </p>

                <h4>Tweaks</h4>
                <p>
                    <strong>New look for the <i>What's New</i> modal.</strong>
                </p>
                <p>Let us know if you like it.</p>
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
            title="Cotton: Alice blue"
            date="Early October Release"
            featuredImgUrl="/images/blog/undraw_Done_checking_re_6vyx.svg"
        >
            <template v-slot:lead>
                <p>
                    We are ready with another improvement to the new ticket workflow, thanks to your continued feedback.
                </p>
                <p>This release allows any selection to make tickets - if you give them permission.</p>
            </template>

            <template v-slot:body>
                <h3>New features</h3>

                <h4>Tickets from sub-selections</h4>
                <p>Any selection can now be allowed to make tickets.</p>
                <p>
                    Tickets replace requests on selections that can make them. The difference is that a ticket can be
                    "Accepted" or "Rejected" by approvers, and you can discuss the ticket in a comment thread.
                </p>
                <p>
                    <strong>How to enable tickets:</strong><br />
                    To enable tickets for a selection, open its settings and you will find the option at the bottom of
                    the "Requests" column.
                </p>

                <h4>Omni-potent Approvers</h4>
                <p>
                    Approvers on master selections are now approvers for all sub-selections as well.<br />
                    This was a necessary technical change to enable the workflow of tickets from sub-selections.
                </p>

                <h3>Fixes</h3>
                <ul>
                    <li>
                        Selecting all products and deleting them did not actually delete any products. It does now :)
                    </li>
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
                <p>
                    September has been a busy month, and we are happy to be able to release a lot of new features for
                    you.
                </p>
                <p>
                    Followng this dashboard update will also be an update of the iOS app, bringing you new features
                    across the board.
                </p>
            </template>

            <template v-slot:body>
                <h3>New features</h3>

                <h4>Bulk image upload</h4>
                <p>
                    From the edit products page, you can now select a bulk of images to upload at once.<br />
                    The only requirement is that your image names start with the following pattern: <br />
                    {PRODUCT ID}_{VARIANT NAME}.
                </p>
                <p>
                    Kollekt will automatically figure out what product and variant the image belongs to and upload it. I
                    hope that this will save you a lot of time.
                </p>

                <h4>Support multiple delivery dates</h4>
                <p>Finally you can set multiple delivery dates for a single product.</p>
                <p>This will be displayed both on the dashboard and in the updated iOS app.</p>

                <h4>Assortment and box-size split</h4>
                <p>Assortment names and available box sizes have been split into 2 seperate fields now.</p>
                <p>
                    This should make it easier to get a quick overview of the box-sizes and assortments available for a
                    style.
                </p>

                <h4>CSV export overhaul</h4>
                <p>
                    We decided to change the CSV export modal entirely to give you more control over the exact data you
                    get out.
                </p>
                <p>
                    We plan to continue improving this feature as we get more feedback from you, our users, so please
                    tell us how we can make it even better for you.
                </p>

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
                <p>
                    As with any major release, a lot of minor tweaks must follow.<br />Following the release of
                    Chenille, we already have a new update ready for you.
                </p>
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
                        Now auto-mapping multiple currencies in the same file in multiple columns (i.e. you have
                        columns; WHS DKK, WHS NOK, WHS SEK, in the same file).
                    </li>
                    <li>
                        Fixed bug in upload to existing file that would only allow uploading if a variant key had been
                        mapped (even when not replacing variants).
                    </li>
                    <li>
                        Fix bug in upload from workbook that would only create 1 currency, when having mapped a single
                        header with multiple currencies in it. Now correctly creating all the currencies on the
                        products.
                    </li>
                    <li>
                        Fix map field dropdowns showing the currently mapped field as being any field with the same name
                        as the currently mapped field, no matter the mapped file.
                    </li>
                    <li>
                        Added hotkey esc to unfocus table search fields
                    </li>
                </ul>

                <h3>Thank you so much for your support</h3>
                <p>
                    Thank you for helping us become aware of new bugs, and for bringing us your wishes for
                    improvements.<br />
                    It is what makes us able to make Kollekt even better.
                </p>
                <p>
                    Of course we have already started working on the next features, and will have another release ready
                    within the next 2 weeks, if we do our job well.
                </p>
                <p>
                    Are you afraid of missing an update? If you want to receive our update newsletter, write to our CEO,
                    Simon (<a href="mailto:simon@kollekt.dk">simon@kollekt.dk</a>), and he will make sure to include you
                    in our maling list.
                </p>
                <p>
                    As always, if you have any questions about the update, please reach out to us, and we will be more
                    than happy to give you a tour.
                </p>
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
                <p>
                    This update features both a new release of the dashboard and the iOS app.<br />
                    The focus has been on improving approver/aligner communincation amongst other things.
                </p>
                <p>
                    Enjoy <br />
                    - David, co-founder and web developer
                </p>
            </template>

            <template v-slot:body>
                <h2>Mobile App</h2>
                <h3>New features</h3>

                <h4>Magic link for login, when you have forgot your password</h4>
                <p>
                    You can now log in with a link sent to your e-mail. (Yes that's right, no reason to reset your
                    password every time).
                </p>

                <h4>Magic link to selection from Dashboard</h4>
                <p>
                    Dashboard admins can send a "magic link" to selection members. The members who follow the link will
                    be shown the selection in question on the mobile app, in addition to being automatically logged in.
                </p>

                <h4>Custom product order</h4>
                <p>Products will now be shown in a predetermined order, that can be set on the dashboard</p>

                <h3>Bug fixes</h3>
                <p>
                    We've squashed a bug that caused the app to crash if a product with QTY input got extra variants
                    added.
                </p>

                <h2>Web dashboard</h2>
                <h3>New features</h3>
                <h4>Filter style overhaul</h4>
                <p>
                    The filter bar was getting quite cluttered. We have now collected all filters in a "filters" menu,
                    that should satisfy all your filter needs.
                </p>

                <h4>Threads on requests v2</h4>
                <p>
                    Our last release saw the inclusion of threads on requests to facilitate better communication between
                    aligners and approvers.
                </p>
                <p>This release, greatly expands upon the features added:</p>
                <ul>
                    <li>Alligners and Approvers can now Accept / Reject requests.</li>
                    <li>
                        The visual style of requests has been changed to better display the current state of a request
                        (open/accepted/rejected).
                    </li>
                    <li>
                        Styles can now be marked as <strong>complete</strong>, to stop the style from showing up as
                        needing attention.
                    </li>
                    <li>
                        We have added hotkey support to tab between requests. Use tab (Tab) to focus a request thread
                        and use (A) to Accept or (R) to Reject.
                    </li>
                    <li>
                        Tickets tab has been added in addition to Ins/Outs/Nds. This tab will show all products with
                        requests made from master selections.
                    </li>
                    <li>Added filter to hide completed products, available from the Tickets tab.</li>
                </ul>

                <h4>Send login link</h4>
                <p>
                    You can send a login link to all selection members from the dashboard now. The link will open the
                    corresponding selection for the user on the mobile app.
                </p>
                <p>
                    You have the option of sending a link to every member of every selection on the file, to all the
                    members of a specific selection, or to a select number of members on a specific selection.
                </p>

                <h4>Export selected styles</h4>
                <p>You now have the option of only exporting the styles you have selected to PDF or CSV.</p>

                <h4>Upload CSV / Products overhaul</h4>
                <p>This release introduces great improvements to the upload functions available.</p>

                <h4>Workbook upload overhaul (Excel files supported!)</h4>
                <p>We now accept every workbook type supported by SheetJS (this includes Excel files).</p>
                <p>
                    This means that you can have comma as a decimal separator (in Excel files only) and period as a
                    thousand separator (in Excel files only).
                </p>

                <h4>Upload to existing file overhaul</h4>
                <p>More options for adding to / editing existing files by uploading new workbooks.</p>
                <ul>
                    <li>Added different data update strategies: Smart | Add only | Replace.</li>
                    <li>
                        <strong>Smart:</strong> Replace old data if new is available, add new data, leave the rest of
                        the existing data untouched.
                    </li>
                    <li><strong>Add only: </strong> Only add new data, leaving all the existing data untouched.</li>
                    <li><strong>Replace:</strong> Clear all existing data and insert the new instead.</li>
                    <li>
                        You of course still have the option of choosing which data you would like to update: Prices
                        only, name, category, assortments - the choice is yours.
                    </li>
                    <li>
                        Added ability to create missing products in existing file based on the styles in the uploaded
                        workbook(s)
                    </li>
                    <li>Added ability to delete existing styles not present in the uploaded workbook(s).</li>
                </ul>

                <h4>Improved auto-mapping</h4>
                <p>Automapping of workbook fields has also been improved.</p>
                <p>
                    Now currencies are automatically added to match the number of currencies present in the uploaded
                    files.
                </p>
                <p>The same is true with assortments + more minor improvements to the automapping.</p>

                <h4>Custom product order</h4>
                <p>
                    Added option to set custom product order for users of both dashboard and app. This can be edited on
                    "edit file" page.
                </p>

                <h3>Fixes</h3>
                <ul>
                    <li>Fixed Markup could have more than 2 decimals.</li>
                    <li>Adding image to new product before giving it an ID would throw an error.</li>
                    <li>
                        Added confirm dialog when about to close create product flyin before the new product has been
                        saved (to avoid discarding the new product).
                    </li>
                    <li>Implemented variant ean and variant size ean support to upload workbook functions.</li>
                    <li>Allow editing variant sizes on edit PDP.</li>
                </ul>

                <h3>Got questions or feedback?</h3>
                <p>
                    If you have any questions, or would like more explanations on how to use the features, please feel
                    free to get in touch with Simon on simon@kollekt.dk
                </p>
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
                    Say hello to Cashmere, our first named new major release. What better fit than to name our releases
                    after types of fabric?
                </p>
                <p>
                    Cashmere brings the much requested feature; multiple images per variant, as well as laying the
                    foundation for extremely powerful workflows surrounding buyer-inclusion.
                </p>
                <p>Dig in below to see what you can find in the Kollekt dashboard and app now.</p>
            </template>

            <template v-slot:body>
                <h3>New features</h3>

                <h4>Threads on Requests + multiple master requests</h4>
                <p>
                    The request system has been upgraded. It is now possible to add multiple requests when in a master
                    selection and requests can be marked as open (default) or resolved. This works with the new ability
                    to comment on a specific request (thread).
                    <br />
                    All open/unresolved requests will be shown in the new tab “tickets” on overview.
                    <br />
                    We hope this enables you to track progress on requests and provide a better overview of your tasks.
                </p>

                <h4>Multiple images pr. variant</h4>
                <p>
                    Both dashboard and app now support multiple images for each variant. No more hacks to have multiple
                    images for a single variant - you can keep all variant-specific info on just one variant now.
                    <br />To get multiple images per variant for your selections, simply upload CSV files that have
                    multiple images for each variant and Kollekt will do the rest. You can also add additional images
                    manually when editing your products.
                </p>

                <h4>Quantity as feedback</h4>
                <p>
                    Last release added the ability to enter a quantity for each variant, when doing alignment. Now you
                    will also have access to this feature, when doing feedback.
                    <br />To start collecting quantity input, all you need to do is add a budget for your selections.
                    <br />Quantity feedback mode will automatically calculate your spend for each selection, to better
                    help you reach your budget targets.
                </p>

                <h4>Advanced filter: selection filter</h4>
                <p>
                    The advanced features now allow selection-based filtering. Advanced filters come in 2 forms. Product
                    filters, and user/selection filters.
                </p>
                <p>
                    <strong>Product filters</strong>: Filter by product data, like price, number of comments, OUTs, etc.
                </p>
                <p>
                    <strong>User/Selection filters</strong>: Filter by a user or selections input. For instance, use it
                    to show only products where your selection has authored requests, a certain user has said “IN”, and
                    much more.
                </p>

                <h4>Allow sub-masters</h4>
                <p>
                    This is the first step towards adding “phases” to a files feedback process. The goal is for Kollekt
                    to be able to handle Handovers and Sales Meetings seamlessly, sharing relevant information between
                    the two and keeping them always in-sync.
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
                    We have made changes to multiple core areas of Kollekt. <br />
                    The filtering options have been vastly improved which enables you to create customized exports.<br />
                    It's now finally possible to have multiple selections in individual presentations!
                </p>
                <p>
                    See the list below for the things we’ve been working on for the last month.<br />
                    In addition to the things you see here, there are bug fixes and refactoring (a fancy word for
                    developer housekeeping).
                </p>

                <h4>Advanced filters</h4>
                <p>
                    We have included the option to use operators (> greater than, &lt; less than, = equal to, and != not
                    equal to) on multiple parameters. This enables you to make custom PDF and .CSV reports and customize
                    your view when going through your collection in Kollekt.
                </p>

                <h4>Selection input filter</h4>
                <p>
                    Choose relevant selections you want to view input from when making decisions.<br />
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
                    We have made it more obvious when a user already exists on a workspace and improved the error
                    message, when the email is in the wrong format.
                </p>

                <h4>Export focus styles</h4>
                <p>
                    It is now possible to only export styles marked with Focus due to the added “Advanced Filter”
                    option.
                </p>

                <h4>Edit product save</h4>
                <p>
                    Pressing save for each field will now also save changes to the product. This should make it easier
                    to get your data saved.
                </p>

                <h4>Allow any selection to be presenting</h4>
                <p>
                    All selections can now enter presentation mode individually.<br />
                    Note that if a parent of a selection enters presentation mode, this will take priority, and
                    broadcast for all children.
                </p>

                <h4>Change settings for multiple selections at once</h4>
                <p>
                    The selections table will now have select-boxes (checkboxes) next to the selection names.<br />
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
            show: 'getShowChangelog',
        }),
    },
    methods: {
        ...mapMutations('changelog', ['SHOW_CHANGELOG']),
    },
}
</script>

<style lang="scss">
@import '~@/_variables.scss';
.changelog {
    .modal {
        width: 80%;
        max-width: 1024px;
        background: $dark;
    }
}
</style>
