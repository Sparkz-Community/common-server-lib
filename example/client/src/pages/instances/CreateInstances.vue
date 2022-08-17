<template>
  <q-card flat class="q-px-xl bg-grey-1">

    <q-card-actions class="row justify-between">
      <slot name="navigation-controls">

      </slot>

    </q-card-actions>
    <q-card-section  class="column items-center q-gutter-lg">
      <q-form class="column q-gutter-lg" @submit="$emit('add-instance',formData)" >
        <div class="q-ma-lg">


        </div>
        <div class="q-ma-lg">
          <p class="text-h5 text-center">Name your instance</p>
          <q-input
            input-class="text-h6 text-center text-grey-7"
            placeholder="Instance name here"
            v-model="formData.name"
            required
            :rules="[
          val => !!val || '* Required',
          val => val.length > 2 || 'A valid tally instance name should at least be 3 characters long.',
        ]"
            :lazy-rules="true"
          />
        </div>

<!--        <div class="q-ma-lg">
          <p class="text-h5 text-center">Do you want to manage this Application? </p>
          <div class="q-gutter-sm row justify-between">
            <q-radio @input="makeManager" :val="true" label="Yes"  :value="formData.manager"/>
            <q-radio @input="makeManager" :val="false" label="No" :value="formData.manager"/>
          </div>
        </div>-->


        <slot name="submit-btn">

        </slot>

      </q-form>

    </q-card-section>
  </q-card>
</template>

<script>
  // import ImageSelect from '@ionrev/quasar-app-extension-ir-form-gen-app/src/components/common/atoms/ImageSelect/ImageSelect';
  import { models } from 'feathers-vuex';

  export default {
    name: 'create-instances-form',
    // components: {ImageSelect},

    data: function () {
      return {
        formData: new models.api.Instances().clone()
      };
    },

    methods: {
      // makeManager(value){
      //   this.formData.manager=value;
      // }
    }

  };
</script>
<style lang="scss">
  .input-class {
    line-height: inherit !important;
  }
</style>
