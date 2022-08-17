<template>
  <q-card flat class="q-px-xl bg-grey-1">

    <q-card-actions class="row justify-between">
      <slot name="navigation-controls">

      </slot>

    </q-card-actions>
    <q-card-section  class="column items-center q-gutter-lg">
      <q-form class="column q-gutter-lg" @submit="$emit('add-application',formData)" >
        <div class="q-ma-lg">
          <p class="text-h5 text-center">Upload Application Logo </p>

          <image-select :value="formData.avatar"
                        @input="formData.avatar = $event[0]"
                        :label-attrs="{'v-text': '(optional)'}"
                        :attrs="{
                            dropValidation:true,
                            stylePanelLayout:'compact',
                            stylePanelAspectRatio:'1:1',
                            labelIdle:`drop or <span class='filepond--label-action'>browse</span> logo`,
                            labelFileLoadError:'Loading Error',
                            labelFileProcessingError:'Uploading Error',
                            imagePreviewHeight:'160',
                            imagePreviewWidth:'160',
                            styleButtonRemoveItemPosition:'center',
                            styleLoadIndicatorPosition:'center',
                            styleButtonProcessItemPosition:'center',
                            styleProgressIndicatorPosition:'center',
                            credits:null
                          }"
                        path="avatar"/>
        </div>
        <div class="q-ma-lg">
          <p class="text-h5 text-center">What is your application called? </p>
          <q-input
            input-class="text-h6 text-center text-grey-7"
            placeholder="Enter your application's name here"
            v-model="formData.name"
            required
            :rules="[
          val => !!val || '* Required',
          val => val.length > 2 || 'A valid tally application name should at least be 3 characters long.',
        ]"
            :lazy-rules="true"
          />
        </div>

        <div class="q-ma-lg">
          <p class="text-h5 text-center">Do you want to manage this Application? </p>
          <div class="q-gutter-sm row justify-between">
            <q-radio @input="makeManager" :val="true" label="Yes"  :value="formData.manager"/>
            <q-radio @input="makeManager" :val="false" label="No" :value="formData.manager"/>
          </div>
        </div>


        <slot name="submit-btn">

        </slot>

      </q-form>

    </q-card-section>
  </q-card>
</template>

<script>
  import ImageSelect from '@ionrev/quasar-app-extension-ir-form-gen-app/src/components/common/atoms/ImageSelect/ImageSelect';
  import { models } from 'feathers-vuex';

  export default {
    name: 'create-application-form',
    components: {ImageSelect},

    data: function () {
      return {
        formData: new models.api.Applications({manager:true}).clone()
      };
    },

    methods: {
      makeManager(value){
        this.formData.manager=value;
      }
    }

  };
</script>
<style lang="scss">
  .input-class {
    line-height: inherit !important;
  }
</style>
