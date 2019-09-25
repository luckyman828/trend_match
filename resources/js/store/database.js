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
import Team from './models/Team'
import teams from './modules/teams'
import CommentVote from './models/CommentVote'
import commentVotes from './modules/commentVotes'
import UserTeam from './models/UserTeam'
import userTeams from './modules/userTeams'
import Category from './models/Category'
import categories from './modules/categories'
import TeamInvite from './models/TeamInvite'
import teamInvites from './modules/teamInvites'
import AuthUser from './models/AuthUser'
import authUser from './modules/authUser'
import Role from './models/Role'
import roles from './modules/roles'
import Workspace from './models/Workspace'
import workspaces from './modules/workspaces'
import WorkspaceUser from './models/WorkspaceUser'
import workspaceUsers from './modules/workspaceUsers'
import TeamProduct from './models/TeamProduct'
import teamProducts from './modules/teamProducts'
import PhaseProduct from './models/PhaseProduct'
import phaseProducts from './modules/phaseProducts'
import TeamFile from './models/TeamFile'
import teamFiles from './modules/teamFiles'
import PhaseTeam from './models/PhaseTeam'
import phaseTeams from './modules/phaseTeams'

const database = new Database()

database.register(Product, products)
database.register(Action, actions)
database.register(User, users)
database.register(Comment, comments)
database.register(Country, countries)
database.register(Collection, collections)
database.register(ProductFinalAction, productFinalActions)
database.register(Team, teams)
database.register(CommentVote, commentVotes)
database.register(UserTeam, userTeams)
database.register(Category, categories)
database.register(TeamInvite, teamInvites)
database.register(AuthUser, authUser)
database.register(Role, roles)
database.register(Workspace, workspaces)
database.register(WorkspaceUser, workspaceUsers)
database.register(TeamProduct, teamProducts)
database.register(PhaseProduct, phaseProducts)
database.register(TeamFile, teamFiles)
database.register(PhaseTeam, phaseTeams)

export default database
