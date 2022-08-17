<template>
  <div id="PlacesAutoCompleteBox" v-bind="$attrs['div-attrs']">
    <q-expansion-item icon="explore"
                      class="shadow-1 overflow-hidden"
                      header-class="bg-primary text-white"
                      expand-icon-class="text-white">
      <template v-slot:header="{}">
        <div style="width: 100%; display: grid; align-items: center;" @[ifClick].stop>
          <places-auto-complete :value="newEditedAddress"
                                @input="newEditedAddress = { ...value, ...$event }"
                                @error="searchInput = ''"
                                :path="path"
                                v-bind="$attrs"></places-auto-complete>
        </div>
      </template>

      <q-card>
        <q-card-section>
          <div class="row q-col-gutter-sm">
            <div class="col-12 col-sm-6">
              <q-input label="Address"
                       :value="newEditedAddress.address1"
                       disable></q-input>
            </div>
            <div class="col-12 col-sm-6">
              <q-input label="Region"
                       :value="newEditedAddress.region"
                       disable></q-input>
            </div>
            <div class="col-12 col-sm-6">
              <q-input label="City"
                       :value="newEditedAddress.city"
                       disable></q-input>
            </div>
            <div class="col-12 col-sm-6">
              <q-input label="Postal Code"
                       :value="newEditedAddress.postal"
                       disable></q-input>
            </div>
            <div class="col-12 col-sm-6">
              <q-input label="Country"
                       :value="newEditedAddress.country"
                       disabled></q-input>
            </div>
            <div class="col-12 col-sm-6">
              <q-input label="Latitude"
                       :value="newEditedAddress.latitude"
                       disabled></q-input>
            </div>
            <div class="col-12 col-sm-6">
              <q-input label="Longitude"
                       :value="newEditedAddress.longitude"
                       disabled></q-input>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-expansion-item>
  </div>
</template>

<script>
  import PlacesAutoComplete from '../atoms/PlacesAutoComplete/PlacesAutoComplete';

  export default {
    name: 'PlacesAutoCompleteBox',
    components: {
      PlacesAutoComplete
    },
    props: {
      value: {
        type: Object,
        required: false,
        default: function () {
          return {
            name: '',
            formatted: '',
            address1: '',
            address2: '',
            region: '',
            route: '',
            city: '',
            postal: '',
            country: '',
            latitude: 0,
            longitude: 0,
          };
        }
      },
      path: {
        required: true
      },
    },
    mounted(){
      if(this.value.name.length) {
        this.newEditedAddress = this.value;
      }
    },
    data() {
      return {
        newEditedAddress: {},
      };
    },
    watch: {
      $attrs: {
        immediate: true,
        deep: true,
        handler(newVal) {
          // attrs defaults
          this.$lset(newVal, 'attrs.filled', this.$lget(newVal, 'attrs.filled', false));
          this.$lset(newVal, 'attrs.dark', this.$lget(newVal, 'attrs.dark', true));
          this.$lset(newVal, 'attrs.borderless', this.$lget(newVal, 'attrs.borderless', true));
          this.$lset(newVal, 'attrs.dense', this.$lget(newVal, 'attrs.dense', true));
          this.$lset(newVal, 'attrs.popup-content-style', this.$lget(newVal, 'attrs.popup-content-style', 'background-color: white;'));

          // div-attrs defaults
          this.$lset(newVal, 'div-attrs.class', this.$lget(newVal, 'div-attrs.class', 'col-12 col-sm-6'));
        }
      },
      newEditedAddress: {
        deep: true,
        // eslint-disable-next-line no-unused-vars
        handler(newVal, oldVal) {
          // console.log('Old: ', oldVal,'New: ', newVal);
          if (JSON.stringify(this.value) !== JSON.stringify(newVal)) {
            this.$emit('input', newVal);
          }
        }
      },
      value: {
        deep: true,
        // eslint-disable-next-line no-unused-vars
        handler(newVal, oldVal) {
          if (JSON.stringify(newVal) !== JSON.stringify(oldVal)) {
            this.newEditedAddress = newVal;
          }
        }
      },
    },
    computed: {
      ifClick() {
        return this.$lget(this.$attrs, 'attrs.readonly') ? null : 'click';
      }
    }
  };
</script>

<style lang="scss">
  .q-item--dark {
    color: black;
  }
</style>

<style scoped lang="scss">
</style>
