import { Database } from '@vuex-orm/core'
import Product from './models/Product'
import products from './modules/products'
import Action from './models/Action'
import actions from './modules/actions'
import User from './models/User'
import users from './modules/users'
import Comment from './models/Comment'
import comments from './modules/comments'
import Country from './models/Country'
import countries from './modules/countries'
import Collection from './models/Collection'
import collections from './modules/collections'
import ProductFinalAction from './models/ProductFinalAction'
import productFinalActions from './modules/productFinalActions'
import CommentVote from './models/CommentVote'
import commentVotes from './modules/commentVotes'
import Category from './models/Category'
import categories from './modules/categories'
import AuthUser from './models/AuthUser'
import authUser from './modules/authUser'
import Role from './models/Role'
import roles from './modules/roles'
import TeamProduct from './models/TeamProduct'
import teamProducts from './modules/teamProducts'
import PhaseProduct from './models/PhaseProduct'
import phaseProducts from './modules/phaseProducts'
import TeamFile from './models/TeamFile'
import teamFiles from './modules/teamFiles'
import taskTeams from './modules/taskTeams'
import TaskTeam from './models/TaskTeam'
import phases from './modules/phases'
import Phase from './models/Phase'
import tasks from './modules/tasks'
import Task from './models/Task'
import taskParents from './modules/taskParents'
import TaskParent from './models/TaskParent'
import FileTask from './models/FileTask'
import fileTasks from './modules/fileTasks'
import TaskAction from './models/TaskAction'
import taskActions from './modules/taskActions'
import Request from './models/Request'
import requests from './modules/requests'
import Folder from './models/Folder'
import folders from './modules/folders'
import Selection from './models/Selection'
import selections from './modules/selections'

const database = new Database()

database.register(Product, products)
database.register(Action, actions)
database.register(User, users)
database.register(Comment, comments)
database.register(Country, countries)
database.register(Collection, collections)
database.register(ProductFinalAction, productFinalActions)
database.register(CommentVote, commentVotes)
database.register(Category, categories)
database.register(AuthUser, authUser)
database.register(Role, roles)
database.register(TeamProduct, teamProducts)
database.register(PhaseProduct, phaseProducts)
database.register(TeamFile, teamFiles)
database.register(TaskTeam, taskTeams)
database.register(Phase, phases)
database.register(Task, tasks)
database.register(FileTask, fileTasks)
database.register(TaskParent, taskParents)
database.register(TaskAction, taskActions)
database.register(Request, requests)
database.register(Folder, folders)
database.register(Selection, selections)

export default database
