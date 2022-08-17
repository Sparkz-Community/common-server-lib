<template>
  <div id="q-app">
    <router-view :key="$route.fullPath" />
  </div>
</template>

<script>
  import {mapGetters} from 'vuex';

  export default {
    name: 'App',
    data() {
      return {};
    },
    watch: {
      stateUser: {
        immediate: true,
        deep: true,
        handler(newVal) {
          // console.log('user', newVal);
          this.$removeAllCssVars();

          let theme = this.$lget(newVal, 'theme');
          if (theme) {
            Object.keys(theme).forEach(k => {
              if (k.startsWith('--') && theme[k]) {
                this.$setCssVar(k, theme[k]);
              }
            });
          }

          let darkMode = this.$lget(newVal, 'theme.darkMode', undefined);
          if (!this.$lisNil(darkMode)) {
            this.$q.dark.set(darkMode);
          } else {
            this.$q.dark.set(false);
          }
        }
      },
    },
    computed: {
      ...mapGetters('auth', {
        stateUser: 'user'
      }),
    },
    methods: {}
  };
</script>
