<template>
  <div id="forgotPassword">
    <p class="cursor-pointer text-h5 text-primary q-mt-sm" @click="forgot_password_dialog = true">Forgot password?</p>

    <q-dialog v-model="forgot_password_dialog">
      <q-layout view="hHh Lpr fff" container class="bg-white forgotPasswordSize q-ma-xs q-pa-none">

        <q-page-container class="q-pa-none">
          <q-page class="q-pa-md">
            <p class="text-caption text-bold">Find your account...</p>

            <q-select v-model="selected_search_option"
                      label="Field used to find you"
                      text-class="text-caption"
                      use-input
                      hide-selected
                      transition-show="flip-up"
                      transition-hide="flip-down"
                      fill-input
                      dense
                      input-debounce="0"
                      :options="search_options"
                      hint="What's your email?">
              <template v-slot:before>
                <q-icon name="mdi-database-search"/>
              </template>
              <template v-slot:no-option>
                <q-item>
                  <q-item-section>
                    No results
                  </q-item-section>
                </q-item>
              </template>
            </q-select>

<!--            <phone-input path="phone"
                        v-if="$lget(selected_search_option, 'label', '') === 'Phone'"
                        v-model="phone_number_value"
                        style="margin-top: 20px; height: 40px;"
            />-->

            <vue-tel-input v-if="$lget(selected_search_option, 'label', '') === 'Phone'"
                           label="Phone"
                           v-model="phone_number_value"
                           :mode="'international'"
                           @input="getPhone"
                           transition-show="flip-up"
                           transition-hide="flip-down"
                           :autocomplete="'nope'"
                           :validCharactersOnly="true"
                           :dynamicPlaceholder="true"
                           :preferredCountries="['US','CA','MX','GB']"
                           style="margin-top: 20px; height: 40px;"></vue-tel-input>
            <q-input v-else
                     dense
                     v-model="search_value"
                     :label="$lget(selected_search_option, 'label', '')"
                     bottom-slots
                     required>
              <template v-slot:prepend>
                <q-icon name="fas fa-inbox"/>
              </template>
              <template v-slot:hint>
                Enter your {{$lget(selected_search_option, 'label', '')}} for us to search.
              </template>
            </q-input>

            <div style="text-align: right; width: 100%;">
              <q-btn class="q-mt-md"
                     @click="search"
                     :color="valid_account ? 'positive' : 'white'"
                     :text-color="valid_account ? 'white' : 'black'">
                <q-icon v-if="valid_account" name="done"></q-icon>
                Search
              </q-btn>
            </div>

            <div v-if="valid_account">
              <q-separator class="q-my-md"></q-separator>

              <q-select v-model="selected_notifier_options"
                        label="Where should we send the recovery info?"
                        multiple
                        use-chips
                        dense
                        transition-show="flip-up"
                        transition-hide="flip-down"
                        :options="notifier_options"
                        hint="Recovery Contact Method">
                <template v-slot:before>
                  <q-icon name="mdi-database-search"/>
                </template>
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section>
                      No results
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </div>
          </q-page>
        </q-page-container>

        <q-footer bordered class="bg-white text-black">
          <q-toolbar>
            <!--              <q-toolbar-title>Footer</q-toolbar-title>-->
            <q-space></q-space>

            <q-btn outlined
              color="primary"
                   flat
                   @click="resetResetPassword">Cancel
            </q-btn>

            <q-btn color="primary"
                   :disable="!valid_account || !search_value"
                   @click="sendReset">Send Reset
            </q-btn>
          </q-toolbar>
        </q-footer>
      </q-layout>
    </q-dialog>
  </div>

</template>

