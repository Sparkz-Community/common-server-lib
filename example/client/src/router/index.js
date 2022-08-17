import Vue from 'vue';
import VueRouter from 'vue-router';
import {Notify} from 'quasar';
import lget from 'lodash/get';

import Routes from './routes';

Vue.use(VueRouter);
/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

function getFormattedRoutes(routes) {
  let childrenRoutes = [], hiddenRoutes = [], baseRoutes = [];
  routes.forEach((route) => {
    if(lget(route, 'childrenRoutes', []).length) {
      route.childrenRoutes.forEach((child) => {
        let obj = {
          name: 'admin-' + child.routeTo,
          path: child.routeTo,
          component: child.component,
          $can: child.$can
        };
        childrenRoutes.push(obj);
        if(lget(child, 'hiddenRoutes', []).length) {
          child.hiddenRoutes.forEach(hidden => {
            let hiddObj = {
              name: 'admin-' + hidden.routeTo,
              path: child.routeTo + '/' + hidden.routeTo,
              component: hidden.component,
              $can: hidden.$can
            };
            hiddenRoutes.push(hiddObj);
          });
        }
      });
    }
    if(!lget(route, 'childrenRoutes', []).length) {
      let obj = {
        name: 'admin-' + route.routeTo,
        path: route.routeTo,
        component: route.component,
        $can: route.$can
      };
      baseRoutes.push(obj);
      if(lget(route, 'hiddenRoutes', []).length) {
        route.hiddenRoutes.forEach(hidden => {
          let hiddObj = {
            name: 'admin-' + hidden.routeTo,
            path: route.routeTo + '/' + hidden.routeTo,
            component: hidden.component,
            $can: hidden.$can
          };
          hiddenRoutes.push(hiddObj);
        });
      }
    }
  });
  return [...baseRoutes, ...childrenRoutes, ...hiddenRoutes];
}

// eslint-disable-next-line no-unused-vars
const adminRouteConfigure = ({router, store, defaultRoute = {}, routeConfigs = []} = {}) => {
  let defaultRoutes = [{
    title: 'Account',
    icon: 'fas fa-user',
    $can: () => router.app.$can('patch', router.app.$createEntity('users', store.getters['auth/user'])),
    // iconColor: '#00aaf1',
    // textColor: 'red',
    childrenRoutes: [
      {
        icon: 'fas fa-user-circle',
        $can: () => true,
        title: 'My Profile',
        routeTo: 'my-profile',
        component: () => import('pages/profile/EditProfile'),
        iconColor: 'orangered',
        textColor: 'purple'
      }, {
        icon: 'fas fa-location-arrow',
        $can: () => true,
        title: 'Addresses',
        routeTo: 'my-addresses',
        component: () => import('pages/profile/MyAddresses')
      }, {
        icon: 'fab fa-instagram',
        $can: () =>true,
        title: 'Social Links',
        routeTo: 'social-links',
        component: () => import('pages/profile/SocialLinks')
      }, {
        icon: 'fas fa-wallet',
        $can: () => true,
        title: 'My Wallet',
        routeTo: 'my-wallet',
        component: () => import('pages/profile/ProfileWallet')
      }, {
        title: 'Preferences',
        routeTo: 'my-preferences',
        $can: () => true,
        icon: 'fas fa-users-cog',
        component: () => import('pages/profile/UserPreferences')
      }],
  }, {
    icon: 'fas fa-users',
    title: 'User Management',
    // $can: () => router.app.$can('manage', 'users'),
    $can: () => true,
    childrenRoutes: [{
      icon: 'fas fa-lock',
      title: 'Roles and Permissions',
      // $can: () => router.app.$can('patch', 'roles'),
      $can: () => true,
      routeTo: 'permissions',
      component: () => import('pages/admin/Roles'),
      hiddenRoutes: [{
        routeTo: 'abilities',
        component: () => import('pages/admin/Abilities')
      }, {
        routeTo: 'rules',
        component: () => import('pages/admin/Rules')
      }]
    }, {
      icon: 'fas fa-user-friends',
      title: 'Users',
      // $can: () => router.app.$can('patch', 'users'),
      $can: () => true,
      routeTo: 'user-management',
      component: () => import('pages/admin/UserManagement'),
    }
    ],
  },
    {
      title: 'Project Management',
      icon: 'fas fa-server',
      $can: () => router.app.$can('patch', router.app.$createEntity('users', store.getters['auth/user'])),
      // iconColor: '#00aaf1',
      // textColor: 'red',
      childrenRoutes: [
        {
          icon: 'fas fa-database',
          $can: () => true,
          title: 'Multi Instances',
          routeTo: 'instances',
          component: () => import('pages/instances/Instances'),
          iconColor: 'orangered',
          textColor: 'purple'
        }, {
          icon: 'fas fa-location-arrow',
          $can: () => true,
          title: 'Domains',
          routeTo: 'domains',
          component: () => import('pages/domains/Domains')
        }, {
          icon: 'fab fa-instagram',
          $can: () =>true,
          title: 'Social Links',
          routeTo: 'social-links',
          component: () => import('pages/profile/SocialLinks')
        }, {
          icon: 'fas fa-wallet',
          $can: () => true,
          title: 'My Wallet',
          routeTo: 'my-wallet',
          component: () => import('pages/profile/ProfileWallet')
        }, {
          title: 'Preferences',
          routeTo: 'my-preferences',
          $can: () => true,
          icon: 'fas fa-users-cog',
          component: () => import('pages/profile/UserPreferences')
        }],
    }
  ];

  if(Object.keys(defaultRoute).length === 0) {
    defaultRoute = defaultRoutes[0].childrenRoutes[0];
  }

  router.addRoute({
    path: '/admin',
    name: 'admin',
    props() {
      return {
        linksConfig: [...routeConfigs, ...defaultRoutes],
        defaultRoute: defaultRoute
      };
    },

    meta: {requiresAuth: true},
    component: () => import('layouts/AdminLayout')
  });

  // if (Object.keys(defaultRoute).length) {
  //   let formattedDefault = getFormattedRoutes([defaultRoute])[0];
  //   router.addRoute('admin', {
  //     name: 'admin-home',
  //     ...formattedDefault,
  //     path: '',
  //     meta: {requiresAuth: true},
  //     // eslint-disable-next-line no-unused-vars
  //     beforeEnter(to, from, next) {
  //
  //     }
  //   });
  // } else {
  //   let formattedDefault = {
  //     path: 'my-profile',
  //     name: 'admin-my-profile',
  //     component: () => import('../pages/profile/EditProfile')
  //   };
  // }

  let routes = getFormattedRoutes([...routeConfigs, ...defaultRoutes]);

  routes.forEach((route) => {
    let {$can, ...link} = route;
    router.addRoute('admin', {
      ...link,
      meta: {requiresAuth: true},
      // eslint-disable-next-line no-unused-vars
      beforeEnter(to, from, next) {
        // $can() ? next() : next(from);
        if($can && !$can()) {
          Notify.create({
            type: 'negative',
            message: 'Page is restricted',
            timeout: 10000,
            actions: [
              {
                icon: 'close', color: 'white', handler: () => {
                  /* ... */
                }
              }
            ]
          });
          next(from);
        } else {
          next();
        }
      }
    });
  });

  // console.log('router.options.routes:', router.options.routes);
  // console.log('router.getRoutes():', router.getRoutes());
};

