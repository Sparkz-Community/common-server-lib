<script>
  import vClickOutside from 'v-click-outside';
  const { bind, unbind } = vClickOutside.directive;

  export default {
    name: 'renderless-with-click-outside',

    mounted() {
      this._el = document.querySelector('[data-rwco]');

      if (this._el) {
        bind(this._el, { value:  this.$emit('close')});
      }
    },
    beforeDestroy() {
      if (this._el) {
        unbind(this._el);
      }
    },

    render() {
      return this.$scopedSlots.default({
        props: {
          // we can't pass vue a ref attrubute up, as in we can
          // but will not be a vue $ref.
          // That being said we'll always have the mightu DOM.
          'data-rwco': true
          // we also can't pass v-click-outside-here :(
          // since it will be just an html attribute
        },
        listeners: {
          click: this.$emit('open')
        }
      });
    }
  };
</script>
