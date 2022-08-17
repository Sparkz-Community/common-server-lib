<template>
    <div class="code-verifier column items-center justify-center" >
      <p class="text-h6">Enter the verification code you received</p>
      <code-input
        ref="codeInput"
        :loading="loading&&!errored"
        class="input q-mb-xl"
        @change="onChange"
        @complete="onComplete"
        v-bind="$attrs"
      />
      <div>
        <span class="text-caption text-bold text-secondary">Expires in <span>{{ countDown }}</span> mins</span>
        <q-btn
          color="white"
          text-color="black"
          label="Get a new one"
          class="q-ma-sm"
          :disable="disabled"
          @click="resendVerificationCode"
        />
      </div>
    </div>
</template>

<script>
  import CodeInput from 'vue-verification-code-input';
  import {mapState,mapActions} from 'vuex';

  export default {
    name: 'code-verifier',

    components: {
      CodeInput
    },
    props:{
      user:{
        type: Object,
        required: true,
      }
    },
    async created(){

      this.countDownTimer();

    },

    data() {

      return {
        loggingIn: true,
        verifyCode: '',
        countDown:30,
        disabled:true,
        errored:false,
      };

    },
    watch: {
      errored(newVal){

        this.disabled=newVal;

      },
      countDown(newVal){

        this.disabled=(newVal>0)&&!this.errored;

      }
    },
    computed:{
      ...mapState('authManagement', {loading:'isCreatePending'}),
    },
    methods: {
      ...mapActions('authManagement',{verify:'create'}),

      onChange(v) {
        // set short token
        this.verifyCode=v;
      },

      async verifyShort(token){
        // verify with short token
        this.disabled=true;
        try{

          const action = 'verifySignupShort';
          const value = {
            user: {'email': this.user.email},
            token
          };
          await this.verify({ action, value }, {});

          this.$q.notify({
            message: 'Congrats! Your registration is now verified. Login!',
            color: 'positive'
          });

          await this.$q.sessionStorage.set('registered-credentials',null);
          await this.$router.push('/login');

        }
        catch(error){

          this.errored=true;
          this.$q.notify({
            message: `VERIFICATION ERROR: ${error.message}`,
            color: 'negative'
          });

        }
      },
      async onComplete(v) {
        try{

          await this.verifyShort(v);

        }catch(error){

          this.errored=true;
          this.$q.notify({
            message: error.message,
            color: 'negative'
          });

        }


      },

      countDownTimer() {

        if(this.countDown > 0) {
          setTimeout(() => {

            this.countDown -= 1;
            this.countDownTimer();

          }, 1000);
        }

      },

      async resendVerificationCode(){
        // verify with short token
        try{

          const action = 'resendVerifySignup';
          const value = { email:this.user.email };
          await this.verify({ action, value }, {});

          this.$q.notify({
            message: `Use the new code we've sent to: ${this.$lget(this.user, 'phone', )['number']['national']}`,
            color: 'positive'
          });

          this.verifyCode='';
          this.disabled=true;
          this.countDown=30;
          this.countDownTimer();
          this.$refs['codeInput'].values = this.$refs['codeInput'].values.map(() => '');

        }
        catch(error){

          this.errored=true;
          this.$q.notify({
            message: `VERIFICATION ERROR: ${error.message}`,
            color: 'negative'
          });

        }
      }
    }
  };
</script>
<style scoped lang="scss">

  .code-verifier{
    font-family: "Avenir", Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 10px;
    min-height: 45vh;
  }
</style>
