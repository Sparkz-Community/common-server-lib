<template>
  <q-layout view="hHh Lpr fff" :container="container">
    <q-header elevated>
      <q-toolbar>
        <q-btn v-if="essentialLinks.length > 0 && !$lisEmpty(user)"
               flat
               dense
               round
               icon="menu"
               aria-label="Menu"
               @click="leftDrawerOpen = !leftDrawerOpen"/>

        <q-toolbar-title>
          <q-btn flat label="Quasar App" to="/" class="text-h5"/>
          <q-toggle :value="$q.dark.mode"
                    @input="handleDarkModeToggle"
                    checked-icon="fas fa-sun"
                    color="dark"
                    unchecked-icon="fas fa-moon"/>
          <q-btn icon="fas fa-palette" flat @click="themeDio = true"/>
        </q-toolbar-title>

        <q-tabs shrink>
          <q-route-tab v-if="$lisEmpty(user)" name="login" label="Login" :to="{name: 'login'}" exact/>
          <q-route-tab v-if="!$lisEmpty(user)" name="logout" label="Logout" :to="{name: 'logout'}" exact/>
          <q-route-tab v-else name="register" label="Register" :to="{name: 'signup'}" exact/>
        </q-tabs>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen"
              v-if="essentialLinks.length > 0 && !$lisEmpty(user)"
              bordered>
      <q-list>
        <q-item-label header>
          Essential Links
        </q-item-label>
        <EssentialLink v-for="link in essentialLinks"
                       :key="link.title"
                       v-bind="link"/>
      </q-list>
    </q-drawer>

    <q-page-container>
      <slot>
        <router-view/>
      </slot>
    </q-page-container>

    <q-dialog v-model="themeDio" maximized>

      <q-card>
        <q-card-actions align="right" style="position: absolute; top: 0; right: 0; z-index: 100">
          <q-btn icon="close" class="q-pa-sm" size="md" flat round dense v-close-popup />
        </q-card-actions>
        <q-card-section class="q-pt-xl">
          <ThemePicker />
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-layout>
</template>

<script>
  import {mapGetters} from 'vuex';

  import EssentialLink from 'components/EssentialLink.vue';
  import ThemePicker from 'pages/themePicker/themePicker';

  export default {
    name: 'MainLayout',
    components: {
      ThemePicker,
      EssentialLink,
    },
    props: {
      container: {
        type: Boolean,
      },
    },
    data() {
      return {
        leftDrawerOpen: false,
        themeDio: false,
        essentialLinks: [
          // {
          //   title: 'Theme Picker',
          //   caption: `${window.location.origin}/theme`,
          //   icon: 'widgets',
          //   link: {name: 'theme'},
          // },
        ],
      };
    },
    created() {
      let rules = this.$lget(this.user, '_fastjoin.rules', []);
      this.$ability.update(rules);
    },
    computed: {
      ...mapGetters('auth', {
        user: 'user',
      }),
    },
    methods: {
      handleDarkModeToggle(val) {
        if (typeof val === 'boolean') {
          this.$q.dark.set(val);
          if (this.user) {
            let payload = {
              'theme.darkMode': val,
            };
            this.user.patch({data: payload})
              .then(res => {
                this.$q.notify({
                  type: 'positive',
                  message: `Successfully Updated "${res.email}" Dark Mode theme`,
                  timeout: 10000,
                  actions: [
                    {
                      icon: 'close', color: 'white', handler: () => {
                        /* ... */
                      },
                    },
                  ],
                });
              })
              .catch(err => {
                this.$q.notify({
                  type: 'negative',
                  message: err.message,
                  timeout: 10000,
                  actions: [
                    {
                      icon: 'close', color: 'white', handler: () => {
                        /* ... */
                      },
                    },
                  ],
                });
              });
          }
        }
      },
    },
  };
</script>
