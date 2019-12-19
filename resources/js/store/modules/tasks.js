import axios from 'axios'
import Task from '../models/Task'
import Team from '../models/Team'
import UserTeam from '../models/UserTeam'
import User from '../models/User'
import FileTask from '../models/FileTask'

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
            const currentFile = rootGetters['persist/currentFile']
            if (currentFile) {
                const tasks = Task.query()
                    .with('taskTeams.team.users|files')
                    .with('completed|children')
                    .with('parents.completed|parentTask')
                    .get()
                tasks.forEach(task => {
                    if (task.phase_id == currentFile.phase) {
                        // Find task users
                        task.users = []
                        task.filter_products_by_ids = task.filter_products_by_ids
                            ? task.filter_products_by_ids.split(',').map(x => parseInt(x))
                            : []
                        task.taskTeams.forEach(taskTeam => {
                            // Check if the team has access to the files
                            if (taskTeam.team.files.find(x => x.id == currentFile.id)) {
                                // Check if the users have access to the task
                                taskTeam.team.users.forEach(user => {
                                    if (user.role_id == taskTeam.role_id && !task.users.find(x => x.id == user.id))
                                        task.users.push(user)
                                })
                            }
                        })

                        // Find task parent tasks
                        task.parentTasks = []
                        task.parents.forEach(parent => {
                            const parentTask = tasks.find(x => x.id == parent.parent_id)
                            if (parentTask) task.parentTasks.push(parentTask)
                        })

                        // Find child tasks
                        task.childTasks = []
                        task.children.forEach(child => {
                            const childTask = tasks.find(x => x.id == child.task_id)
                            if (childTask) task.childTasks.push(childTask)
                        })

                        // Find sibling tasks
                        task.siblings = []
                        task.childTasks.forEach(childTask => {
                            task.siblings = task.siblings.concat(childTask.parents)
                        })

                        // Find tasks the parent inherits from
                        task.inheritFromTask = tasks.find(x => x.id == task.inherit_from_id)

                        if (task.type == 'decision')
                            task.approvalParent = tasks.find(
                                x => x.type == 'approval' && x.phase_id == currentFile.phase
                            )

                        // Determine if the task is active
                        task.isActive = false
                        if (task.parents.length <= 0) {
                            // If the task has no parents
                            if (!task.completed.find(x => x.file_id == currentFile.id))
                                // And the task is not completed
                                task.isActive = true
                        } else {
                            task.parents.forEach(parent => {
                                // If the task has parents
                                if (parent.completed.find(x => x.file_id == currentFile.id))
                                    // And the parents are completed
                                    task.isActive = true
                            })
                        }

                        // Find task input (users/tasks that have to give input to the task)
                        task.input = []

                        if (task.type == 'feedback') {
                            // If type: Feedback -> Find all users with access to the task
                            task.input = task.input.concat(task.users)
                        } else {
                            // If type = Alignment -> Find the parent tasks
                            task.parentTasks.forEach(parentTask => {
                                // if parent type is feedback -> push users
                                // else -> push task
                                if (parentTask.type == 'feedback') task.input = task.input.concat(parentTask.users)
                                else task.input = task.input.concat(parentTask)
                            })
                        }
                    }
                })

                return tasks.filter(task => task.phase_id == currentFile.phase)
            }
        },
        userTasks: (state, getters, rootState, rootGetters) => {
            if (!rootGetters['persist/loadingInit'] && getters.tasks) {
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
        async completeTask({ commit }, { file_id, task_id }) {
            let succes
            await axios
                .put(`/api/task/complete`, {
                    file_id: file_id,
                    task_id: task_id,
                })
                .then(response => {
                    succes = true
                    console.log(response.data)
                    commit('setTaskComplete', { file_id, task_id })
                })
                .catch(err => {
                    succes = false
                    console.log(err.response)
                    commit('alertError')
                })

            return succes
        },
        async undoCompleteTask({ commit }, { file_id, task_id }) {
            let succes
            await axios
                .delete(`/api/task/complete`, {
                    data: {
                        file_id: file_id,
                        task_id: task_id,
                    },
                })
                .then(response => {
                    succes = true
                    console.log(response.data)
                    commit('setTaskIncomplete', { file_id, task_id })
                })
                .catch(err => {
                    succes = false
                    console.log(err.response)
                })
            return succes
        },
    },

    mutations: {
        //Set the loading status of the app
        setLoading(state, bool) {
            state.loading = bool
        },
        setTaskComplete(state, { file_id, task_id }) {
            FileTask.insert({
                data: {
                    file_id: file_id,
                    task_id: task_id,
                },
            })
        },
        setTaskIncomplete(state, { file_id, task_id }) {
            FileTask.delete(record => {
                return record.file_id == file_id && record.task_id == task_id
            })
        },
        alertError: state => {
            window.alert('Network error. Please check your connection')
        },
    },
}