export default function ({store, ssrContext}) {
  const routes = Routes({store, ssrContext});

  const Router = new VueRouter({
    scrollBehavior: () => ({x: 0, y: 0}),
    routes,

    // Leave these as they are and change in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    mode: process.env.VUE_ROUTER_MODE,
    base: process.env.VUE_ROUTER_BASE
  });

  Router.beforeEach((to, from, next) => {
    if (!store.getters['auth/isAuthenticated']) {
      store.dispatch('auth/authenticate')
        .then(() => {
          // console.log('authenticated');
          // console.log('getters user', store.getters['auth/user']);
          if (to.meta.requiresAuth) {
            if (store.getters['auth/isAuthenticated']) {
              // console.log('pass');
              next();
            } else {
              // console.log('not pass', store.state.auth.user);
              Notify.create({
                type: 'negative',
                message: 'Page is restricted',
                timeout: 10000,
                actions: [
                  {
                    icon: 'close', color: 'white', handler: () => {
                      /* ... */
                    }
                  }
                ]
              });
              next('/login');
            }
          } else {
            next();
          }
        })
        .catch(() => {
          // console.log('not authenticated');
          if (to.meta.requiresAuth) {
            if (store.getters['auth/isAuthenticated']) {
              next();
            } else {
              Notify.create({
                type: 'negative',
                message: 'Page is restricted. Please login or register.',
                timeout: 10000,
                actions: [
                  {
                    icon: 'close', color: 'white', handler: () => {
                      /* ... */
                    }
                  }
                ]
              });
              next('/login');
            }
          } else {
            next();
          }
        });
    } else {
      next();
    }
  });

  adminRouteConfigure({
    router: Router,
    store,
    routeConfigs: [],
    defaultRoute: {
      icon: 'fas fa-lock',
      title: 'Roles and Permissions',
      routeTo: 'permissions',
      component: () => import('pages/admin/Roles'),
    }
  });

  return Router;
}
