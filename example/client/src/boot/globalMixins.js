import {colors} from 'quasar';
import {mapGetters} from 'vuex';

export default async ({Vue}) => {
  Vue.mixin({
    computed: {
      ...mapGetters('auth',{$authUser:'user'}),
    },
    methods: {
      // eslint-disable-next-line no-unused-vars
      $lightenHex(cssVar, amt = 40) {
        let color = this.$getCssVar(cssVar);
        let r = colors.hexToRgb(color);
        return `rgba(${r.r + amt}, ${r.g + amt}, ${r.b + amt}, ${!this.$lisEmpty(r.a) ? r.a / 100 : '1'})`;
      },
      $successNotify(message) {
        this.$q.notify({ message: message, color: 'positive', timeout: 4000 });
      },
      $errNotify(message) {
        this.$q.notify({
          message: message,
          color: 'negative',
          position: 'top',
          icon: 'mdi-alert-circle',
          timeout: 30000,
          actions: [{ icon: 'mdi-close', color: 'white' }],
        });
      }
    }
  })
  ;
};
