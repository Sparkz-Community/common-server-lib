<template>
  <div style="max-width: 550px">

    <form-generator
      v-model="formData"
      :fields="fields"
      @valid="valid = $event"
      @click="handleClick"
      useQform
      :valid.sync="valid"
    >
      <template v-slot:prepend="{key_name}">
        <q-icon v-if="key_name === 'name'" name="fa fa-user"/>
        <q-icon v-if="key_name === 'email'" name="mail"/>
        <q-icon v-if="['password', 'confirm_password'].includes(key_name)" name="lock"/>
      </template>
      <template v-slot:append>
        <q-icon :name="isPwd ? 'visibility' : 'visibility_off'" @click="isPwd = !isPwd"/>
      </template>

    </form-generator>
<!--    <div class="row justify-between">
      <q-space/>
      <q-btn
       class="submit-btn"
        color="secondary"
              label="Register"
              type="submit"
              glossy
              :disable="!valid"
              @click.prevent="verify_dialog=true"
      />
    </div>-->
    <q-dialog v-model="verify_dialog" persistent>
      <q-card class="q-py-lg q-gutter-md" style="min-width: 50vw">
        <q-card-section>
          <div class="text-h6">How would you like to verify your account?</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-checkbox v-model="verify_value" label="E-mail" val="email"/>
          <q-checkbox v-model="verify_value" label="Phone" val="sms"/>
          <div v-if="verify_value.includes('sms')">
            <form-generator
              v-model="formData"
              :fields="verify_fields"
              @valid="valid = $event"
              useQform
              :valid.sync="valid"
            />
          </div>
        </q-card-section>
        <q-card-actions align="right" class="text-primary">
          <q-btn flat text-color="primary" outline label="Cancel" v-close-popup/>
          <q-btn color="primary" label="Ok" v-close-popup @click="registerUser"/>
        </q-card-actions>
      </q-card>
    </q-dialog>

  </div>
</template>

