<template>
  <div id="btn" v-bind="$attrs['div-attrs']">
    <q-btn :name="path" v-bind="$attrs['attrs']" @click="$emit('click', $event, path)" v-on="listeners">
      <template v-for="slot in slots" v-slot:[slot]="slotProps">
        <slot :name="slot" :key_name="path" v-bind="slotProps"></slot>
      </template>
    </q-btn>
  </div>
</template>

<script>
  export default {
    name: 'btn',
    inheritAttrs: false,
    props: {
      path: {
        required: true
      },
      slots: {
        type: Array,
        default() {
          return [];
        }
      }
    },
    data() {
      return {};
    },
    watch: {
      $attrs: {
        immediate: true,
        deep: true,
        handler(newVal) {
          // attrs defaults
          // this.$lset(newVal, 'attrs.label', this.$lget(newVal, 'attrs.label', 'label'));

          // div-attrs defaults
          this.$lset(newVal, 'div-attrs.class', this.$lget(newVal, 'div-attrs.class', 'col-12 col-sm-6'));
        }
      },
    },
    computed: {
      listeners() {
        // eslint-disable-next-line no-unused-vars
        const {input, ...listeners} = this.$listeners;
        return listeners;
      },
    },
  };
</script>

<style scoped>
  #btn {

  }
</style>
