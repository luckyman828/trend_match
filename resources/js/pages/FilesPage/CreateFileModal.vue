<template>
    <BaseModal :classes="['create-file-modal', currentScreen.name == 'mapFields' ? 'map-fields' : '']" :show="show" @close="$emit('close')"
    ref="modal" :header="currentScreen.header" :goBack="currentScreen.name == 'mapFields'" @goBack="onGoBack">
        <form @submit.prevent enctype="multipart/form-data">

            <template v-if="currentScreen.name == 'chooseFiles'">
                <div class="form-element" style="text-align: center;">
                    <p>A file is a collection of products that users will be able to view in the dashboard and/or app</p>
                    <p><strong>Select CSV files to upload to get started, or create empty file</strong></p>
                </div>

                <div class="form-element">
                    <label for="file-name-input">File name* (required)</label>
                    <input ref="fileNameInput" type="text" id="file-name-input" class="input-wrapper" placeholder="unnamed file" v-model="newFile.name">
                </div>
                <div class="form-element">
                    <BaseDroparea multiple="true"
                    accept="text/csv, .tsv, .csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                    ref="droparea"
                    @input="filesChange">
                        <template v-slot="slotProps">
                            <template v-if="newFile.files.length < 1">
                                <strong>Drop your file(s) here or click to upload</strong>
                                <i class="fal fa-file-csv big-icon primary"></i>
                                <button type="button" class="dark md" @click="slotProps.activate">
                                    <i class="far fa-file-csv"></i>
                                    <span>Browse files</span>
                                </button>
                            </template>
                            <template v-else>
                                <strong>Drag and drop files here to upload</strong>
                                <div class="files-wrapper">
                                    <div class="file-to-upload" v-for="(file, index) in newFile.files" :key="index">
                                        <span>{{file.name}}</span>
                                        <button class="ghost" type="button" @click="removeFile(index)">
                                            <i class="remove far fa-trash-alt"></i>
                                        </button>
                                    </div>
                                </div>
                                <button type="button" class="dark md" @click="slotProps.activate">
                                    <i class="far fa-file-csv"></i>
                                    <span>Browse files</span>
                                </button>
                            </template>
                        </template>
                        <template v-slot:dragDisplay>
                            <i class="big-icon fas fa-smile-beam"></i>
                            <span>Drop file(s) here</span>
                        </template>
                    </BaseDroparea>
                </div>
                <div class="form-controls">
                    <button type="button" class="lg primary ghost" :disabled="newFile.name.length < 1"
                    @click="createEmpty">
                        <span>Create Empty</span>
                    </button>
                    <button type="button" class="lg primary" :disabled="newFile.files.length <= 0 || newFile.name.length <= 0"
                    @click="onGoToMapFields">
                        <span>Next: Map fields</span>
                    </button>
                </div>
            </template>
            <template v-if="currentScreen.name == 'mapFields'">
                <div class="form-element" style="text-align: center;">
                    <!-- <p>Map the fields from your files to Kollekt's data fields</p> -->
                    <p><strong>Select Fields to keep, and match with headers from your file(s).</strong></p>
                </div>

                <div class="map-fields" v-if="!uploadingFile">
                    <div class="tables">

                        <div class="table-wrapper link-ids">
                            <h3>Link IDs <i v-tooltip.right="'Select the ID field for each file to link them'" class="far fa-info-circle"></i></h3>
                            <table class="map-fields-table">
                                <tr class="header">
                                    <th><label>File</label></th>
                                    <th></th>
                                    <th><label>Key to match</label></th>
                                    <th><label>Example</label></th>
                                </tr>
                                <tr v-for="(file, index) in availableFiles" :key="index">
                                    <td><BaseInputField class="input-field" disabled=true :value="file.fileName" readOnly=true /></td>
                                    <td><i class="fas fa-equals"></i></td>
                                    <td><BaseInputField class="input-field" disabled=true :class="{'auto-match': file.key.autoMatch}"
                                    :value="file.key.fieldName" type="select" @click="showSelectKeyContext($event, file)">
                                        <i class="fas fa-caret-down"></i>
                                    </BaseInputField></td>
                                    <td><BaseInputField :errorTooltip="file.keyError" class="input-field" disabled=true readOnly=true
                                        :value="previewExampleValue(file.key, 'datasource_id')"/>
                                    </td>
                                </tr>
                            </table>
                        </div>

                        <div class="table-wrapper map-main-fields">
                            <h3>Map fields</h3>
                            <table class="map-fields-table">
                                <tr class="header">
                                    <th></th>
                                    <th><label>Database</label></th>
                                    <th></th>
                                    <th><label>Matched Datasource</label></th>
                                    <th><label>Example</label></th>
                                </tr>
                                <tr v-for="(field, index) in fieldsToMatch" :key="index" :class="{disabled: !field.enabled}">
                                    <td><BaseCheckbox :value="field.enabled" v-model="field.enabled"/></td>
                                    <td><BaseInputField class="input-field" disabled=true :value="field.displayName" readOnly=true /></td>
                                    <td><i class="fas fa-equals"></i></td>
                                    <td>
                                        <BaseInputField :label="field.newValue.fileIndex != null && availableFiles[field.newValue.fileIndex].fileName" 
                                        class="input-field" :class="{'auto-match': field.newValue.autoMatch}" disabled=true 
                                        :value="field.newValue.fieldName" type="select" @click="showSelectContext($event, field)">
                                            <i class="fas fa-caret-down"></i>
                                        </BaseInputField>
                                    </td>
                                    <td><BaseInputField :errorTooltip="field.error" class="input-field" disabled=true readOnly=true
                                        :value="previewExampleValue(field.newValue, field.name)"/>
                                    </td>
                                </tr>
                            </table>
                        </div>

                         <!-- START Map Variants -->
                        <div class="table-wrapper map-assortments">
                            <h3>Map Variants</h3>

                            <table class="map-fields-table">
                                <tr class="header">
                                    <th></th>
                                    <th><label>Database</label></th>
                                    <th></th>
                                    <th><label>Matched Datasource</label></th>
                                    <th><label>Example</label></th>
                                </tr>
                                <tr v-for="(field, index) in variantFieldsToMatch" :key="index" :class="{disabled: !field.enabled}">
                                    <td><BaseCheckbox :value="field.enabled" v-model="field.enabled"/></td>
                                    <td><BaseInputField class="input-field" disabled=true :value="field.displayName" readOnly=true /></td>
                                    <td><i class="fas fa-equals"></i></td>
                                    <td>
                                        <BaseInputField :label="field.newValue.fileIndex != null && availableFiles[field.newValue.fileIndex].fileName" 
                                        class="input-field" :class="{'auto-match': field.newValue.autoMatch}" disabled=true 
                                        :value="field.newValue.fieldName" type="select" @click="showSelectContext($event, field)">
                                            <i class="fas fa-caret-down"></i>
                                        </BaseInputField>
                                    </td>
                                    <td><BaseInputField :errorTooltip="field.error" class="input-field" disabled=true readOnly=true
                                        :value="previewExampleValue(field.newValue, field.name)"/>
                                    </td>
                                </tr>
                                <tr v-for="(field, index) in variantImagesToMap" :key="'variant-image-'+index" :class="{disabled: !field.enabled}"
                                class="variant-image-row">
                                    <td><BaseCheckbox :value="field.enabled" v-model="field.enabled"/></td>
                                    <td><BaseInputField class="input-field" disabled=true :value="field.displayName" readOnly=true /></td>
                                    <td><i class="fas fa-equals"></i></td>
                                    <td>
                                        <BaseInputField :label="field.newValue.fileIndex != null && availableFiles[field.newValue.fileIndex].fileName" 
                                        class="input-field" :class="{'auto-match': field.newValue.autoMatch}" disabled=true 
                                        :value="field.newValue.fieldName" type="select" @click="showSelectContext($event, field)">
                                            <i class="fas fa-caret-down"></i>
                                        </BaseInputField>
                                    </td>
                                    <td><BaseInputField :errorTooltip="field.error" class="input-field" disabled=true readOnly=true
                                        :value="previewExampleValue(field.newValue, field.name)"/>
                                    </td>

                                    <td>
                                        <button class="dark ghost remove-variant-image"
                                        @click="variantImagesToMap.splice(index, 1)">
                                            <i class="far fa-trash-alt"></i>
                                        </button>
                                    </td>
                                </tr>
                            </table>

                            <button class="dark" style="margin-top: 12px"
                            @click="variantImagesToMap.push(JSON.parse(JSON.stringify(variantImageDefaultObject)))">
                                <i class="fas fa-plus"></i><span>Add variant image map</span>
                            </button>
                        </div>
                        <!-- END Map Variants -->

                        <div class="table-wrapper map-currencies">
                            <h3>Map currencies</h3>
                            <table class="single-currency-file-table">
                                <tr>
                                    <td><BaseCheckbox :value="true" v-model="singleCurrencyFile"/></td>
                                    <td><p>One CSV contains all currencies in a single header <span class="small">(i.e. there is a header like "currency" in a csv)</span></p></td>
                                </tr>
                            </table>
                            <div class="currency-wrapper" v-for="(currency, index) in currenciesToMatch" :key="index">
                                <template v-if="!singleCurrencyFile || index < 1">
                                    <h4 v-if="!singleCurrencyFile">Currency {{index+1}}</h4>
                                    <div class="currency-header" v-if="!singleCurrencyFile">
                                        <div class="left">
                                            <table class="map-fields-table">
                                                <tr class="header">
                                                    <th></th>
                                                    <th><label :for="'currency-'+index+'-name'">Currency Name (ex. EUR)</label></th>
                                                    <th></th>
                                                    <th><label :for="'currency-'+index+'-file'">Linked File</label></th>
                                                </tr>
                                                <tr>
                                                    <td></td>
                                                    <td><BaseInputField :id="'currency-'+index+'-name'" :errorTooltip="currency.nameError"
                                                    class="input-field" placeholder="Fx. EUR" v-model="currency.currencyName"
                                                    @blur="validateCurrency(currency)"
                                                    @input.native="currency.currencyName = currency.currencyName.toUpperCase()"/></td>
                                                    <td><i class="fas fa-equals"></i></td>
                                                    <td><BaseInputField :id="'currency-'+index+'-file'" 
                                                    class="input-field" disabled=true
                                                    :value="currency.fileIndex != null ? availableFiles[currency.fileIndex].fileName : null" 
                                                    type="select" @click="showSelectCurrencyFileContext($event, currency)">
                                                        <i class="fas fa-caret-down"></i>
                                                    </BaseInputField></td>
                                                </tr>
                                            </table>
                                        </div>
                                        <button v-if="index > 0" class="dark" @click="currenciesToMatch.splice(index,1)">
                                            <i class="fas fa-trash-alt"></i><span>Remove currency</span>
                                        </button>
                                    </div>
                                    <table class="map-fields-table">
                                        <tr class="header">
                                            <th></th>
                                            <th><label>Database</label></th>
                                            <th></th>
                                            <th><label>Matched Datasource</label></th>
                                            <th><label>Example</label></th>
                                        </tr>
                                        <tr v-for="(field, index) in currency.fieldsToMatch" :key="index" :class="{disabled: !field.enabled}">
                                            <template v-if="field.name != 'currency' || singleCurrencyFile">
                                                <td><BaseCheckbox v-if="field.name != 'currency' || singleCurrencyFile" :value="field.enabled" v-model="field.enabled"/></td>
                                                <td><BaseInputField class="input-field" disabled=true :value="field.displayName" readOnly=true /></td>
                                                <td><i class="fas fa-equals"></i></td>
                                                <td><BaseInputField :readOnly="currency.fileIndex == null"
                                                v-tooltip="currency.fileIndex == null && 'You must select a file to map first'"
                                                :label="field.newValue.fileIndex != null && availableFiles[field.newValue.fileIndex].fileName" 
                                                class="input-field" :class="{'auto-match': field.newValue.autoMatch}" disabled=true 
                                                :value="field.newValue.fieldName" type="select" 
                                                @click="currency.fileIndex != null && showSelectContext($event, field, currency)">
                                                    <i class="fas fa-caret-down"></i>
                                                </BaseInputField></td>
                                                <td><BaseInputField :errorTooltip="field.error" class="input-field" disabled=true readOnly=true
                                                    :value="previewExampleValue(field.newValue, field.name)"/>
                                                </td>
                                            </template>
                                        </tr>
                                    </table>
                                </template>
                            </div>
                            <button v-if="!singleCurrencyFile" class="dark" 
                            @click="currenciesToMatch.push(JSON.parse(JSON.stringify(currencyDefaultObject)))">
                                <i class="fas fa-plus"></i><span>Add currency</span>
                            </button>
                        </div>

                        <!-- START Map Assortments -->
                        <div class="table-wrapper map-assortments">
                            <h3>Map Assortments</h3>
                            <div class="assortment-wrapper" v-for="(assortment, index) in assortmentsToMatch" :key="index">
                                <h4>Assortment {{index+1}}</h4>
                                <div class="assortment-header">
                                    <div class="left">
                                        <table class="map-fields-table">
                                            <tr class="header">
                                                <th></th>
                                                <th><label :for="'assortment-'+index+'-file'">Linked File</label></th>
                                            </tr>
                                            <tr>
                                                <td></td>
                                                <td><BaseInputField :id="'assortment-'+index+'-file'" 
                                                class="input-field" disabled=true
                                                :value="assortment.fileIndex != null ? availableFiles[assortment.fileIndex].fileName : null" 
                                                type="select" @click="showSelectAssortmentFileContext($event, assortment)">
                                                    <i class="fas fa-caret-down"></i>
                                                </BaseInputField></td>
                                            </tr>
                                        </table>
                                    </div>
                                    <button v-if="index > 0" class="dark" @click="assortmentsToMatch.splice(index,1)">
                                        <i class="fas fa-trash-alt"></i><span>Remove assortment</span>
                                    </button>
                                </div>
                                <table class="map-fields-table">
                                    <tr class="header">
                                        <th></th>
                                        <th><label>Database</label></th>
                                        <th></th>
                                        <th><label>Matched Datasource</label></th>
                                        <th><label>Example</label></th>
                                    </tr>
                                    <tr v-for="(field, index) in assortment.fieldsToMatch" :key="index" :class="{disabled: !field.enabled}">
                                        <td><BaseCheckbox :value="field.enabled" v-model="field.enabled"/></td>
                                        <td><BaseInputField class="input-field" disabled=true :value="field.displayName" readOnly=true /></td>
                                        <td><i class="fas fa-equals"></i></td>
                                        <td><BaseInputField :readOnly="assortment.fileIndex == null"
                                        v-tooltip="assortment.fileIndex == null && 'You must select a file to map first'"
                                        :label="field.newValue.fileIndex != null && availableFiles[field.newValue.fileIndex].fileName" 
                                        class="input-field" :class="{'auto-match': field.newValue.autoMatch}" disabled=true 
                                        :value="field.newValue.fieldName" type="select" 
                                        @click="assortment.fileIndex != null && showSelectContext($event, field, assortment)">
                                            <i class="fas fa-caret-down"></i>
                                        </BaseInputField></td>
                                        <td><BaseInputField :errorTooltip="field.error" class="input-field" disabled=true readOnly=true
                                            :value="previewExampleValue(field.newValue, field.name)"/>
                                        </td>
                                    </tr>
                                </table>
                            </div>
                            <button class="dark" 
                            @click="assortmentsToMatch.push(JSON.parse(JSON.stringify(assortmentDefaultObject)))">
                                <i class="fas fa-plus"></i><span>Add assortment</span>
                            </button>
                        </div>
                        <!-- END Map Assortments -->

                    </div>

                </div>

                <BaseLoader v-else :msg="submitStatus"/>

                <div class="form-controls">
                    <BaseButton :disabled="!submitValid || uploadingFile" :type="'submit'" buttonClass="lg primary full-width"
                    style="width: 100%"
                    @click="submitFiles">
                        <span>Create file</span>
                    </BaseButton>
                </div>
            </template>

        </form>

        <BaseContextMenu ref="contextSelectFileKey" class="context-select-key">
            <template v-slot:header>
                Select key to link
            </template>
            <template v-slot="slotProps">
                <div class="item-group">
                    <BaseSelectButtons :type="'radio'" :unsetOption="'Remove mapping'" @unset="slotProps.item.newValue={fileIndex: null, fieldName: null, fieldIndex: null}"
                    :options="slotProps.item.headers" :optionNameKey="'fieldName'"
                    v-model="slotProps.item.key" :submitOnChange="true" :search="true" @submit="validateKey(slotProps.item);slotProps.hide()"/>
                </div>
            </template>
        </BaseContextMenu>

        <BaseContextMenu ref="contextSelectField" class="context-select-field">
            <template v-slot:header>
                Select field to match
            </template>
            <template v-slot="slotProps">
                <div class="item-group">
                    <BaseSelectButtons :type="'radio'" :unsetOption="'Remove mapping'" 
                    @unset="slotProps.item.newValue={fileIndex: null, fieldName: null, fieldIndex: null};slotProps.item.error=false;slotProps.hide()"
                    :options="filesToChooseFrom" multipleOptionArrays="true" optionGroupNameKey="fileName" optionGroupOptionsKey="headers"
                    v-model="slotProps.item.newValue" :submitOnChange="true" :optionDescriptionKey="'fileName'"
                    :optionNameKey="'fieldName'" :search="true" @submit="validateField(slotProps.item);slotProps.hide()"/>
                </div>
            </template>
        </BaseContextMenu>

        <BaseContextMenu ref="contextSelectCurrencyFile" class="context-select-file">
            <template v-slot:header>
                Select file to match
            </template>
            <template v-slot="slotProps">
                <div class="item-group">
                    <BaseSelectButtons :type="'radio'" :unsetOption="'Remove mapping'" 
                    @unset="slotProps.item.fileIndex = null;slotProps.hide()"
                    :options="availableFiles"
                    v-model="slotProps.item.fileIndex" :submitOnChange="true" :optionValueKey="'index'"
                    :optionNameKey="'fileName'" @submit="autoMapCurrency(slotProps.item);slotProps.hide()"/>
                </div>
            </template>
        </BaseContextMenu>

        <BaseContextMenu ref="contextSelectAssortmentFile" class="context-select-file">
            <template v-slot:header>
                Select file to match
            </template>
            <template v-slot="slotProps">
                <div class="item-group">
                    <BaseSelectButtons :type="'radio'" :unsetOption="'Remove mapping'" 
                    @unset="slotProps.item.fileIndex = null;slotProps.hide()"
                    :options="availableFiles"
                    v-model="slotProps.item.fileIndex" :submitOnChange="true" :optionValueKey="'index'"
                    :optionNameKey="'fileName'" @submit="autoMapAssortment(slotProps.item);slotProps.hide()"/>
                </div>
            </template>
        </BaseContextMenu>

    </BaseModal>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import workbookUtils from '../../mixins/workbookUtils'

