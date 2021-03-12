import axios from 'axios'
import { instantiateDKCProducts } from '../../../helpers/dkcIntegration'

export default {
    namespaced: true,

    state: {
        availableSeasons: [],
    },

    getters: {
        getAvailableSeasons: state => state.availableSeasons,
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
                    code: 'BA',
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
                    const apiUrl = `/dkc-adapter/get-season-products?season_code=${season.code}`
                    await axios.get(apiUrl).then(response => {
                        const seasonProducts = Array.isArray(response.data) ? response.data : [response.data]
                        console.log('seasons products', seasonProducts)
                        if (brands) {
                            const brandCodes = brands.map(brand => brand.code)
                            const productsFilteredByBrand = seasonProducts.filter(
                                product => !!brands.find(brand => brandCodes.includes(product.product_group_brand_code))
                            )
                            products.push(...productsFilteredByBrand)
                            console.log('seasons products by brand', productsFilteredByBrand, brands, brandCodes)
                        } else {
                            products.push(...seasonProducts)
                        }
                    })
                })
            )
            // Now we have the products, let's turn them into Kollekt style products.
            const newProducts = await instantiateDKCProducts(products)
            console.log('pnew products', newProducts)
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
