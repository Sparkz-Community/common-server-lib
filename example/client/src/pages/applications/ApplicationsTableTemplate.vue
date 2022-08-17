<template>
  <div>

    <table-template
      title="Applications"
      grid
      :data="applications"
      class="bg-grey-1"
      :open-add-form="openAddForm"
      @setOpenForm="$emit('setOpenBankForm',true)"
      v-bind="$attrs"
      v-on="$listeners"
      :pagination="{rowsPerPage:6}"
      :rows-per-page-options="[6,12,18,24,36,42,48,0]"
    >

      <template #item="props">
        <q-card class="q-my-md  q-pa-lg q-ma-lg" flat bordered style="cursor: pointer;" @click="$emit('card-clicked',props.row)">
          <q-card-section horizontal>

            <div class="column q-gutter-lg justify-center items-center">

              <q-icon
                size="14rem"
                :name="props.row.avatar?`img:${$lget(props.row,'avatar.raw.file')}`:'fab fa-adn'"
                color="primary"
              />
              <h1 class="text-h4 text-center">{{ props.row.name }}</h1>
            </div>
            <q-card-actions vertical class="justify-around q-px-md">

              <q-btn  round color="primary" icon="fas fa-key" @click="$emit('revoke-key',props.row._id)">
                <q-tooltip content-class="bg-indigo" :offset="[10, 10]">
                  Get New Secret Key
                </q-tooltip>
              </q-btn>

            </q-card-actions>
          </q-card-section>
        </q-card>
      </template>

      <template  v-for="(_, slot) of $scopedSlots" v-slot:[slot]="scope">
        <slot :name="slot" v-bind="scope" />
      </template>

    </table-template>

  </div>
</template>

<script>
  import TableTemplate from 'components/common/molecules/tables/TableTemplate';


  export default {
    name: 'applications-table-template',

    components: {TableTemplate},

    props:{

      openAddForm:{
        type:Boolean,
        defaultValue: true,
      },

      applications:{
        type:Array,
        required:true
      }
    },


  };
</script>
<style lang="scss" scoped>

</style>