export default {
    name: 'createFileModal',
    mixins: [
        workbookUtils
    ],
    props: [
        'show'
    ],
    data: function () { return {
        currentScreen: {name: 'chooseFiles', header: 'Create new file'},
        defalultNewFile: {
            id: null,
            name: 'New file',
            type: 'File',
            files: [],
        },
        filesToChooseFrom: [],
        newFile: null,
        uploadingFile: false,
        submitStatus: null,
        availableFiles: [],
        filePreviews: [],
        singleCurrencyFile: false,
        fieldsToMatch: [
            {name: 'title', displayName: 'Name',  newValue: {fileIndex: null, fieldName: null, fieldIndex: null}, enabled: true, error: false, 
            headersToMatch: ['title','name','style name','product name' ,'style_name', 'product_name']},
            {name: 'sale_description', displayName: 'Description',  newValue: {fileIndex: null, fieldName: null, fieldIndex: null}, enabled: true, error: false, 
            headersToMatch: ['description','sales description']},
            {name: 'brand', displayName: 'Brand',  newValue: {fileIndex: null, fieldName: null, fieldIndex: null}, enabled: true, error: false, 
            headersToMatch: ['brand','brand name', 'brand_name']},
            {name: 'category', displayName: 'Category',  newValue: {fileIndex: null, fieldName: null, fieldIndex: null}, enabled: true, error: false, 
            headersToMatch: ['category','style category','product category']},
            {name: 'min_order', displayName: 'Minimum Order Quantity',  newValue: {fileIndex: null, fieldName: null, fieldIndex: null}, enabled: true, error: false, 
            headersToMatch: ['minimum','minimum quantity','quantity','minimum order quantity','order minimum','order minimum quantity']},
            {name: 'min_variant_order', displayName: 'Minimum Variant Quantity',  newValue: {fileIndex: null, fieldName: null, fieldIndex: null}, enabled: true, error: false, 
            headersToMatch: ['variant minimum','variant minimum quantity','minimum variant','minimum variant quantity','color minimum','colour minimum','minimum per color']},
            {name: 'composition', displayName: 'Composition',  newValue: {fileIndex: null, fieldName: null, fieldIndex: null}, enabled: true, error: false, 
            headersToMatch: ['composition','materials','quality','material']},
            {name: 'delivery_date', displayName: 'Delivery (date/month)',  newValue: {fileIndex: null, fieldName: null, fieldIndex: null}, enabled: true, error: false, 
            headersToMatch: ['delivery','delivery date','delivery month','del. date','del. month','del. period','delivery period']},
            {name: 'editors_choice', displayName: 'Editors Choice',  newValue: {fileIndex: null, fieldName: null, fieldIndex: null}, enabled: true, error: false, 
            headersToMatch: ['editors choice','focus','focus style','focus product']},
            {name: 'eans', displayName: 'EANs',  newValue: {fileIndex: null, fieldName: null, fieldIndex: null}, enabled: true, error: false, 
            headersToMatch: ['eans','ean','variant ean','style ean', 'ean_no']},
            {name: 'buying_group', displayName: 'Buyer Group',  newValue: {fileIndex: null, fieldName: null, fieldIndex: null}, enabled: true, error: false, 
            headersToMatch: ['buyer group','buyer','pricelist', 'buying group']},
        ],
       variantFieldsToMatch: [
            {name: 'variant_name', displayName: 'Variant Name',  newValue: {fileIndex: null, fieldName: null, fieldIndex: null}, enabled: true, error: false, 
            headersToMatch: ['color','colour','variant','variant name','color name','colour name','main colour name', 'colour_name']},
            {name: 'sizes', displayName: 'Variant Sizes',  newValue: {fileIndex: null, fieldName: null, fieldIndex: null}, enabled: true, error: false, 
            headersToMatch: ['sizes','variant sizes','size','variant size']},
        ],
        variantImagesToMap: [
            {name: 'image', displayName: 'Variant Image URL',  newValue: {fileIndex: null, fieldName: null, fieldIndex: null}, enabled: true, error: false, 
            headersToMatch: ['picture url','image url','img url','picture','image','img', 'variant image']},
        ],
        variantImageDefaultObject: {
            name: 'image', displayName: 'Variant Image URL',  newValue: {fileIndex: null, fieldName: null, fieldIndex: null}, enabled: true, error: false, 
            headersToMatch: ['picture url','image url','img url','picture','image','img', 'variant image']
        },
        currencyDefaultObject: {
            currencyName: '',
            nameError: null,
            fileIndex: null,
            fieldsToMatch: [
                {name: 'currency', displayName: 'Currency Name',  newValue: {fileIndex: null, fieldName: null, fieldIndex: null}, enabled: true, error: false, 
                headersToMatch: ['currency','currency name']},
                {name: 'mark_up', displayName: 'Mark Up',  newValue: {fileIndex: null, fieldName: null, fieldIndex: null}, enabled: true, error: false, 
                headersToMatch: ['markup','mark up']},
                {name: 'wholesale_price', displayName: 'Wholesale Price',  newValue: {fileIndex: null, fieldName: null, fieldIndex: null}, enabled: true, error: false, 
                headersToMatch: ['whs','wholesale price','whs price']},
                {name: 'recommended_retail_price', displayName: 'Recommended Retail Price',  newValue: {fileIndex: null, fieldName: null, fieldIndex: null}, enabled: true, error: false, 
                headersToMatch: ['rrp','recommended retail price','retail price']},
            ]
        },
        currenciesToMatch: [{
            currencyName: '',
            nameError: null,
            fileIndex: null,
            fieldsToMatch: [
                {name: 'currency', displayName: 'Currency Name',  newValue: {fileIndex: null, fieldName: null, fieldIndex: null}, enabled: true, error: false, 
                headersToMatch: ['currency','currency name']},
                {name: 'mark_up', displayName: 'Mark Up',  newValue: {fileIndex: null, fieldName: null, fieldIndex: null}, enabled: true, error: false, 
                headersToMatch: ['markup','mark up']},
                {name: 'wholesale_price', displayName: 'Wholesale Price',  newValue: {fileIndex: null, fieldName: null, fieldIndex: null}, enabled: true, error: false, 
                headersToMatch: ['whs','wholesale price','whs price']},
                {name: 'recommended_retail_price', displayName: 'Recommended Retail Price',  newValue: {fileIndex: null, fieldName: null, fieldIndex: null}, enabled: true, error: false, 
                headersToMatch: ['rrp','recommended retail price','retail price']},
            ]
        }],
        assortmentDefaultObject: {
            fileIndex: null,
            fieldsToMatch: [
                {name: 'name', displayName: 'Assortment Name',  newValue: {fileIndex: null, fieldName: null, fieldIndex: null}, enabled: true, error: false, 
                headersToMatch: ['assortment name','box name', 'ass name']},
                {name: 'box_ean', displayName: 'Assortment Box EAN',  newValue: {fileIndex: null, fieldName: null, fieldIndex: null}, enabled: true, error: false, 
                headersToMatch: ['box ean','assortment box ean','assortment ean', 'ass ean']},
                {name: 'box_size', displayName: 'Assortment Box Size',  newValue: {fileIndex: null, fieldName: null, fieldIndex: null}, enabled: true, error: false, 
                headersToMatch: ['box size','assortment box size', 'ass.', 'ass size', 'assortment size']},
            ]
        },
        assortmentsToMatch: [{
            fileIndex: null,
            fieldsToMatch: [
                {name: 'name', displayName: 'Assortment Name',  newValue: {fileIndex: null, fieldName: null, fieldIndex: null}, enabled: true, error: false, 
                headersToMatch: ['assortment name','box name', 'ass name']},
                {name: 'box_ean', displayName: 'Assortment Box EAN',  newValue: {fileIndex: null, fieldName: null, fieldIndex: null}, enabled: true, error: false, 
                headersToMatch: ['box ean','assortment box ean','assortment ean', 'ass ean']},
                {name: 'box_size', displayName: 'Assortment Box Size',  newValue: {fileIndex: null, fieldName: null, fieldIndex: null}, enabled: true, error: false, 
                headersToMatch: ['box size','assortment box size', 'ass.', 'ass size', 'assortment size']},
            ]
        }]
    }},
    computed: {
        ...mapGetters('workspaces', ['currentWorkspace']),
        ...mapGetters('files', ['currentFolder']),
        submitValid() {
            //assume true
            let valid = true
            // Check that all files have a valid key
            this.availableFiles.forEach(file => {
                if (file.key.fileIndex == null) {
                    valid = false
                }
            })
            // Loop through the fields and look for errors
            this.fieldsToMatch.forEach(field => {
                // Check if the field has been mapped
                if (field.enabled && field.newValue.fieldIndex != null) {
                    if (!this.validateField(field)) {
                        valid = false
                    }
                }
            })
            // Loop through the currencies and look check their names
            if (!this.singleCurrencyFile) {
                this.currenciesToMatch.forEach(currency => {
                    if(currency.fileIndex != null && !this.validateCurrency(currency)) {
                        valid = false
                    }
                })
            }
            return valid
        }
    },
    watch: {
        show(newVal, oldVal) {
            if (newVal && this.currentScreen.name == 'chooseFiles') {
                this.$nextTick(() => {
                    this.$nextTick(() => {
                        this.$refs.fileNameInput.focus()
                        this.$refs.fileNameInput.select()
                    })
                })
            }
        }
    },
    methods: {
        ...mapActions('files', ['insertOrUpdateFile', 'syncExternalImages']),
        ...mapActions('products', ['insertProducts', 'uploadImage' ,'updateManyProducts']),
        ...mapMutations('alerts', ['SHOW_SNACKBAR']),
        previewExampleValue(newValue, fieldName) {
            const files = this.availableFiles
            // First check that we have any previews available, and that we have a new value defined
            if (files.length > 0 && newValue.fileIndex != null && newValue.fieldIndex != null) {
                const csvFile = files[newValue.fileIndex]
                const fieldValue = csvFile.lines[0][newValue.fieldIndex]
                return fieldValue
            }
            return 'Not matched'
        },
        validateCurrency(currency) {
            if (currency.currencyName.length != 3) {
                currency.nameError = 'Currency must be a <strong>3 letter</strong> currency code.'
                return false
            } else {
                currency.nameError = null
                return true
            }
        },
        validateKey(file) {
            // Assume no error
            file.keyError = false   
        },
        validateField(field, limit=10) {
            const fieldName = field.name
            // Find the file the field is mapped to
            const file = this.availableFiles[field.newValue.fileIndex]

            // Assume no error
            let valid = true
            field.error = false

            // Set the limit to a maximum of the number of lines in the file
            const linesToValidate = file.lines.length < limit ? file.lines.length : limit

            // Test n values
            for (let i = 0;i<linesToValidate;i++) {
                // Find the field value
                const fieldValue = file.lines[i][field.newValue.fieldIndex]

                // Test that the field actually has a value
                if (fieldValue && valid) {

                    // Test for integers
                    if (['min_order','min_variant_order','box_size','eans','mark_up','recommended_retail_price','wholesale_price'].includes(fieldName)) {
                        if (isNaN(fieldValue)) {
                            field.error = `Must be a <strong>number</strong>.
                            <br>Found value: <i>${fieldValue}</i> on <strong>line ${i+2}</strong>`
                            valid = false
                        }
                    }
                    // Test for correct date
                    if (['delivery_date'].includes(fieldName)) {
                        // Check for special cases where the date is of format mmm-yy ("jan-20") which will be parsed incorrectly by the new Date() function
                        // Regex that looks for a work with exactly 3 characters between A-z.
                        const reg = new RegExp('\\b[A-z]{3}\\b')
                        let valueToTest = JSON.parse(JSON.stringify(fieldValue))
                        if (reg.test(valueToTest)) {
                            // If true then add a "1-" to the date to avoid ambiguity
                            valueToTest= '1-' + valueToTest
                        }
                        const dateValue = new Date (valueToTest)
                        if (!dateValue instanceof Date || isNaN(dateValue)) {
                            field.error = `Invalid <strong>Date format</strong>.
                            <br>Found value: <i>${fieldValue}</i> on <strong>line ${i+2}</strong>
                            <br>Make sure that values only contain <strong>English</strong> month names`
                            valid = false
                        }
                    }
                    // Test for correct url
                    if (['image'].includes(fieldName)) {
                        const urlReg = new RegExp(/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&\/\/=]*)/)
                        if (!urlReg.test(fieldValue)) {
                            field.error = `Must be a <strong>valid URL</strong>.
                            <br>Found value: <i>${fieldValue}</i> on <strong>line ${i+2}</strong>`
                            valid = false
                        }
                    }

                    // Test for correct currency
                    if (this.singleCurrencyFile && ['currency'].includes(fieldName)) {
                        if (fieldValue.length != 3) {
                            field.error = `Currency must be a <strong>3 letter</strong> currency code.
                            <br>Found value: <i>${fieldValue}</i> on <strong>line ${i+2}</strong>`
                            valid = false
                        }
                    }
                }
            }
            return valid
        },
        filesChange(fileList) {
            const files = fileList
            for (let i = 0; i < files.length; i++) {
                const file = files[i]
                // const extension = file.name.split('.').pop();

                // Check that the file is a csv
                // if (extension == 'csv' || extension == 'tsv') {
                    if (!this.newFile.files.find(x => x.name == file.name)) {
                        this.newFile.files.push(file)
                    }
                // } else {
                //     // Throw error
                //     // console.log('invalid file extension')
                // }
            }
        },
        removeFile(index) {
            this.newFile.files.splice(index, 1)
        },
        createEmpty() {
            // Create a copy of the new file object
            const newFile = JSON.parse(JSON.stringify(this.newFile))
            newFile.id = null
            newFile.parent_id = this.currentFolder ? this.currentFolder.id : 0
            newFile.workspace_id = this.currentWorkspace.id
            this.insertOrUpdateFile(newFile)
            // Reset modal
            this.$emit('close')
            this.reset()
        },
        onGoToMapFields() {
            //Change the current screen
            this.currentScreen={name: 'mapFields', header: 'Map fields'}
            // Process the uploaded files
            this.newFile.files.forEach(file => {
                const fileReader = new FileReader()
                // fileReader.readAsText(file, 'ISO-8859-4')
                // fileReader.readAsText(file, 'ISO-8859-4')
                fileReader.readAsArrayBuffer(file, 'ISO-8859-4')
                fileReader.onload = e => this.processFile(e.target.result, file.name)
            })
        },
        onGoBack() {
            //Change the current screen
            this.currentScreen={name: 'chooseFiles', header: 'Create new file'}
        },
        processFile(workbook, fileName) {
            const allLines = this.parseWorkbookToRowsAndCells(workbook)

            // Check if the file already exists. If so, replace it instead of adding
            const existingFile = this.availableFiles.find(x => x.fileName == fileName)


            // Use the first line as headers (splice removes the first line)
            const allHeaders = allLines.splice(0,1)[0]
            const csvHeaders = allHeaders.map((header, index) => {
                return {
                    fileIndex: existingFile ? existingFile.headers[0].fileIndex : this.availableFiles.length, 
                    fieldName: header, 
                    fieldIndex: index
                }
            })
            const fileToPush = {fileName, key: {fileIndex: null, fieldName: null, fieldIndex: null}, headers: csvHeaders, lines: allLines, error: false}
            if (existingFile) {
                // existingFile = fileToPush
                Object.assign(existingFile, fileToPush)
            } else {
                this.availableFiles.push(fileToPush)
            }
            const fileIndex = existingFile ? existingFile.headers[0].fileIndex : this.availableFiles.length -1
            this.autoMapHeaders(existingFile ? existingFile : fileToPush, fileIndex)
        },
        autoMapHeaders(file, fileIndex) {
            // Loop through the fields we still need to match to a header
            this.fieldsToMatch.concat(this.variantFieldsToMatch).concat(this.variantImagesToMap).forEach(field => {
                if (field.enabled && field.newValue.fileIndex == null && field.newValue.fieldIndex == null) {
                    // Test if the current header has a file that matches
                    const autoMatchIndex = file.headers.findIndex(header => {
                        return field.headersToMatch.includes(header.fieldName.toLowerCase()) 
                    })
                    if (autoMatchIndex >= 0) {
                        const newValueToPush = {fileIndex: fileIndex, fieldName: file.headers[autoMatchIndex].fieldName, fieldIndex: autoMatchIndex, autoMatch: true}
                        field.newValue = newValueToPush
                        // Validate the value of the new mapping
                        this.validateField(field)
                    }
                }
            })

            // Step 2: Match Keys (ID)
            // Check if the file already has a key
            if (file.key.fieldIndex == null) {
                const keysToMatch = ['id','style number','style no','style no.','product id','number', 'style_no', 'style_number']
                let keyAutoMatchIndex = file.headers.findIndex(header => keysToMatch.includes(header.fieldName.toLowerCase()))
                if (keyAutoMatchIndex >= 0) {
                    const keyToPush = {fileIndex: fileIndex, fieldName: file.headers[keyAutoMatchIndex].fieldName, fieldIndex: keyAutoMatchIndex, autoMatch: true}
                    file.key = keyToPush
                    // Validate the value of the new mapping
                    this.validateKey(file)
                }
            }
        },
        autoMapCurrency(currency) {
            // Loop through the fields we still need to match to a header
            const file = this.availableFiles[currency.fileIndex]
            currency.fieldsToMatch.forEach(field => {
                if (field.enabled && field.newValue.fileIndex == null && field.newValue.fieldIndex == null) {
                    // Test if the current header has a file that matches
                    const autoMatchIndex = file.headers.findIndex(header => {
                        return field.headersToMatch.includes(header.fieldName.toLowerCase()) 
                    })
                    if (autoMatchIndex >= 0) {
                        const newValueToPush = {fileIndex: currency.fileIndex, fieldName: file.headers[autoMatchIndex].fieldName, fieldIndex: autoMatchIndex, autoMatch: true}
                        field.newValue = newValueToPush
                        // Validate the value of the new mapping
                        this.validateField(field)
                    }
                }
            })
        },
        autoMapAssortment(assortment) {
            // Loop through the fields we still need to match to a header
            const file = this.availableFiles[assortment.fileIndex]
            assortment.fieldsToMatch.forEach(field => {
                if (field.enabled && field.newValue.fileIndex == null && field.newValue.fieldIndex == null) {
                    // Test if the current header has a file that matches
                    const autoMatchIndex = file.headers.findIndex(header => {
                        return field.headersToMatch.includes(header.fieldName.toLowerCase()) 
                    })
                    if (autoMatchIndex >= 0) {
                        const newValueToPush = {fileIndex: assortment.fileIndex, fieldName: file.headers[autoMatchIndex].fieldName, fieldIndex: autoMatchIndex, autoMatch: true}
                        field.newValue = newValueToPush
                        // Validate the value of the new mapping
                        this.validateField(field)
                    }
                }
            })
        },
        showSelectContext(e, field, context) {
            const contextMenu = this.$refs.contextSelectField
            this.filesToChooseFrom = this.availableFiles
            if (context && context.fileIndex != null) {
                this.filesToChooseFrom = [this.availableFiles[context.fileIndex]]
            }
            contextMenu.item = field
            contextMenu.show(e)
        },
        showSelectKeyContext(e, file) {
            const contextMenu = this.$refs.contextSelectFileKey
            contextMenu.item = file
            contextMenu.show(e)
        },
        showSelectCurrencyFileContext(e, currency) {
            const contextMenu = this.$refs.contextSelectCurrencyFile
            contextMenu.item = currency
            contextMenu.show(e)
        },
        showSelectAssortmentFileContext(e, assortment) {
            const contextMenu = this.$refs.contextSelectAssortmentFile
            contextMenu.item = assortment
            contextMenu.show(e)
        },
        async getImageFromURL(url) {
            // Send a request to get the image
            let image
            await axios.get(url, {responseType: 'blob'}).then(response => {
                image = response.data
            }).catch(err => {
                image = false
                this.SHOW_SNACKBAR({ 
                    msg: `
                        <p><strong>Hey you!</strong><br></p>
                        <p>We will display your image(s) from <u>${url.substr(0, url.indexOf('/', 10))}</u>.</p>
                        <p>This will most likely not be a problem, but it means that we are not hosting the images, and can't guarantee that they will always be available.</p>
                        <p>if you see this icon <i class="far fa-heart-broken primary"></i> it means that we cant fetch the image.</p>`,
                    type: 'info', 
                    iconClass: 'fa-info-circle', 
                })
            })
            return image
        },
        instantiateProducts() {
            const productsToReturn = []
            
            // STEP 1) Loop through each of our available files and instantiate our products by key
            let fileIndex = 0
            this.availableFiles.forEach(file => {
                // Check that the file has been linked by id key
                if (file.key.fieldIndex != null) {
                    // Loop through the files lines and instantiate product
                    file.lines.forEach(line => {
                        // PRODUCTS
                        // Find the key value that we will use to check for unique products
                        const keyValue = line[file.key.fieldIndex]
                        // Check that the value does not already exists
                        let product = productsToReturn.find(x => x.datasource_id == keyValue)
                        if (!product) {
                            product = {
                                datasource_id: keyValue,
                                variants: [],
                                assortments: [],
                                prices: [],
                                eans: []
                            }
                            productsToReturn.push(product)
                        }

                        // VARIANTS
                        // Find / Instantiate this lines variant
                        let variantKeyField = this.variantFieldsToMatch.find(x => x.name == 'variant_name')
                        let variant = null
                        // Check that the variant key is from this file
                        if (variantKeyField.newValue.fileIndex == fileIndex && variantKeyField.newValue.fieldIndex != null) {
                            // Find the variant keys index
                            let variantKeyIndex = variantKeyField.newValue.fieldIndex
                            // Find the variant keys value
                            let variantKeyValue = line[variantKeyIndex]
                            // Find this lines variant name
                            variant = product.variants.find(x => x.name == variantKeyValue)
                            if (!variant) {
                                variant = {
                                    id: this.$uuid.v4(),
                                    name: variantKeyValue,
                                    image: null,
                                    images: [],
                                    pictures: [],
                                    sizes: []
                                }
                                product.variants.push(variant)
                            }
                        }

                        let assortment = null
                        let assortments = this.assortmentsToMatch
                        
                        // Loop through our assortments to match
                        assortments.forEach(thisAssortmentObject => {

                            if (thisAssortmentObject.fileIndex == fileIndex) {
                                // Instantiate an assortment object
                                // FieldsToMatch[0] = assortment name
                                const assortmentName = line[thisAssortmentObject.fieldsToMatch[0].newValue.fieldIndex]
                                assortment = product.assortments.find(x => x.name == assortmentName)
                                if (!!assortment || assortmentName) {
                                    if (!assortment) {
                                        assortment = {
                                            name: assortmentName,
                                            box_size: null,
                                            box_ean: null,
                                        }
                                        product.assortments.push(assortment)
                                    }
                                    // Loop through the currencies fields
                                    thisAssortmentObject.fieldsToMatch.forEach(field => {
                                        if (field.enabled && field.newValue.fileIndex == fileIndex) {
                                            const assortmentFieldValue = line[field.newValue.fieldIndex]
                                            const assortmentFieldName = field.name
                                            assortment[assortmentFieldName] = assortmentFieldValue
                                        }
                                    })
                                }
                            }
                        })

                        // CURRENCIES
                        // Find / Instantiate this lines currencies
                        let currency = null
                        let currencies = this.currenciesToMatch
                        
                        // Check if we have single file containing all currencies
                        if (this.singleCurrencyFile) {
                            currencies = [this.currenciesToMatch[0]]
                            let currencyObject = this.currenciesToMatch[0]
                            // If so instantiate currencies the same way as we do for variants and assortments
                            let currencyKeyField = currencyObject.fieldsToMatch.find(x => x.name == 'currency')
                            // Check if the mapped currency field belongs to this file and is mapped
                            if (currencyKeyField.newValue.fileIndex == fileIndex && currencyKeyField.newValue.fieldIndex != null) {
                                // Find the currency keys index
                                let currencyKeyIndex = currencyKeyField.newValue.fieldIndex
                                // Find the currency keys value
                                let currencyKeyValue = line[currencyKeyIndex]
                                // Find this lines variant name
                                currency = product.prices.find(x => x.currency == currencyKeyValue)

                                if (!currency) {
                                    currency = {
                                        currency: currencyKeyValue,
                                        wholesale_price: 0,
                                        recommended_retail_price: 0,
                                        mark_up: 0
                                    }
                                    product.prices.push(currency)
                                }
                            }
                        }

                        // Loop through our currencies to match
                        currencies.forEach(thisCurrencyObject => {
                            // Check if we have single file containing all currencies
                            if (!this.singleCurrencyFile) {
                                // Instantiate a currency object
                                currency = product.prices.find(x => x.currency == thisCurrencyObject.currencyName)
                                if (!currency) {
                                    currency = {
                                        currency: thisCurrencyObject.currencyName,
                                        wholesale_price: 0,
                                        recommended_retail_price: 0,
                                        mark_up: 0
                                    }
                                    product.prices.push(currency)
                                }
                            }
                            // Loop through the currencies fields
                            thisCurrencyObject.fieldsToMatch.forEach(field => {
                                if (field.enabled && field.newValue.fileIndex == fileIndex) {
                                    const currencyFieldValue = line[field.newValue.fieldIndex]
                                    const currencyFieldName = field.name
                                    // Check if we have matched a currency for this line
                                    if (currency && currencyFieldName != 'currency') {
                                        // If the currency exists, add the field value to it
                                        currency[currencyFieldName] = currencyFieldValue
                                    }
                                }
                            })
                        })

                        this.variantFieldsToMatch.forEach(field => {
                            if (field.enabled && field.newValue.fileIndex == fileIndex) {
                                const fieldValue = line[field.newValue.fieldIndex]
                                const fieldName = field.name

                                // Check for special case fields that need to be added to objects in json fields
                                // Variants
                                if (['variant_name','image','sizes'].includes(fieldName)) {
                                    // Check if we have matched a variant for this line
                                    if (variant) {
                                        // If the variant exists, add the field value to it
                                        // Check if the field is an array, because then it should be added to the sizes array
                                        if (Array.isArray(variant[fieldName])) {
                                            // Only push the value if it does not already exists
                                            let arrayValueExists = variant[fieldName].includes(fieldValue)
                                            if (!arrayValueExists) {
                                                variant[fieldName].push(fieldValue)
                                            }
                                        }
                                        else if (fieldName != 'variant_name') { // Exclude variant_name to only write "name" to the variant
                                            variant[fieldName] = fieldValue
                                        }
                                    }
                                }
                            }
                        })

                        this.variantImagesToMap.forEach(field => {
                            if (field.enabled && field.newValue.fileIndex == fileIndex) {
                                const fieldValue = line[field.newValue.fieldIndex]
                                const fieldName = field.name
                                if (variant) {
                                    if (fieldValue && !variant.pictures.find(x => x.url == fieldValue)) {
                                        variant.pictures.push({
                                            name: null,
                                            url: fieldValue
                                        })
                                    }
                                }
                            }
                        })
                             
                        // FIELDS
                        // Loop thorugh our fields to match, and check if they are matched to the current file
                        this.fieldsToMatch.forEach(field => {
                            // Check that the field has not been disabled
                            if (field.enabled && field.newValue.fileIndex == fileIndex) {
                                const fieldValue = line[field.newValue.fieldIndex]
                                const fieldName = field.name

                                // Check if the field is an array, because then it should be added to the array
                                if (Array.isArray(product[fieldName])) {
                                    // Check that the value does not already exist in the array
                                    let arrayValueExists = product[fieldName].includes(fieldValue)
                                    if (!arrayValueExists) {
                                        product[fieldName].push(fieldValue)
                                    }
                                } else {
                                    // Else simply write the key value pair to the product
                                    product[fieldName] = line[field.newValue.fieldIndex]
                                }
                            }
                        })

                    })
                }
                fileIndex++
            })

            return productsToReturn
        },
        async submitFiles() {

            // First validate all fields
            // Loop through the fields and look for errors
            // assume no errors
            let valid = true
            this.fieldsToMatch.forEach(field => {
                // Check if the field has been mapped
                if (field.enabled && field.newValue.fieldIndex != null) {
                    // Loop through all lines in the csv
                    // Find the file the field is mapped to to get the number of lines
                    const file = this.availableFiles[field.newValue.fileIndex]
                    if (!this.validateField(field, file.lines.length)) {
                        valid = false
                    }
                }
            })
            // Loop through mapped currencies
            this.currenciesToMatch.forEach(currency => {
                currency.fieldsToMatch.forEach(field => {
                    // Check if the field has been mapped
                    if (field.enabled && field.newValue.fieldIndex != null) {
                        // Loop through all lines in the csv
                        // Find the file the field is mapped to to get the number of lines
                        const file = this.availableFiles[field.newValue.fileIndex]
                        if (!this.validateField(field, file.lines.length)) {
                            valid = false
                        }
                    }
                })
            })
            // Loop through mapped assortments
            this.assortmentsToMatch.forEach(assortment => {
                assortment.fieldsToMatch.forEach(field => {
                    // Check if the field has been mapped
                    if (field.enabled && field.newValue.fieldIndex != null) {
                        // Loop through all lines in the csv
                        // Find the file the field is mapped to to get the number of lines
                        const file = this.availableFiles[field.newValue.fileIndex]
                        if (!this.validateField(field, file.lines.length)) {
                            valid = false
                        }
                    }
                })
            })
            if (!valid) {
                this.SHOW_SNACKBAR({ 
                    msg: `One or more fields have an error'`,
                    type: 'info', 
                    iconClass: 'fa-exclamation-circle', 
                })
                return
            }

            // Set new file data
            const newFile = this.newFile
            newFile.id = null
            newFile.parent_id = this.currentFolder ? this.currentFolder.id : 0
            newFile.workspace_id = this.currentWorkspace.id

            this.uploadingFile = true
            this.submitStatus = 'Uploading'
            let uploadSuccess = true

            // First we need to create a file for the products, since the API requires that products be uploaded to an existing file
            this.submitStatus = 'Creating file'
            // console.log('create file', newFile)
            await this.insertOrUpdateFile(newFile)

            // Then we will instantiate the products and attempt to upload them
            this.submitStatus = 'Creating products'
            const newProducts = this.instantiateProducts().filter(x => !!x.datasource_id)

            this.submitStatus = 'Saving new products'
            await this.insertProducts({file: newFile, products: newProducts, addToState: false})
            .then(() => {
                this.submitStatus = 'Success'
            }).catch(err => {
                window.alert('Something went wrong. Please try again')
                this.submitStatus = 'Error'
                uploadSuccess = false
            })

            let imageUploadSuccess = true
            if (this.submitStatus != 'Error') {
                this.submitStatus = 'Uploading images. This may take a while'
                await this.syncExternalImages({file: newFile, products: newProducts, progressCallback: this.uploadImagesProgressCalback}).catch(err => {
                    imageUploadSuccess = false
                    this.SHOW_SNACKBAR({ 
                        msg: `<p><strong>Hey you!</strong><br></p>
                        <p>We will display your images from your provided URLs.</p>
                        <p>This will most likely not be a problem, but it means that we are not hosting the images, and can't guarantee that they will always be available.</p>
                        <p>if you see this icon <i class="far fa-heart-broken primary"></i> it means that we cant fetch the image.</p>`,
                        type: 'info', 
                        iconClass: 'fa-exclamation-circle', 
                    })
                })
            }

            if (uploadSuccess) {
                this.$emit('close')
                this.reset()
            }
            this.uploadingFile = false
        },
        uploadImagesProgressCalback(progress) {
            this.submitStatus = `Uploading images. This may take a while.<br>
            <strong>${progress}%</strong> done.`
        },
        reset() {
            this.$emit('reset')
            // this.availableFiles = []
            // this.singleCurrencyFile = false
            // this.currentScreen = {name: 'chooseFiles', header: 'Create new file'}
            // this.currenciesToMatch = [JSON.parse(JSON.stringify(this.currencyDefaultObject))]
            // this.newFile = JSON.parse(JSON.stringify(this.defalultNewFile))
            // this.variantImagesToMap = JSON.parse(JSON.stringify(this.variantImageDefaultObject))
            // // Reset fields to match
            // this.fieldsToMatch.concat(this.variantFieldsToMatch).forEach(field => {
            //     field.enabled = true
            //     field.error = false
            //     field.newValue = {fileIndex: null, fieldName: null, fieldIndex: null}
            // })
        }
    },
    created() {
        this.newFile = JSON.parse(JSON.stringify(this.defalultNewFile))
    }
}
</script>