<script>
  import {ref, /*reactive, toRefs,*/ watch} from '@vue/composition-api';
  // import PhoneInput from '@ionrev/quasar-app-extension-ir-form-gen-app/src/components/common/atoms/PhoneInput/PhoneInput.vue';
  export default {
    name: 'generic-forgot-password',
    props: {
      selected_search_option_init: {
        type: Object,
        default() {
          return {
            label: 'E-mail',
            path: 'email'
          };
        }
      },

      search_options: {
        type: Array,
        default() {
          return [
            {
              label: 'E-mail',
              path: 'email'
            },
            {
              label: 'Phone',
              path: 'phone.number.e164'
            },
            {
              label: 'Username',
              path: 'username'
            },
          ];
        }
      }
    },
    // components:{PhoneInput},
    // eslint-disable-next-line no-unused-vars
    setup(props, {root}) {
      let axiosFeathers = root.$axios.create({
        baseURL: process.env.VUE_APP_FEATHERS_URL || 'http://localhost:3030',
        headers: {
          ContentType: 'application/x-www-form-urlencoded',
          Accept: 'application/json',
          // Authorization: 'Bearer ' + root.$store.state.auth.accessToken
        }
      });

      let notifier_options = ref([{label: 'E-Mail', value: 'email'}, {label: 'Text Message', value: 'sms'}]);
      let selected_notifier_options = ref([{label: 'E-Mail', value: 'email'}]);

      let selected_search_option = ref(props.selected_search_option_init);

      let phone_number_value = ref('');

      let forgot_password_dialog = ref(false);
      let search_value = ref('');
      watch(selected_search_option, (newVal, oldVal) => {
        if (JSON.stringify(newVal) !== JSON.stringify(oldVal)) {
          search_value.value = '';
          phone_number_value.value = '';
        }
      }, {});

      let valid_account = ref(false);

      // eslint-disable-next-line no-unused-vars
      function getPhone(number, isValid, country) {
        search_value.value = isValid;
      }

      async function search() {
        // let hcaptcha_data = await root.$verifyHcaptcha(process.env.HCAPTCHA_SECRET, process.env.HCAPTCHA_TOKEN);
        // console.log('hcaptcha_data:', hcaptcha_data);

        let value = root.$lget(search_value.value, 'number.e164', search_value.value);
        const payload = {
          action: 'checkUnique',
          value: {
            [selected_search_option.value.path]: value,
          }
        };

        root.$isLoading(true);

        axiosFeathers.post('/authManagement', {...payload})
          .then((result) => {
            console.log('search result:', result);
            valid_account.value = false;
            root.$isLoading(false);

            root.$q.notify({
              type: 'negative',
              message: 'Failed to locate Account!',
              timeout: 50000,
              actions: [
                {
                  icon: 'close',
                  color: 'white',
                  handler: () => {
                    /* ... */
                  }
                }
              ]
            });
          })
          .catch(error => {
            console.log('search error:', error);
            valid_account.value = true;
            root.$isLoading(false);

            root.$q.notify({
              type: 'positive',
              message: 'Account found!',
              timeout: 20000,
              actions: [
                {
                  icon: 'close',
                  color: 'white',
                  handler: () => {
                    /* ... */
                  }
                }
              ]
            });
          });
      }

      function sendReset() {
        let value = root.$lget(search_value.value, 'number.e164', search_value.value);
        const payload = {
          action: 'sendResetPwd',
          value: {
            [selected_search_option.value.path]: value,
          },
          notifierOptions: {preferredComm: selected_notifier_options.value.map(item => item.value)}
        };

        root.$isLoading(true);

        axiosFeathers.post('/authManagement', {...payload})
          .then((result) => {
            console.log('sendReset result:', result);
            valid_account.value = false;
            root.$isLoading(false);

            root.$q.notify({
              type: 'positive',
              message: `<b>Success</b> - check your <b>E-Mail</b> at: ${search_value.value}!`,
              html: true,
              timeout: 20000,
              actions: [
                {
                  icon: 'close',
                  color: 'white',
                  handler: () => {
                    /* ... */
                  }
                }
              ]
            });
          })
          .catch(error => {
            console.log('sendReset error:', error);
            valid_account.value = true;
            root.$isLoading(false);

            root.$q.notify({
              type: 'negative',
              message: error.message,
              timeout: 50000,
              actions: [
                {
                  icon: 'close',
                  color: 'white',
                  handler: () => {
                    /* ... */
                  }
                }
              ]
            });
          });
      }

      function resetResetPassword() {
        forgot_password_dialog.value = false;
        valid_account.value = false;
        search_value.value = '';
      }

      return {
        notifier_options,
        selected_notifier_options,
        forgot_password_dialog,
        search_value,
        valid_account,
        selected_search_option,
        phone_number_value,
        getPhone,
        search,
        resetResetPassword,
        sendReset,
      };
    }

  };
</script>

<style scoped lang="scss">
  #forgotPassword {
    // Vars

    // Support

    // Module
    & {
      //
    }

    // Facets

    // States
  }

  .forgotPasswordSize::v-deep {
    max-height: 60vh;
    max-width: 60%;

    @media screen and (max-width: 1053px) {
      max-width: 40vw;
    }
    @media screen and (max-width: 800px) {
      max-width: 60vw;
    }
    @media screen and (max-width: 461px) {
      max-width: 80vw;
    }
  }

</style>

