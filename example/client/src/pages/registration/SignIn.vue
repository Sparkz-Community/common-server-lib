<template>
  <div class=" column justify-center items-center" style="min-height:70vh">

   <div class="column items-center justify-center q-gutter-md" >
     <o-auth-links social-box-size="sm"  :social-links="socialLinks" :off="OAuthOff"></o-auth-links>
     <p class="text-h6 text-center text-bold text-grey-8 q-mb-none text-center">Else Sign in with your Credentials</p>
       <login-form/>

   </div>
  </div>
</template>

<script>
  import OAuthLinks from '@ionrev/quasar-app-extension-ir-auth-management-client/src/components/OAuthLinks/OAuthLinks';
  import LoginForm from 'components/registration/LoginForm';

  export default {
    name: 'sign-in',
    components: {OAuthLinks,LoginForm},
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
