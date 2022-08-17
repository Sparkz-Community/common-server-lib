<template>
  <q-page>
    <div class="my-addresses">
      <div class="box-wrapper">
        <div @click="newAddressDio = true" class="box new-address" :style="{backgroundColor: $q.dark.mode ? $lightenHex('--q-color-dark') : ''}">
          <q-icon name="fas fa-plus" size="xl"/>
          <div>Add New Address</div>
        </div>
        <div @click="selectAddress(address)" class="box address" v-for="(address, idx) of user.addresses" :key="idx" :style="{backgroundColor: $q.dark.mode ? $lightenHex('--q-color-dark') : ''}">
          <q-icon @click="removeAddress(address)" name="far fa-trash-alt" color="red" class="delete">
            <q-tooltip>Remove address</q-tooltip>
          </q-icon>
          <div class="name">{{ address.name ? address.name : 'No name' }}</div>
          <div class="address1">Street Address: {{ address.address1 }}</div>
          <div class="region">Region: {{ address.region }}</div>
          <div class="city">City: {{ address.city }}</div>
          <div class="postal">Postal Code: {{ address.postal.replace('-undefined', '') }}</div>
          <div class="country">Country: {{ address.country }}</div>
        </div>
      </div>

      <q-dialog v-model="newAddressDio">
        <q-card style="min-width: 50vw; padding: 10px; border-top: 25px solid var(--q-color-primary)">
          <q-card-section style="display: flex; align-items: center; justify-content: space-between">
            <PlacesAutoCompleteBox style="flex: .7" :path="newAddress" @input="getAddress"/>
            <q-input label="Name" v-model="addressNameInput" style="flex: .25"/>
          </q-card-section>
          <q-card-actions align="right" class="q-mt-md">
            <q-btn label="Cancel" v-close-popup color="red"/>
            <q-btn label="Save Address" v-close-popup @click="saveAddress" color="primary"/>
          </q-card-actions>
        </q-card>
      </q-dialog>

      <q-dialog v-model="showAddressDio">
        <q-card style="min-width: 40vw;">
          <PlacesAutoCompleteBox :value="selectedAddress" :path="newAddress" />
        </q-card>
      </q-dialog>
    </div>
  </q-page>
</template>

<script>
  import PlacesAutoCompleteBox from 'components/common/substance/PlacesAutoCompleteBox';
  import {mapGetters, mapActions} from 'vuex';

  export default {
    name: 'MyAddresses',
    components: {PlacesAutoCompleteBox},
    data() {
      return {
        newAddress: null,
        newAddressDio: false,
        addressNameInput: '',
        showAddressDio: false,
        selectedAddress: {}
      };
    },
    computed: {
      ...mapGetters('auth', {user: 'user'}),
    },
    methods: {
      ...mapActions('users', {
        patchUser: 'patch',
      }),
      getAddress(e) {
        this.newAddress = e;
      },
      saveAddress() {
        this.newAddress.name = this.addressNameInput;
        this.patchUser([this.user._id, {
          $push: {
            addresses: this.newAddress,
          },
        }]).then(() => this.$q.notify({
          message: 'Address Added!',
          color: 'positive',
        })).catch(() => {
          this.$q.notify({
            message: 'Something went wrong on our end, try refreshing',
            color: 'negative',
          });
        });
        this.addressNameInput = '';
      },
      removeAddress(address) {
        this.patchUser([this.user._id, {
          $pull: {
            addresses: address
          }
        }]);
      },
      selectAddress(address) {
        this.selectedAddress = address;
        this.showAddressDio = true;
      }
    },
  };
</script>

<style scoped lang="scss">
  .box-wrapper {
    padding: 30px 10px 0 10px;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    grid-gap: 15px;
    justify-items: center;

    .box {
      width: 95%;
      max-height: 40vh;
      min-height: 29vh;
      box-shadow: 2px 2px 4px 2px rgba(0, 0, 0, 0.25);
      transition: 0.2s all;
    }

    .box:hover {
      background-color: #edeff3;
      transform: scale(1.05);
      cursor: pointer;
    }

    .new-address {
      display: flex;
      align-items: center;
      flex-direction: column;
      justify-content: center;
    }

    .address {
      overflow-y: scroll;
      padding: 10px;
      position: relative;

      div:not(.name) {
        margin: 6px 0;
      }

      .delete {
        position: absolute;
        right: 10px;
        top: 10px;
        cursor: pointer;
        font-size: 1.3em;
      }

      .name {
        font-size: 1.4em;
        font-weight: 500;
        margin-bottom: 8px;
      }
    }

    .address::-webkit-scrollbar {
      display: none;
    }
  }
</style>
