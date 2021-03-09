import Vue from 'vue'
import Router from 'vue-router'
import Index from "../components/Index";
import LoginRegister from "../components/LoginRegister";
import Login from "../components/Login";
import Register from "../components/Register";
import Page from "../components/Page";
import Adminer from "../components/Adminer";
import Admin_finds from "../components/Admin_finds";
import Admin_users from "../components/Admin_users";
import Admin_shares from "../components/Admin_shares";
import Admin_news from "../components/Admin_news";
import Admin_adopts from "../components/Admin_adopts";
import Page_adopts from "../components/Page_adopts";
import Page_finds from "../components/Page_finds";
import Page_shares from "../components/Page_shares";
import Page_news from "../components/Page_news";
import Page_myadopts from "../components/Page_myadopts";
import Page_myfinds from "../components/Page_myfinds";
import Page_adopts_desc from "../components/Page_adopts_desc";
import Page_finds_desc from "../components/Page_finds_desc";
import Page_shares_desc from "../components/Page_shares_desc";
import Page_orders from "../components/Page_orders";
import ModifyPwd from "../components/ModifyPwd";

Vue.use(Router)

const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
export default new Router({
  routes: [
    {path: '/',redirect:'/index'},
    {path: '/index',component:Index},
    {
      path:'/logReg', component:LoginRegister,
      children:[
        {path:'login',component:Login},
        {path: 'register',component: Register},
        {path:'modifyPwd',component:ModifyPwd},
      ]
    },
    {
      path:'/page',component:Page,
      children:[
        {path:'adopts',component:Page_adopts},
        {path:'finds',component:Page_finds},
        {path:'shares',component:Page_shares},
        {path:'news',component:Page_news},
        {path:'myadopts',component:Page_myadopts},
        {path:'myfinds',component:Page_myfinds},
        {path: 'orders',component:Page_orders}
      ]
    },
    {
      path:'/admin',component:Adminer,
      children:[
        {path: 'adopts',component: Admin_adopts},
        {path: 'finds',component: Admin_finds},
        {path: 'users',component: Admin_users},
        {path: 'shares',component: Admin_shares},
        {path: 'news',component: Admin_news},
      ]
    },
    {path:'/page_adopts_desc',component:Page_adopts_desc},
    {path:'/page_finds_desc',component:Page_finds_desc},
    {path:'/page_shares_desc',component:Page_shares_desc},

  ]
})
