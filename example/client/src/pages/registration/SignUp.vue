<template>
  <div class=" column justify-center items-center" style="min-height:70vh">

   <div class="column items-center justify-center q-gutter-md" >
     <p class="text-h6 text-center">Let's get you registered!</p>
     <o-auth-links social-box-size="sm"  :social-links="socialLinks" :off="OAuthOff"></o-auth-links>
     <p class="text-caption text-bold text-grey-8 q-mb-none text-center">Otherwise create your account</p>
       <signup-form/>

   </div>
  </div>
</template>

<script>
  import OAuthLinks from '@ionrev/quasar-app-extension-ir-auth-management-client/src/components/OAuthLinks/OAuthLinks';
  import SignupForm from 'components/registration/SignupForm';

  export default {
    name: 'sign-up',
    components: {SignupForm, OAuthLinks},
    data:function(){
      return {
        OAuthOff:false,
        socialLinks: [
          {
            name: 'Google',
            icon: 'mdi-google',
            img: 'https://rayraysolarstatic.s3-us-west-1.amazonaws.com/Google__G__Logo.svg.png',
            color: 'red',
            link: `${process.env.VUE_APP_FEATHERS_URL}/oauth/google`
          },
          {
            name: 'Facebook',
            icon: 'mdi-facebook',
            color: '#2090E1',
            link: `${process.env.VUE_APP_FEATHERS_URL}/oauth/facebook`
          },
        ]
      };
    }
  };
</script>
