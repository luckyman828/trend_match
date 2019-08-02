import { Database } from '@vuex-orm/core'
import Product from './models/Product';
import products from './modules/products';
import Action from './models/Action';
import actions from './modules/actions';
import User from './models/User';
import users from './modules/users';
import Comment from './models/Comment';
import comments from './modules/comments';
import Country from './models/Country';
import countries from './modules/countries';
import Collection from './models/Collection';
import collections from './modules/collections';
import ProductFinalAction from './models/ProductFinalAction';
import productFinalActions from './modules/productFinalActions';
import Team from './models/Team';
import teams from './modules/teams';
import CommentVote from './models/CommentVote';
import commentVotes from './modules/commentVotes';

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

export default database