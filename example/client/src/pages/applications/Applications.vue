<template>
  <div class="Applications">
    <applications-table-template
      v-if="$authUser"
      :applications="applications"
      :open-add-form="openAddForm"
      @revoke-key="revokeKey"
      @card-clicked="handleShowAppSettings"
    >
      <template #top-left-controls>
        <q-btn  flat color="primary"  @click="openNewApplication">
          <q-icon left  name="fas fa-plus" />
          <div class="text-subtitle1">New Application</div>
        </q-btn>
      </template>
      <template #form>

        <create-application-form v-if="!secretKey&&!showAppSettings" @add-application="createApp">
          <template #navigation-controls>
            <q-btn  flat color="primary"  @click="closeApplication">
              <q-icon left  name="fas fa-caret-left" />
              <div class="text-subtitle1">Back</div>
            </q-btn>
          </template>
          <template #submit-btn>
            <q-btn color="primary" glossy label="Create App" type='submit' :disable="seamless"/>
          </template>
        </create-application-form>
        <renderless-with-click-outside v-else-if="showAppSettings" >
          <div style="min-height:85vh;" class="bg-secondary text-light">
            <div class="row q-gutter-xl items-center">
              <q-btn  flat   @click="closeApplication">
                <q-icon left  name="fas fa-caret-left" />
                <div class="text-subtitle1">Back</div>
              </q-btn>
              <p class="text-h4 q-mb-none ">{{ $lget(newApplication,'name') }} Dashboard</p>

            </div>

          </div>
        </renderless-with-click-outside>
      </template>
      <template v-if="applications.length<1" #no-data>
        <div  class="column q-pa-lg">
          <h6>You Have No Apps Yet</h6>
          <div class="text-body1 q-my-none self-center q-mx-auto" style="max-width: 600px; white-space: pre;">
            Add (+) a new Application and grab a onetime Secret Key that you can use to get access
            to all Tally goodies in your own application.

            Make sure you keep this secret from everyone else. Once exposed, even to your most trusted comrades,
            you can not guarantee how safe your application users will be.

            In the case that some malicious person compromises your key. We advise that
            you grab yourself a new one and use that in your integration.
          </div>
        </div>
      </template>
    </applications-table-template>
    <q-dialog v-model="seamless" seamless position="top" persistent transition-show="scale" transition-hide="scale">
      <q-card style="width: 350px" >
        <q-linear-progress :value="1" color="primary" />

        <q-card-section class="row items-center no-wrap">
          <div>
            <div class="text-weight-bold">Secret Key</div>
            <div class="text-grey">{{secretKey}}</div>
          </div>

          <q-space />
          <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">
            <strong>Tooltip</strong> on <em>top</em>
            (<q-icon name="keyboard_arrow_up"/>)
          </q-tooltip>
          <q-btn
            flat
            @click="copied=true"
            icon="fas fa-copy"
            color="primary"
            v-clipboard="secretKey"
            :label="copied?'copied':'copy'"
          >
          </q-btn>
          <q-btn flat round icon="close" v-close-popup @click="clearForm"/>
        </q-card-section>
        <q-card-section>
          <span class="text-caption">Copy and keep it secure. Once you close this form, you won't see it ever again!</span>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>

  import ApplicationsTableTemplate from 'pages/applications/ApplicationsTableTemplate';
  import { models } from 'feathers-vuex';
  import {mapMutations, mapState} from 'vuex';
  import CreateApplicationForm from 'pages/applications/CreateApplication';
  import RenderlessWithClickOutside from 'components/common/atoms/RenderlessWithClickOutside.vue';

  const { Applications } = models.api;


  export default {
    name: 'applications',
    components: {
      RenderlessWithClickOutside,
      CreateApplicationForm,
      ApplicationsTableTemplate
    },
    data () {
      return {
        openAddForm:false,
        showAppSettings:false,
        seamless:false,
        copied:false,
        secretKey:undefined,
        applications: [],
        newApplication: new Applications ().clone(),
      };
    },
    mounted() {
      this.updateApplications();
      Applications.on('created',this.updateApplications);
      Applications.on('patched',this.updateApplications);
    },

    computed: {
      ...mapState([
        'showApplication',
        'activeContent'
      ]),
      paymentMethods() {
        return this.$lget(this.newApplication,'_fastjoin.appsTransactionsDefaultBankAccount._fastjoin.paymentMethods',[]);
      },
      activePaymentMethod(){
        return this.paymentMethods.find(pm=>this.$lget(pm,'_id')===this.$lget(this.newApplication,'appsActivePaymentMethod'));
      }
    },
    watch: {
      showApplication:{
        immediate : true,
        deep: true,
        handler : function(newVal){
          this.openAddForm=!!newVal;
        }
      }
    },
    methods: {
      ...mapMutations(['openApplication','closeApplication','setActiveContent']),
      setApplication(application){
        this.newApplication=application;
        this.openApplication(application);
        this.setActiveContent('application');
      },
      handleShowAppSettings(app){
        this.newApplication =  new Applications ().clone(app);
        this.showAppSettings=true;
        this.openApplication(app);
      },

      openNewApplication(){
        this.newApplication = new Applications ().clone();
        this.openApplication(this.newApplication);
        this.showAppSettings=false;
      },

      async createApp(formData){
        try{
          if(formData.name){
            const newApplication = new Applications(formData);
            const {oneTimeSecretKey} = await newApplication.save();
            this.secretKey=oneTimeSecretKey;
            this.seamless=true;
          }
        }catch(e){
          this.$errNotify((this.$lget(e,'message')));
        }
      },

      clearForm(){
        this.newApplication= new models.api.Applications().clone();
        this.secretKey=undefined;
        this.seamless = false;
        this.closeApplication();
      },

      async  revokeKey(applicationID){
        try {
          const result = await this.$feathersClient.service('new-application-secret').create({
            applicationID
          });

          this.secretKey=this.$lget(result,'secretKey');
          this.seamless=true;
        }catch (e){
          this.$errNotify(this.$lget(e,'message'));
        }
      },

      updateApplications: async function () {

        const {data} = await Applications.find({
          query:{
            createdBy:this.$authUser._id
          }
        });

        this.applications= data;
        // this.openAddForm = total === 0;
      },
      async makeActive(appsActivePaymentMethod){
        try{
          this.$lset(this.newApplication,'appsActivePaymentMethod',appsActivePaymentMethod);
          await this.newApplication.save();
        }catch(err){
          console.log(err);
        }
      },

    }

  };
</script>
