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

const database = new Database()

database.register(Product, products)
database.register(Action, actions)
database.register(User, users)
database.register(Comment, comments)
database.register(Country, countries)
database.register(Collection, collections)

export default database