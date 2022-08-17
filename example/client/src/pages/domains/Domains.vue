<template>
    <div class="domains">
      <div class="header">Domains</div>
      <domains-table-template
        v-if="$authUser"
        grid
        :domains="domains"
        :open-add-form="openDomainsForm"
      >
        <template #top-left-controls>
          <div class="row q-gutter-md">
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
      <pre>
        {{appDomain}}
      </pre>
    </div>
</template>

<script>
  import DomainsTableTemplate from 'pages/domains/DomainsTableTemplate';
  import CreateDomainsForm from 'pages/domains/CreateDomains';
  // import {splitUrl} from 'src/utils/splitUrl';
  import {models} from 'feathers-vuex';
  const {Domains} = models.api;
  export default {
    name: 'domains',
    components:{DomainsTableTemplate,CreateDomainsForm},
    data(){
      return {
        domains:[],
        openDomainsForm:false,
        appDomain:undefined,
      };
    },
    async mounted() {
      // await this.getAppDomain();
    },
    computed:{
      // appUrlObject(){
      //   const currentUrl = window.location.origin;
      //   return splitUrl(currentUrl);
      // },
    },
    methods:{
      async createDomain(data){
        try{
          if(data.name){
            const newDomain = new Domains({...data});
            const res = await newDomain.save();
            console.log(res);
            // this.instanceToConfigure=this.$lget(res,'_fastjoin.instance');
            this.openDomainsForm=false;
          }
        }catch(e){
          this.$errNotify((this.$lget(e,'message')));
        }
      },
      // async getAppDomain(){
      //   const fqdn = this.$lget(this.appUrlObject,'fqdn');
      //
      //   const domainsResponse = await Domains.find({
      //     $client:{
      //       headers:{
      //         origin:'http:localhost:8080'
      //       }
      //     },
      //     query:{
      //       $or:[
      //         {name: fqdn},
      //         {name: this.$lget(this.appUrlObject, 'domain')},
      //       ]
      //     }
      //   });
      //   const total = this.$lget(domainsResponse,'total');
      //   console.log(total);
      //   if(total>1){
      //     this.appDomain = this.$lget(domainsResponse,'data',[]).find(({name})=>name===fqdn);
      //   }else{
      //     this.appDomain = this.$lget(domainsResponse,'data',[]).shift();
      //   }
      // },
      // async getAppDomain(){
      //   const fqdn = this.$lget(this.appUrlObject,'fqdn');
      //
      //   const domainsResponse = await Domains.find({
      //     $client:{
      //       headers:{
      //         origin:'http:localhost:8080'
      //       }
      //     },
      //     query:{
      //       $or:[
      //         {name: fqdn},
      //         {name: this.$lget(this.appUrlObject, 'domain')},
      //       ]
      //     }
      //   });
      //   const total = this.$lget(domainsResponse,'total');
      //   console.log(total);
      //   if(total>1){
      //     this.appDomain = this.$lget(domainsResponse,'data',[]).find(({name})=>name===fqdn);
      //   }else{
      //     this.appDomain = this.$lget(domainsResponse,'data',[]).shift();
      //   }
      // }
    }
  };
</script>
