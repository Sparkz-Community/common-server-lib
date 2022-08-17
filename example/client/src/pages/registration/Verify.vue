<template>
  <div class=" column justify-center items-center" v-if="user">

   <div class="column items-center justify-center q-gutter-md" v-if="user.verifyWith">
     <p class="text-h6 text-center">Verify Your Registration</p>
     <div  class="text-caption text-bold text-grey-8 q-mb-none text-center">
     <div v-if="user.verifyWith.includes('sms')" class="column q-gutter-none">
     <span >We sent you a code on:</span>
     <span class="text-primary">{{$lget(user,'phone').number.national}}</span>
   </div>

       <span v-else>Find your verification link at: </span>
     </div>

     <div style="max-width: 550px">

      <code-verifier :user="user" :fields="6" :fieldWidth="35" v-if="user.verifyWith.includes('sms')"/>

       <div v-else class="flex justify-center items-center ">

         <q-chip
           clickable
           text-color="white"
           class="glossy cursor-pointer text-light-blue"
           color="white"
           icon="email"
           @click="routeToMail"
         >
           Email:{{user.email}}
         </q-chip>
       </div>

     </div>

   </div>
  </div>
</template>

<script>
  import CodeVerifier from 'components/common/molecules/CodeVerifier';


  export default {
    name: 'verify',
    components: {CodeVerifier,},

    data:function(){
      return {
        user:null
      };
    },

    created: async function () {

      const user= await this.$q.sessionStorage.getItem('registered-credentials');
      const {token}=await this.$route.query;
      if(token){
        await this.verifyLong(token);
        await this.$q.sessionStorage.set('registered-credentials',null);
      }
      if(user){
        this.user=user;
      }else{

        await this.$router.push('/login');
      }
    },

    methods: {
      verifyLong: async function (token) {
        // verify with email
        try{
          const action = 'verifySignupLong';
          const value = token;
          await this.verify({ action, value }, {});
          this.$q.notify({
            message: 'Congrats! Your Tally registration is now verified. Login!',
            color: 'positive'
          });
        }
        catch (error){
          this.$q.notify({
            message: `VERIFICATION ERROR: ${error.message}`,
            color: 'negative'
          });
        }
      },

      routeToMail(){
        window.open(`https://${this.user.email}`,'__blank');
      },

    }

  };
</script>