<script>
  import {models} from 'feathers-vuex';

  export default {
    name: 'signup-form',
    data: function () {
      return {
        OAuthOff: false,
        isPwd: true,
        valid: false,
        verify_dialog: false,
        verify_value: ['email'],
        socialLinks: [
          {
            name: 'Google',
            icon: 'mdi-google',
            img: 'https://rayraysolarstatic.s3-us-west-1.amazonaws.com/Google__G__Logo.svg.png',
            color: 'red',
            link: `${process.env.VUE_APP_FEATHERS_URL}/oauth/google`,
          },
          {
            name: 'Facebook',
            icon: 'mdi-facebook',
            color: '#2090E1',
            link: `${process.env.VUE_APP_FEATHERS_URL}/oauth/facebook`,
          },
        ],

        formData: {
          name: '',
          email: '',
          password: '',
          passwordStrength: '',
          confirm_password: '',
          phone: {
            title: 'Phone Number',
            country: 'US',
            number: '',
          },
        },

        fields: [

          {
            fieldType: 'TextInput',
            path: 'email',
            slots: ['prepend'],
            attrs: {
              label: 'Email',
              type: 'email',
              dense:true,
              inputClass:'text-caption',
              required: true,
              outlined: true,
              rules: [this.$notEmptyRule, this.$emailRule],
            },
            'div-attrs': {
              class: 'col-12',
            },
          },
          {
            fieldType: 'PasswordStrengthIndicator',
            path: 'passwordStrength',
            attrs: {
              password: '',
              label: 'Password Strength',
              stripe: true,
              rounded: true,
              size: '13px',
              outlined: true,
              class: 'q-mt-sm',
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
              dense:true,
              inputClass:'text-caption',
              required: true,
              outlined: true,
              rules: [this.$notEmptyRule, this.$passwordCheckRule],
            },
            'div-attrs': {
              class: 'col-12',
            },
          },
          {
            fieldType: 'TextInput',
            path: 'confirm_password',
            slots: ['prepend', 'append'],
            attrs: {
              label: 'Confirm Password',
              type: 'password',
              dense:true,
              inputClass:'text-caption',
              required: true,
              outlined: true,
              rules: [this.$notEmptyRule, val => this.$matchingRule(val, this.formData.password)],
            },
            'div-attrs': {
              class: 'col-12',
            },
          },
          {
            fieldType: 'PhoneInput',
            path: 'phone',
            attrs: {
              defaultCountry: 'US',
              autoDefaultCountry: true,
              invalidMsg: 'Enter valid mobile Number',
              onlyCountries: ['US', 'CA'],
              validCharactersOnly: true,
            },
            'div-attrs': {
              class: 'col-12 col-sm-9',
            },
          },

          {
            fieldType: 'btn',
            path: 'btn',
            attrs: {
              color: 'primary',
              label: 'Signup',
              glossy: true,
              disable: true,
            },
            'div-attrs': {
              class: 'col-12 col-sm-3 text-right q-my-md',
            },
          },

        ],

        verify_fields: [
          {
            fieldType: 'PhoneInput',
            path: 'phone',
            attrs: {
              defaultCountry: 'US',
              autoDefaultCountry: true,
              invalidMsg: 'Enter valid mobile Number',
              onlyCountries: ['US', 'CA'],
              validCharactersOnly: true,
            },
            'div-attrs': {
              class: 'col-12 col-sm-6',
            },
          },
        ],

      };
    },

    watch: {
      valid: function (newVal) {
        let btn = this.$lfind(this.fields, {path: 'btn'});
        btn.attrs.disable = !newVal;
      },
      password: {
        deep: true,
        immediate: true,
        handler(newVal) {
          let password = this.$lfind(this.fields, {path: 'password'});
          password.attrs.type = newVal;

          let confirm_password = this.$lfind(this.fields, {path: 'confirm_password'});
          confirm_password.attrs.type = newVal;
        },
      },
      formData: {
        deep: true,
        handler(newVal) {
          const passwordStrengthIndicator = this.$lfind(this.fields, {path: 'passwordStrength'});

          passwordStrengthIndicator['attrs']['password'] = newVal.password || '';
        },
      },
    },
    computed: {

      passStrength() {
        return this.$passwordStrength(this.password);
      },
      passStrengthValue() {
        if (this.passStrength === 'Weak') {
          return .33333;
        } else if (this.passStrength === 'Medium') {
          return .66666;
        } else if (this.passStrength === 'Strong') {
          return 1;
        } else {
          return 0;
        }
      },
      linerProgressColor() {
        if (this.passStrength === 'Weak') {
          return 'red';
        } else if (this.passStrength === 'Medium') {
          return 'orange';
        } else if (this.passStrength === 'Strong') {
          return 'green';
        } else {
          return 'white';
        }
      },
      password() {
        return this.isPwd ? 'password' : 'text';
      },

    },
    methods: {

      handleClick(event, path) {
        if (path === 'btn') {
          this.verify_dialog = true;
        }
      },
      async registerUser() {

        try {
          let user = new models.api.Users(this.formData).clone();
          console.log(user, 'result user', this.$lget(this, 'verify_value', []));
          const result = await user.create();
          let data = result;
          this.$q.notify({
            message: `Hey ${result.name}! A verification code has been sent to your ${this.verify_value}`,
            color: 'positive',
          });
          data = {
            email: this.formData.email,
            phone: this.formData.phone,
            verifyWith: this.verify_value,
          };
          await this.$q.sessionStorage.set('registered-credentials', data);
          await this.$router.push({name: 'verify', query: this.$route.query});
        } catch (error) {
          console.error(error);
          this.$q.notify({
            message: `Error: ${error.message}`,
            color: 'negative',
          });
        }

      },

    },

  };
</script>
<style scoped>
  .submit-btn{
    margin-top:-40px;
  }
  @media only screen and (max-width: 600px) {
    .submit-btn{
      margin:20px;
      align-self: center;
    }
  }
</style>
