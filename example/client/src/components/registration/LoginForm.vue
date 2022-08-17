<template>
    <div v-if="!$authUser" style="max-width: 550px">
      <form-generator
        v-model="formData"
        :fields="fields"
        @valid="valid = $event"
        useQform
        :valid.sync="valid"
      >
        <template v-slot:prepend="{key_name}">

          <q-icon v-if="key_name === 'email'" name="mail"/>
          <q-icon v-if="key_name === 'password'" name="lock"/>
        </template>
        <template v-slot:append>
          <q-icon :name="isPwd ? 'visibility' : 'visibility_off'" @click="isPwd = !isPwd"/>
        </template>

      </form-generator>
      <div class="row justify-between items-center q-px-none">
        <generic-forgot-password />
        <q-btn  color="primary"
        label="Login"
        type="submit"
        :disable="!valid"
                @click.prevent="loginUser"
        />
      </div>
    </div>
</template>

<script>
  import {mapGetters,mapActions} from 'vuex';
  import GenericForgotPassword from 'components/registration/GenericForgotPassword';

  export default {
    name: 'login-form',
    components: {GenericForgotPassword},
    data() {
      return {
        isPwd: true,
        valid: false,
        openDialog:false,
        formData:{
          email: '',
          password: '',
        },

        fields: [

          {
            fieldType: 'TextInput',
            path: 'email',
            slots: ['prepend'],
            attrs: {
              label: 'Email',
              type: 'email',
              clearable: true,
              dense:true,
              outlined: true,
              inputClass:'text-caption',
              'clear-icon': 'close',
              required: true,
              rules: [this.$notEmptyRule,],
              autofocus:true,
            },
            'div-attrs': {
              class: 'col-12',
            },
          },
          {
            fieldType: 'TextInput',
            path: 'password',
            slots: ['prepend', 'append'],
            attrs: {
              label: 'Password',
              type: 'password',
              autofocus:false,
              clearable: true,
              dense:true,
              outlined: true,
              inputClass:'text-caption',
              'clear-icon': 'close',
              required: true,
              rules: [this.$notEmptyRule,],
            },
            'div-attrs': {
              class: 'col-12',
            },
          },

        ],


      };
    },
    watch: {

      password: {
        deep: true,
        immediate: true,
        handler(newVal) {
          let password = this.$lfind(this.fields, {path: 'password'});
          password.attrs.type = newVal;
        },
      },

    },
    computed: {
      ...mapGetters('auth', {authUser:'user'}),
      password() {
        return this.isPwd ? 'password' : 'text';
      },

    },
    methods: {
      ...mapActions('auth', {
        authenticate: 'authenticate',
      }),

      async loginUser() {

        this.authenticate({...this.formData, strategy: 'local'})
          // eslint-disable-next-line no-unused-vars
          .then((auth) => {
            const hasDefaultPaymentMethod = !!this.$lget(auth,'user.defaultPaymentMethod');
            console.log(auth);
            hasDefaultPaymentMethod? this.$router.push('/dashboard'):this.$router.push('/applications');
            this.$q.notify({
              message: 'Successfully Logged in',
              color: 'positive'
            });
          })
          .catch(error => {
            this.$q.notify({
              message: error.message,
              color: 'negative'
            });
          });

      },
      getPhone(number, isValid,) {
        this.search_value = isValid;
      },
      async search(){

        const action = 'checkUnique';
        const value = {

          [this.$lget(this.selected_search_option, 'path', '')]: this.$lget(this.search_value, 'number.e164', this.search_value),
        };
        console.log({action,value});
      }
    },

  };
</script>
