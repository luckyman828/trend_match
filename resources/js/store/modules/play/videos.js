import axios from 'axios'
import Vue from 'vue'
import formatBytes from '../../../helpers/formatBytes'

export default {
    namespaced: true,

    state: {
        videos: [],
        statusCode: null,
        uploadChannels: [],
    },
    getters: {
        // getVideos: state => state.videos,
        getVideos: (state, getters, rootState, rootGetters) => {
            const files = rootGetters['files/getFiles']
            return files
            // return files.filter(file => file.video_count > 0)
        },
        getStatusCode: state => state.statusCode,
        getUploadChannels: state => state.uploadChannels,
    },
    actions: {
        async uploadFileVideo({ commit, rootGetters, dispatch }, { videoFile, file }) {
            if (!videoFile || !file) {
                console.log('no file', videoFile, file)
                return
            }
            const workspaceId = rootGetters['workspaces/getCurrentWorkspaceId']
            const extension = videoFile.name.split('.').pop()

            // Generate an upoad channel
            const uploadChannelApiUrl = `upload-channel/generate?workspace_id=${workspaceId}&extension=${extension.toUpperCase()}`
            let uploadChannel
            await axios.post(uploadChannelApiUrl).then(response => {
                console.log('generated upload channel', response.data)
                uploadChannel = response.data
                uploadChannel.presentationId = file.id
                uploadChannel.file = videoFile
            })

            // Create a fresh axios instance with no auth headers
            const uploadUrlAxiosInstance = axios.create()
            delete uploadUrlAxiosInstance.defaults.headers.common['Authorization']

            // Chunk the video into 5MB sized chunks
            const chunkSize = 5242880 // 5MB
            let chunkNumber = 1

            // Instantiate upload progress data on the upload channel
            Vue.set(uploadChannel, 'progress', {
                status: 'Uploading',
                total: Math.ceil(videoFile.size / chunkSize),
                current: 0,
                get progressPercentage() {
                    return Math.round((this.current / this.total) * 100) + '%'
                },
            })
            commit('INSERT_UPLOAD_CHANNEL', uploadChannel)

            for (
                let start = 0;
                start < videoFile.size && uploadChannel.progress.status != 'Cancelled';
                start += chunkSize
            ) {
                // Generate a blob chunk to be posted
                const chunk = videoFile.slice(start, start + chunkSize + 1)
                const chunkData = new FormData()
                chunkData.append('data', chunk)

                // Generate a presigned URL
                if (uploadChannel.progress.status == 'Cancelled') {
                    return
                }
                const generateUrlApiUrl = `upload-channel/${uploadChannel.id}/generate-presigned-url?part_number=${chunkNumber}`
                let uploadUrl
                await axios.get(generateUrlApiUrl).then(response => {
                    console.log('generated URL', response.data)
                    uploadUrl = response.data.presigned_url
                })

                // Upload chunk data to the presigned url
                if (uploadChannel.progress.status == 'Cancelled') {
                    return
                }
                let etag
                await uploadUrlAxiosInstance.put(uploadUrl, chunk).then(response => {
                    // TRY TO READ ETAG HERE. No luck.. <----------------------------------------- ERROR HERE
                    etag = response.headers['etag']
                    console.log('upload to presigned Url response', response.headers['etag'], response.headers)
                })

                // Complete the chunk
                if (uploadChannel.progress.status == 'Cancelled') {
                    return
                }
                const completeChunkUrl = `upload-channel/${uploadChannel.id}/complete-part`
                await axios.post(completeChunkUrl, {
                    part_number: chunkNumber,
                    etag,
                })
                chunkNumber++
                uploadChannel.progress.current++
            }
            // Done uploading all chunks
            // Complete the video file
            const completeUploadURl = `upload-channel/${uploadChannel.id}/complete`
            let uploadKey
            await axios.post(completeUploadURl).then(response => {
                console.log('complete upload', response.data)
                uploadKey = response.data.key
                uploadChannel.progress.status = 'Uploaded'
            })

            const newVideoPresentation = {
                video: {
                    provider: 'AwsVideo',
                    identifier: uploadKey,
                },
                timings: [],
                published: false,
            }
            await dispatch('updateFileVideo', { file, videoPresentation: newVideoPresentation })
        },
        async cancelUpload({}, uploadChannel) {
            console.log('set status cancelled')
            uploadChannel.progress.status = 'Cancelled'
            const apiUrl = `upload-channel/${uploadChannel.id}/abort`
            await axios.post(apiUrl)
        },
        async updateFileVideo({}, { file, videoPresentation }) {
            console.log('update file video', file, videoPresentation)
            // Save to the API
            const apiUrl = `/files/${file.id}/video`
            await axios
                .post(apiUrl, videoPresentation)
                .then(response => {
                    console.log('file video updated', response.data)
                })
                .catch(err => {
                    console.log('Error when updating file video', err.response)
                })
        },
        async checkVideoStatus({}, video) {
            let status
            const apiUrl = `upload-channel/check-status`
            await axios.post(apiUrl, { key: video.identifier }).then(response => {
                status = response.data
            })
            return status
        },
        async fetchVideoUrls({}, video) {
            let videoUrls
            const apiUrl = `media/get-cdn-video-urls`
            await axios.post(apiUrl, { key: video.identifier }).then(response => {
                videoUrls = response.data
                const urlObj = {}
                videoUrls.map(videoUrlObj => {
                    urlObj[videoUrlObj.quality] = videoUrlObj.play_url
                })
                Vue.set(video, 'urls', urlObj)
            })
            return videoUrls
        },
        async updateVideoThumbnail({}, video) {
            const apiUrl = `/videos/${video.id}`
            await axios.put(apiUrl, {
                thumbnail: video.thumbnail,
            })
        },
    },
    mutations: {
        SET_VIDEOS(state, videos) {
            state.videos = videos
        },
        INSERT_VIDEO(state, newVideo) {
            state.videos.push(newVideo)
        },
        INSERT_UPLOAD_CHANNEL(state, uploadChannel) {
            const existingPresentationChannelIndex = state.uploadChannels.findIndex(
                channel => channel.presentationId == uploadChannel.presentationId
            )
            if (existingPresentationChannelIndex >= 0) {
                state.uploadChannels.splice(existingPresentationChannelIndex, 1)
            }
            state.uploadChannels.push(uploadChannel)
        },
    },
}
