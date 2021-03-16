import axios from 'axios'
import { instantiateDKCProducts } from '../../../helpers/dkcIntegration'

export default {
    namespaced: true,

    state: {
        availableSeasons: [],
    },

    getters: {
        getAvailableSeasons: state => state.availableSeasons,
        getCompanyMap: () => {
            return [
                {
                    name: 'DK Company A/S',
                    code: 'DkCompany',
                },
                {
                    name: 'The Original Group A/S',
                    code: 'TheOriginalGroup',
                },
                {
                    name: 'DK Company Vejle A/S',
                    code: 'DkCompanyVejle',
                },
                {
                    name: 'DKC Wholesale A/S',
                    code: 'DkcWholesale',
                },
                {
                    name: 'Saint Tropez af 1993 A/S',
                    code: 'SaintTropezAf1993',
                },
                {
                    name: 'DKV Mens dept. A/S',
                    code: 'DKVMensDept',
                },
                {
                    name: 'DK Company Online A/S',
                    code: 'DkCompanyOnline',
                },
            ]
        },
        getBrandMap: () => {
            return [
                // DK Company A/S
                {
                    name: 'Kaffe',
                    code: 'KA',
                    company: 'DkCompany',
                },
                {
                    name: 'Cream',
                    code: 'CR',
                    company: 'DkCompany',
                },
                {
                    name: 'Denim Hunter',
                    code: 'DH',
                    company: 'DkCompany',
                },
                {
                    name: 'Lounge Nine',
                    code: 'LN',
                    company: 'DkCompany',
                },
                {
                    name: 'Gestuz',
                    code: 'GZ',
                    company: 'DkCompany',
                },
                {
                    name: 'Karen by Simonsen',
                    code: 'KB',
                    company: 'DkCompany',
                },
                // DKC Wholesale A/S
                {
                    name: 'Culture',
                    code: 'CU',
                    company: 'DkcWholesale',
                },
                // DK Company Vejle A/S
                {
                    name: 'Pulz',
                    code: 'PZ',
                    company: 'DkCompanyVejle',
                },
                {
                    name: 'Blend',
                    code: 'BH',
                    company: 'DkCompanyVejle',
                },
                {
                    name: 'Fransa',
                    code: 'FR',
                    company: 'DkCompanyVejle',
                },
                {
                    name: 'Dranella',
                    code: 'DR',
                    company: 'DkCompanyVejle',
                },
                {
                    name: 'B.Young',
                    code: 'BY',
                    company: 'DkCompanyVejle',
                },
                {
                    name: 'B.Young',
                    code: 'BY',
                    company: 'DkCompanyVejle',
                },
                {
                    name: 'Casual Friday',
                    code: 'CF',
                    company: 'DkCompanyVejle',
                },
                {
                    name: 'Ichi',
                    code: 'IH',
                    company: 'DkCompanyVejle',
                },
                {
                    name: 'Ichi Accessories',
                    code: 'IA',
                    company: 'DkCompanyVejle',
                },
                // DKV Mens dept. A/S
                {
                    name: 'Solid',
                    code: 'SD',
                    company: 'DKVMensDept',
                },
                {
                    name: 'Tailored Originals',
                    code: 'TO',
                    company: 'DKVMensDept',
                },
                // Saint Tropez af 1993 A/S
                {
                    name: 'Saint Tropez',
                    code: 'SZ',
                    company: 'SaintTropezAf1993',
                },
                // The Original Group A/S
                {
                    name: 'InWear',
                    code: 'IW',
                    company: 'TheOriginalGroup',
                },
                {
                    name: 'Matinique',
                    code: 'MA',
                    company: 'TheOriginalGroup',
                },
                {
                    name: 'Part Two',
                    code: 'PW',
                    company: 'TheOriginalGroup',
                },
                {
                    name: 'Soaked in Luxury',
                    code: 'SL',
                    company: 'TheOriginalGroup',
                },
                // DK Company Online A/S
                {
                    name: 'InWear',
                    code: 'IW',
                    company: 'DkCompanyOnline',
                },
                {
                    name: 'Part Two',
                    code: 'PW',
                    company: 'DkCompanyOnline',
                },
                {
                    name: 'Fransa',
                    code: 'FR',
                    company: 'DkCompanyOnline',
                },
                {
                    name: "Bon'A Parte",
                    code: 'BP',
                    company: 'DkCompanyOnline',
                },
            ]
        },
    },

    actions: {
        async fetchProducts({ commit }, { seasons, brands }) {
            let products = []
            await Promise.all(
                seasons.map(async season => {
                    await Promise.all(
                        brands.map(async brand => {
                            const pageIndex = 1 // Limit to 10
                            // Fetch how many pages we have

                            // Fetch a page at a time
                            const apiUrl = `/dkc-adapter/season-products?season_code=${season.code}&company=${brand.company}&brand=${brand.code}&page=${pageIndex}`
                            await axios
                                .get(apiUrl)
                                .then(response => {
                                    const seasonProducts = Array.isArray(response.data)
                                        ? response.data
                                        : [response.data]
                                    console.log('seasons products', seasonProducts)
                                    products.push(...seasonProducts)
                                })
                                .catch(err => {
                                    console.log('error when fetching products', err.response)
                                })
                        })
                    )
                })
            ).catch(err => {
                console.log('error when fetching products', err.response)
            })
            // Now we have the products, let's turn them into Kollekt style products.
            const newProducts = await instantiateDKCProducts(products)
            console.log('pnew products', newProducts)
            return newProducts
        },
        async fetchProductsById({}, { productIds, company }) {
            let products = []
            await Promise.all(
                productIds.map(async productId => {
                    const apiUrl = `/dkc-adapter/get-product?product_no=${productId}&company=${company.code}`
                    await axios
                        .get(apiUrl)
                        .then(response => {
                            products.push(response.data)
                        })
                        .catch(err => {
                            console.log('error when fetching products', err.response)
                        })
                })
            ).catch(err => {
                console.log('error when fetching products', err.response)
            })
            // Now we have the products, let's turn them into Kollekt style products.
            const newProducts = await instantiateDKCProducts(products)
            return newProducts
        },
        async fetchProductsByEAN({ dispatch, getters }, { EANs, company }) {
            let products = []
            await Promise.all(
                EANs.map(async ean => {
                    const apiUrl = `/dkc-adapter/find-ean?ean_code=${ean}&company=${company.code}`
                    await axios
                        .get(apiUrl)
                        .then(async response => {
                            products.push(response.data)
                        })
                        .catch(err => {
                            console.log('error when fetching products', err.response)
                        })
                })
            ).catch(err => {
                console.log('error when fetching products', err.response)
            })
            const newProducts = await instantiateDKCProducts(products)
            return newProducts
        },
        async fetchAvailableSeasonsByBrand({ commit }, brands) {
            let availableSeasons = []
            const companies = brands.reduce((companies, brand) => {
                return !companies.includes(brand.company) ? [...companies, brand.company] : companies
            }, [])
            await Promise.all(
                companies.map(async company => {
                    const apiUrl = `/dkc-adapter/get-company-seasons?company=${company}`
                    await axios.get(apiUrl).then(response => {
                        const seasons = response.data
                        seasons.map(season => {
                            const alreadyAdded = availableSeasons.find(x => x.code == season.code)
                            if (!alreadyAdded) availableSeasons.push(season)
                        })
                    })
                })
            )
            commit('SET_AVAILABLE_SEASONS', availableSeasons)
            return availableSeasons
        },
    },

    mutations: {
        SET_AVAILABLE_SEASONS(state, seasons) {
            state.availableSeasons = seasons
        },
    },
}
