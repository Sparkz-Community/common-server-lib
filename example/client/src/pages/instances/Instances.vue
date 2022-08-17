<template>
  <q-page>
    <div>
      <div class="header">Instances</div>
      <instances-table-template
        v-if="$authUser"
        :instances="instances"
        :open-add-form="openAddForm"
        @configure-instances="openInstancePanel"
      >
        <template #top-left-controls>
          <q-btn  flat color="primary" @click="openInstanceForm">
            <q-icon left  name="fas fa-plus"/>
            <div class="text-subtitle1">New Instance</div>
          </q-btn>
        </template>
        <template #form>

          <renderless-with-click-outside v-if="showInstanceSettings" >

            <domains-table-template
                              grid
                              :domains="domains"
                              class="bg-grey-1"
                              :open-add-form="openDomainsForm"
                              v-bind="$attrs"
                              v-on="$listeners"
                              :pagination="{rowsPerPage:6}"
                              :rows-per-page-options="[6,12,18,24,36,42,48,0]"
              >
                <template #top-left-controls>
                  <div class="row q-gutter-md">

                  <q-btn  flat color="primary"  @click="openAddForm=false">
                    <q-icon left  name="fas fa-caret-left" />
                    <div class="text-subtitle1">Back</div>
                  </q-btn>
                    <h4>{{`Domains using the ${$lget(instanceToConfigure,'name')} instance`}}</h4>
                  <q-btn  flat color="primary" @click="openDomainsForm=true">
                    <q-icon left  name="fas fa-plus" />
                    <div class="text-subtitle1">New Domain</div>
                  </q-btn>
                  </div>
                </template>
                <template #form>
              <create-domains-form @add-domain="createDomain">
                <template #navigation-controls>
                  <q-btn  flat color="primary"  @click="openDomainsForm=false">
                    <q-icon left  name="fas fa-caret-left" />
                    <div class="text-subtitle1">Back</div>
                  </q-btn>
                </template>
                <template #submit-btn>
                  <q-btn color="primary" glossy label="Create Domain" type='submit'/>
                </template>
              </create-domains-form>
                </template>
              </domains-table-template>
          </renderless-with-click-outside>
          <!--create form space-->
          <create-instances-form @add-instance="createInstance" v-else>
            <template #navigation-controls>
              <q-btn  flat color="primary"  @click="closeInstanceForm">
                <q-icon left  name="fas fa-caret-left" />
                <div class="text-subtitle1">Back</div>
              </q-btn>
            </template>
            <template #submit-btn>
              <q-btn color="primary" glossy label="Create Instance" type='submit'/>
            </template>
          </create-instances-form>
        </template>
        <template v-if="instances.length<1" #no-data>
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
      </instances-table-template>

    </div>
  </q-page>
</template>

<script>

  import {models} from 'feathers-vuex';
  import InstancesTableTemplate from 'pages/instances/InstanceTableTemplate';
  import DomainsTableTemplate from 'pages/domains/DomainsTableTemplate';
  const { Instances,Domains} = models.api;
  import RenderlessWithClickOutside from 'components/common/atoms/RenderlessWithClickOutside.vue';
  import CreateDomainsForm from 'pages/domains/CreateDomains';
  import CreateInstancesForm from 'pages/instances/CreateInstances';
  export default {
    name: 'instances',
    data(){
      return {
        instances: [],
        openAddForm:false,
        instanceToConfigure:null,
        openDomainsForm:false,

      };
    },
    components: {
      CreateInstancesForm,
      CreateDomainsForm,
      InstancesTableTemplate,
      RenderlessWithClickOutside,
      DomainsTableTemplate
    },
    mounted() {
      this.updateInstances();
      Instances.on('created',this.updateInstances);
      Instances.on('patched',this.updateInstances);
    },
    computed: {
      showInstanceSettings(){
        return !!this.instanceToConfigure;
      },
      domains(){
        return this.$lget(this.instanceToConfigure,'_fastjoin.domains',[]);
      }
    },
    methods: {
      updateInstances: async function () {
        const {data} = await Instances.find({
          query:{

          }
        });
        console.log(data);
        this.instances= data;
      },
      openInstancePanel(instance){
        this.instanceToConfigure=instance;
        this.openAddForm=true;
      },
      async createDomain(data){
        try{
          if(data.name){
            const newDomain = new Domains({...data,instance:this.instanceToConfigure._id});
            const res = await newDomain.save();
            this.instanceToConfigure=this.$lget(res,'_fastjoin.controller._fastjoin.instance');
            this.openDomainsForm=false;
          }
        }catch(e){
          this.$errNotify((this.$lget(e,'message')));
        }
      },
      openInstanceForm(){
        this.openAddForm=true;
        this.instanceToConfigure=undefined;

      },
      closeInstanceForm(){
        this.openAddForm=false;
        this.instanceToConfigure=undefined;
      },
      async createInstance(data){
        try{
          if(data.name){
            const newInstance = new Instances({...data});
            await newInstance.save();
            this.closeInstanceForm();
          }
        }catch(e){
          this.$errNotify((this.$lget(e,'message')));
        }
      }
    }
  };
</script>

<style scoped lang="scss">
  .social-links {
    .header {
      text-align: center;
      font-size: 2.1em;
      margin-top: 25px;
    }

    .no-links {
      text-align: center;
      margin-top: 35px;
      font-size: 1.4em;
      font-weight: 300;
    }

    .icon {
      text-align: center;
      margin: 50px auto 0 auto;
      font-size: 2.2em;
      cursor: pointer;
      transition: 0.2s all;
      width: 95%;
      border-radius: 10px;
      padding: 5px;
    }
    .icon:hover {
      background-color: #f5f5f535;
    }
  }

  .new-link-form-wrapper {
    .new-link-form {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 70px;
      padding: 0 30px;
    }

    .buttons {
      display: flex;
      justify-content: flex-end;
      margin-top: 60px;
    }
  }

  .select-option-icon {
    padding: 10px;
    cursor: pointer;
    transition: 0.2s all;
  }

  .icon-picker-wrapper {
    display: flex;
    align-items: center;
    width: 20%;
    .icon-picker {
      flex: .9;
      margin-right: 12px;
    }
  }

  .my-links-wrapper {
    //text-align: center;
    width: 88%;
    margin: 100px auto 10px auto;

    .my-link {
      display: grid;
      align-items: center;
      margin: 25px 0;
      grid-template-columns: 1fr 1fr 1fr 1fr;
      transition: 0.2s all;
      padding: 10px;
      border-radius: 5px;

      div {
        //margin: 0 50px;
        font-size: 1.2em;
      }
    }

    .my-link:hover {
      box-shadow: 2px 2px 3px 2px rgba(0, 0, 0, 0.1);
      cursor: pointer;
    }
  }

  .select-option-icon:hover {
    background-color: #e8eaef;
  }

  .drop-down-enter-active {
    transition: all .3s ease;
  }
  .drop-down-leave-active {
    transition: all .2s ease-in-out;
  }
  .drop-down-enter, .drop-down-leave-to {
    transform: translateY(100px);
    margin-top: -20vh;
    opacity: 0;
  }
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

  }
</style>
