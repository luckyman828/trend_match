<template>
    <div
        class="product-wrapper"
        style="display: block; border: solid 2px; border-radius: 4px; margin-top: 12pt"
        :style="[
            { width: exportComments || includeVariants ? '100%' : '336pt' },
            { float: !exportComments && index % 2 == 0 ? 'left' : 'right' },
            { height: includeVariants ? '100%' : '306pt' },
        ]"
    >
        <div
            class="col-wrapper"
            style="display: -webkit-box; -webkit-box-pack: justify; justify-content: space-between;
        padding: 8px 12px 16px; box-sizing: border-box;"
            :style="{ height: includeVariants ? 'auto' : '306pt' }"
        >
            <div
                class="col-left"
                style="display: -webkit-box; -webkit-box-orient: vertical; flex-direction: column;
            -webkit-box-pack: justify; justify-content: space-between; align-items: space-between;"
                :style="{ width: exportComments ? '24%' : '32%' }"
            >
                <div class="row-top">
                    <table class="id">
                        <tr>
                            <td>{{ product.datasource_id }}</td>
                        </tr>
                        <tr>
                            <td style="font-weight: 700;">
                                <h4 style="margin: 0;">{{ product.title }}</h4>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                {{ prettyDates.join(', ') }}
                            </td>
                        </tr>
                    </table>
                </div>
                <div class="row-bottom">
                    <div class="img-sizer" :style="{ width: exportComments ? '160px' : '132px' }">
                        <div
                            class="img-wrapper"
                            style="position: relative; padding-top: 133.3333%;
                        border: solid 2px; height: 0; width: 100%; margin-bottom: 8px;
                        background-size: contain; background-position: center; background-repeat: no-repeat;"
                            :style="{ backgroundImage: `url(${variantImage(product.variants[0])})` }"
                        ></div>
                    </div>
                    <table class="prices">
                        <tr>
                            <td>Retail Price:</td>
                            <td style="text-align: right">{{ product.yourPrice.recommended_retail_price }}</td>
                        </tr>
                        <tr>
                            <td>Mark up:</td>
                            <td style="text-align: right">{{ product.yourPrice.mark_up }}</td>
                        </tr>
                        <tr style="font-weight: 700; ">
                            <td style="padding-top: 2px;">Price ({{ product.yourPrice.currency }})</td>
                            <td style="text-align: right">{{ product.yourPrice.wholesale_price }}</td>
                        </tr>
                    </table>
                </div>
            </div>

            <div
                class="col-mid"
                style="display: -webkit-box; -webkit-box-orient: vertical; flex-direction: column;
            -webkit-box-pack: justify; justify-content: space-between; align-items: space-between;"
                :style="{ width: exportComments ? '24%' : '32%' }"
            >
                <div class="row">
                    <div
                        class="assortments"
                        style="display: -webkit-box; -webkit-box-orient: vertical; flex-direction: column; width: 100%;"
                    >
                        <strong style="font-size: 11px">Assortment Sizes</strong>
                        <p style="margin: 0; font-size: 10px;">{{ product.assortment_sizes.join(', ') }}</p>

                        <strong style="font-size: 11px; margin-top: 8px; display: block;">Assortments</strong>
                        <div
                            v-for="(assortment, index) in product.assortments"
                            :key="index"
                            style="line-height: 1; word-break: break-word; margin-bottom: 2px;"
                        >
                            <span style="font-size: 10px;">{{ assortment.name || 'Unknown assortment' }}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-right" style="" :style="{ width: exportComments ? '49%' : '32%' }">
                <div class="input" v-if="includeDistribution || exportComments">
                    <!-- Alignment -->
                    <div class="alignment-wrapper" style="margin-bottom: 20px; border-bottom: solid 1px #E4E4E4;">
                        <strong style="font-size: 11px; margin-bottom: 4px; display: block;"
                            ><span>Alignment & Requests</span>
                            <span style="margin-left: 20px;"
                                >Total: In:
                                {{ selectionInput.alignmentIns.length + selectionInput.alignmentFocus.length }}; Out:
                                {{ selectionInput.alignmentOuts.length }}</span
                            >
                        </strong>
                        <div
                            class="row"
                            v-for="(action, index) in alignmentListUsers"
                            :key="'alignment-' + index"
                            style="display: -webkit-box; flex-direction: row; width: 100%; align-items: center; border-top: solid 1px #E4E4E4;"
                        >
                            <div style="overflow: hidden; white-space: nowrap; max-width: 80px; min-width: 80px;">
                                <td style="font-size: 10px;">
                                    <span style="font-size: 10px;">{{
                                        `${
                                            getSelectionChapter(action.selection)
                                                ? `[${getSelectionChapter(action.selection).name}] `
                                                : ''
                                        }${action.selection.name}` | truncate(16)
                                    }}</span>
                                </td>
                            </div>
                            <div
                                v-if="includeDistribution"
                                style="font-size: 10px; max-width: 28px; min-width: 28px; margin-left: 16px;"
                                :style="{ textAlign: action.action == 'Out' ? 'right' : 'left' }"
                            >
                                <span
                                    style="font-size: 12px; margin-bottom: -3px; display: block; margin-top: -2px; font-weight: 900;"
                                >
                                    {{
                                        action.action == 'Out'
                                            ? '⨯'
                                            : action.action == 'Focus'
                                            ? '★'
                                            : action.action == 'In'
                                            ? '♥'
                                            : ''
                                    }}
                                </span>
                            </div>
                            <!-- Requests -->
                            <div
                                v-if="exportComments"
                                style="font-size: 10px; -webkit-box-flex: 1; margin-left: 16px; padding: 1px;"
                            >
                                <span
                                    style="font-size: 10px; display: block; margin-bottom: 4px;"
                                    v-for="(request, index) in action.requests"
                                    :key="'request-' + index"
                                >
                                    <strong v-if="request.selection.type == 'Master'">
                                        [{{
                                            request.status == 'Resolved'
                                                ? 'ACCEPTED'
                                                : request.status == 'Rejected'
                                                ? 'REJECTED'
                                                : 'OPEN'
                                        }}]
                                    </strong>
                                    {{ request.content }}
                                </span>
                            </div>
                        </div>
                    </div>

                    <!-- Feedback -->
                    <div class="feedback-wrapper" style="border-bottom: solid 1px #E4E4E4;">
                        <strong style="font-size: 11px; margin-bottom: 4px; display: block;"
                            ><span>Feedback & Comments</span>
                            <span style="margin-left: 20px;"
                                >Total: In: {{ selectionInput.ins.length + selectionInput.focus.length }}; Out:
                                {{ selectionInput.outs.length }}</span
                            >
                        </strong>
                        <div
                            class="row"
                            v-for="(feedback, index) in feedbackListUsers"
                            :key="index"
                            style="display: -webkit-box; flex-direction: row; width: 100%; align-items: center; border-top: solid 1px #E4E4E4;"
                        >
                            <div style="overflow: hidden; white-space: nowrap; max-width: 120px; min-width: 120px;">
                                <td style="font-size: 10px;">
                                    <span style="font-size: 10px;"
                                        >{{ feedback.user ? feedback.user.name : 'Anonymous' | truncate(12) }} ({{
                                            `
                                        ${
                                            getSelectionChapter(feedback.selection)
                                                ? `[${getSelectionChapter(feedback.selection).name}] `
                                                : ''
                                        }(${feedback.selection.name})` | truncate(16)
                                        }})</span
                                    >
                                </td>
                            </div>
                            <div
                                v-if="includeDistribution"
                                style="font-size: 10px; max-width: 28px; min-width: 28px; margin-left: 16px;"
                                :style="{ textAlign: feedback.action == 'Out' ? 'right' : 'left' }"
                            >
                                <span
                                    v-if="feedback.action != 'None'"
                                    style="font-size: 12px; margin-bottom: -3px; display: block; margin-top: -2px; font-weight: 900;"
                                >
                                    {{ feedback.action == 'Out' ? '⨯' : feedback.action == 'Focus' ? '★' : '♥' }}
                                </span>
                            </div>
                            <div
                                v-if="exportComments"
                                style="font-size: 10px; flex: 1; margin-left: 16px; padding: 1px;"
                            >
                                <span
                                    style="font-size: 10px; display: block; margin-bottom: 4px;"
                                    v-for="comment in feedback.comments"
                                    :key="comment.id"
                                >
                                    {{ comment.content }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <VariantList :product="selectionInput" v-if="includeVariants" />
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import VariantList from './VariantList'
import variantImage from '../../mixins/variantImage'

export default {
    name: 'productListItem',
    props: ['product', 'index', 'exportComments', 'includeDistribution', 'includeNotDecided', 'includeVariants'],
    mixins: [variantImage],
    components: {
        VariantList,
    },
    computed: {
        ...mapGetters('selectionProducts', ['getActiveSelectionInput']),
        ...mapGetters('selections', ['getSelectionChapter']),
        prettyDates() {
            return this.product.delivery_dates.map(date => this.getPrettyDate(date, 'short'))
        },
        selectionInput() {
            return this.getActiveSelectionInput(this.product)
        },
        feedbackListUsers() {
            const usersToReturn = []
            // Find the users to add from the feedbacks array
            this.selectionInput.feedbacks.map(feedback => {
                // Don't include undecided users if the setting is set
                if (!this.includeNotDecided && feedback.action == 'None') return
                // Add the users
                usersToReturn.push({
                    user: feedback.user,
                    user_id: feedback.user_id,
                    selection: feedback.selection,
                    selection_id: feedback.selection_id,
                    action: feedback.action,
                    comments: [],
                })
            })
            // Find users from comments
            if (this.exportComments) {
                this.selectionInput.comments.map(comment => {
                    const existingUser = usersToReturn.find(
                        x => x.user_id == comment.user_id && x.selection_id == comment.selection_id
                    )
                    if (existingUser) {
                        existingUser.comments.push(comment)
                    } else {
                        usersToReturn.push({
                            user: comment.user,
                            user_id: comment.user_id,
                            selection: comment.selection,
                            selection_id: comment.selection_id,
                            action: 'None',
                            comments: [comment],
                        })
                    }
                })
            }
            return usersToReturn
        },
        alignmentListUsers() {
            const usersToReturn = []
            // Find the users to add from the feedbacks array
            this.selectionInput.actions.map(action => {
                // Don't include undecided users if the setting is set
                if (!this.includeNotDecided && action.action == 'None') return
                // Add the users
                usersToReturn.push({
                    user: action.user,
                    user_id: action.user_id,
                    selection: action.selection,
                    selection_id: action.selection_id,
                    action: action.action,
                    requests: [],
                })
            })
            // Find users from comments
            if (this.exportComments) {
                this.selectionInput.requests.map(request => {
                    const existingUser = usersToReturn.find(x => x.selection_id == request.selection_id)
                    if (existingUser) {
                        existingUser.requests.push(request)
                    } else {
                        usersToReturn.push({
                            user: request.user,
                            user_id: request.user_id,
                            selection: request.selection,
                            selection_id: request.selection_id,
                            action: 'None',
                            requests: [request],
                        })
                    }
                })
            }
            return usersToReturn
        },
    },
}
</script>

<style></style>
