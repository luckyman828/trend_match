import axios from 'axios'

export default {
    namespaced: true,

    state: {
        imageSyncJobs: [],
    },
    getters: {
        getImageSyncJobs: state => state.imageSyncJobs,
        getRemainingImageSyncCount: (state, getters) => {
            return getters.getImageSyncJobs.reduce((acc, curr) => {
                const remaining = curr.total - (curr.completed + curr.failed)
                return (acc += remaining)
            }, 0)
        },
        getImageSyncJobStatus: (state, getters) => {
            const jobs = getters.getImageSyncJobs
            if (jobs.find(x => x.failed > 0)) return 'failed'
            if (!jobs.find(x => x.status != 'Completed')) return 'success'
            if (getters.getRemainingImageSyncCount > 0) return 'syncing'
            return
        },
    },
    actions: {
        async fetchImageSyncProgress({ getters, state, rootGetters, dispatch }, { jobId, file }) {
            const apiUrl = `progresses/${jobId}`
            let job
            await axios.get(apiUrl).then(response => {
                job = response.data
                const existingJob = getters.getImageSyncJobs.find(job => job.id == jobId)
                if (existingJob) {
                    Object.assign(existingJob, job)
                    job = existingJob
                }
                if (job.status == 'Completed' && job.jobInterval) {
                    clearInterval(job.jobInterval)
                }
                localStorage.setItem('imageSyncJobs', JSON.stringify(state.imageSyncJobs))

                // // Update the images of our product variants if we have the products loaded in our state
                const stateProducts = rootGetters['products/getProducts']
                const currentFile = rootGetters['files/getCurrentFile']
                const jobFile = job.file ? job.file : file
                if (stateProducts && currentFile && jobFile && currentFile.id == jobFile.id) {
                    // Loop through our items
                    job.items.map(async item => {
                        if (!item.identifier.startsWith('product:')) return
                        const productId = item.identifier.slice(item.identifier.indexOf(':') + 1)
                        const product = stateProducts.find(x => x.id == productId)

                        // Check if we should fetch the product image
                        if (!product) return
                        Vue.set(product, 'imageSyncStatus', item.status)
                        if (
                            item.status == 'Success' &&
                            product.variants[0] &&
                            product.variants[0].style_option_id &&
                            !product.variants[0].style_option_id.toString().startsWith('REF:')
                        ) {
                            const updatedProduct = await dispatch('products/fetchProduct', productId, { root: true })
                            updatedProduct.variants.map((variant, index) => {
                                const oldVariant = product.variants[index]
                                Vue.set(oldVariant, 'pictures', variant.pictures)
                                oldVariant.style_option_id = `REF:${oldVariant.style_option_id}`
                            })
                        }
                    })
                }
            })
            return job
        },
        async startImageSyncJob({ dispatch, commit }, { jobId, file }) {
            // Fetch job details
            const job = await dispatch('fetchImageSyncProgress', { jobId, file })

            // Start interval
            const intervalDuration = 5000
            const jobInterval = setInterval(() => {
                dispatch('fetchImageSyncProgress', { jobId, file })
            }, intervalDuration)

            Vue.set(job, 'file', { id: file.id, name: file.name })
            Vue.set(job, 'jobInterval', jobInterval)
            commit('INSERT_IMAGE_SYNC_JOB', job)
        },
        async stopImageSyncJob({ dispatch, commit }, { job }) {
            clearInterval(job.jobInterval)
            // Actually cancelling the job is currently not supported by the API, but we can stop fetching the progress...
            job.status = 'Cancelled'
            commit('UPDATE_IMAGE_SYNC_JOBS')
        },
        getActiveJobs({ dispatch, commit }) {
            const jobs = localStorage.getItem('imageSyncJobs')
            if (!jobs) return
            JSON.parse(jobs).map(job => {
                if (job.status != 'Completed' && job.status != 'Cancelled') {
                    dispatch('startImageSyncJob', { jobId: job.id, file: job.file })
                } else {
                    commit('INSERT_IMAGE_SYNC_JOB', job)
                }
            })
        },
    },
    mutations: {
        INSERT_IMAGE_SYNC_JOB(state, job) {
            state.imageSyncJobs.push(job)
            // Store in localStorage
            localStorage.setItem('imageSyncJobs', JSON.stringify(state.imageSyncJobs))
        },
        UPDATE_IMAGE_SYNC_JOBS(state) {
            localStorage.setItem('imageSyncJobs', JSON.stringify(state.imageSyncJobs))
        },
        REMOVE_IMAGE_SYNC_JOB(state, jobId) {
            const index = state.imageSyncJobs.findIndex(x => x.id == jobId)
            state.imageSyncJobs.splice(index, 1)
            // Store in localStorage
            localStorage.setItem('imageSyncJobs', JSON.stringify(state.imageSyncJobs))
        },
        CLEAR_JOBS(state, {}) {
            state.imageSyncJobs = []
            localStorage.setItem('imageSyncJobs', JSON.stringify(state.imageSyncJobs))
        },
        CLEAR_COMPLETED(state, {}) {
            for (let i = state.imageSyncJobs.length - 1; i >= 0; i--) {
                const job = state.imageSyncJobs[i]
                if (job.status == 'Completed') {
                    state.imageSyncJobs.splice(i, 1)
                }
            }
            localStorage.setItem('imageSyncJobs', JSON.stringify(state.imageSyncJobs))
        },
    },
}
