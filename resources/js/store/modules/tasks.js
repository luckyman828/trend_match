import axios from 'axios'
import Task from '../models/Task'
import Team from '../models/Team'
import UserTeam from '../models/UserTeam'
import User from '../models/User'

export default {
    namespaced: true,

    state: {
        loading: true,
    },

    getters: {
        loadingTasks: state => {
            return state.loading
        },
        tasks: (state, getters, rootState, rootGetters) => {
            const tasks = Task.query()
                .with('taskTeams.team.users')
                .with('parents.completed|parentTask')
                .get()
            tasks.forEach(task => {
                task.users = []
                task.taskTeams.forEach(taskTeam => {
                    taskTeam.team.users.forEach(user => {
                        if (user.role_id == taskTeam.role_id && !task.users.find(x => x.id == user.id))
                            task.users.push(user)
                    })
                })
            })
            tasks.forEach(task => {
                task.parentTasks = []
                task.parents.forEach(parent => {
                    const parentTask = tasks.find(x => x.id == parent.parent_id)
                    if (parentTask) task.parentTasks.push(parentTask)
                })
            })
            return tasks
        },
        userTasks: (state, getters, rootState, rootGetters) => {
            if (!rootGetters['persist/loadingInit']) {
                let userTasks = []
                let userId = rootGetters['persist/authUser'].id
                getters.tasks.forEach(task => {
                    if (task.users.find(user => user.id == userId)) userTasks.push(task)
                })
                return userTasks
            }
        },
    },

    actions: {
        async fetchTasks({ commit }, workspace_id) {
            // Set the state to loading
            commit('setLoading', true)

            const apiUrl = `/api/workspace/${workspace_id}/tasks`

            let tryCount = 3
            let succes = false
            while (tryCount-- > 0 && !succes) {
                try {
                    const response = await axios.get(`${apiUrl}`)
                    Task.create({ data: response.data })
                    commit('setLoading', false)
                    succes = true
                } catch (err) {
                    console.log('API error in tasks.js :')
                    console.log(err)
                    console.log(`Trying to fetch again. TryCount = ${tryCount}`)
                    if (tryCount <= 0) throw err
                }
            }
        },
    },

    mutations: {
        //Set the loading status of the app
        setLoading(state, bool) {
            state.loading = bool
        },
    },
}