<style lang="scss">
@import '~@/_variables.scss';

    .create-file-modal {
        &.map-fields {
            .modal {
                width: 1068px;
                max-width: 90vw;
                .body {
                    max-width: none;
                    .input-field {
                        &.auto-match {
                            .input-wrapper {
                                border-color: $primary
                            }
                        }
                    }
                }
            }
        }
    }

</style>

<style scoped lang="scss">
@import '~@/_variables.scss';

    .create-file-modal {
        .form-controls {
            display: flex;
            justify-content: flex-end;
            > :not(:last-child) {
                margin-right: 16px;
            }
        }
        .big-icon {
            font-size: 60px;
            margin: 32px 0 48px;
        }
        .files-wrapper {
            margin: 32px 0 32px;
            width: 100%;
            .file-to-upload {
                display: flex;
                justify-content: space-between;
                width: 100%;
                align-items: center;
                height: 40px;
                padding: 4px 4px 4px 8px;
                border: solid $dividerWidth $dividerColor;
                border-radius: 4px;
                span {
                    color: $primary;
                }
                &:not(:last-child) {
                    margin-bottom: 4px;
                }
            }
        }
    }
    .map-fields {
        display: flex;
        justify-content: center;
        h3 {
            padding-left: 24px;
            margin: 48px 0 12px;
            i {
                margin-left: 8px;
            }
            &:hover {
                i {
                    color: $font;
                }
            }
        }
        table {
            tr {
                &.disabled {
                    .input-field {
                        opacity: .5;
                    }
                }
                .input-field {
                    width: 240px;
                }
            }
        }
        .link-ids {
            .map-fields-table {
                padding-left: 24px;
            }
        }
        .map-currencies {
            .single-currency-file-table {
                margin-bottom: 32px;
                td {
                    padding-right: 4px
                }
            }
            .currency-wrapper {
                margin-bottom: 32px;
                h4 {
                    padding-left: 28px;
                    margin-top: 0;
                    margin-bottom: 4px;
                }
                .currency-header {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 8px;
                    align-items: flex-end;
                    padding-left: 20px;
                     p {
                        padding-left: 24px;
                        .small {
                            font-size: 12px;
                        }
                    }
                }
                .input-field {
                    width: 240px;
                }
            }
        }
        .available-fields {
            margin-top: 116px;
            background: $grey2;
            border-radius: 4px;
            padding: 12px 4px 8px 8px;
            margin-left: 12px;
            .inner {
                max-height: 800px;
                overflow-y: auto;
                padding-right: 4px;
            }
            .fields-wrapper {
                margin-top: 12px;
            }
            .field {
                background: white;
                border-radius: 4px;
                height: 32px;
                line-height: 32px;
                padding: 0 8px;
                margin-top: 4px;
                width: 200px;
                white-space: nowrap;
            }
        }
        .form-controls {
            margin-top: 32px;
        }
    }
.assortment-wrapper {
    margin-bottom: 32px;
    h4 {
        padding-left: 28px;
        margin-top: 0;
        margin-bottom: 4px;
    }
}
.assortment-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
    align-items: flex-end;
    padding-left: 20px;
        p {
        padding-left: 24px;
        .small {
            font-size: 12px;
        }
    }
}
.remove-variant-image {
    margin-right: -32px;
}
</style>