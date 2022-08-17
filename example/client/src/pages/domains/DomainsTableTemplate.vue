<template>
  <div>

    <table-template
      grid
      :data="domains"
      class="bg-grey-1"
      :open-add-form="openAddForm"
      v-bind="$attrs"
      v-on="$listeners"
      :pagination="{rowsPerPage:6}"
      :rows-per-page-options="[6,12,18,24,36,42,48,0]"
    >

      <template #item="props">
        <q-card class="q-my-md  q-pa-lg q-ma-lg" flat bordered style="cursor: pointer;" @click="$emit('card-clicked',props.row)">
          <q-card-section>

            <div class="column q-gutter-lg justify-center items-center">
              <h1 class="text-h4 text-center">{{ `${props.row.name} instance`.toUpperCase() }}</h1>
            </div>
            <q-card-actions vertical class="justify-around q-px-md">

              <q-btn  round color="primary" icon="fas fa-cog" @click="$emit('configure-instances',props.row)">
                <q-tooltip content-class="bg-indigo" :offset="[10, 10]">
                 {{`Configure ${props.row.name} Instance`.toUpperCase()}}
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
    name: 'domains-table-template',

    components: {TableTemplate},

    props:{

      openAddForm:{
        type:Boolean,
        defaultValue: true,
      },

      domains:{
        type:Array,
        required:true
      }
    },

  };

</script>
<style lang="scss" scoped>

</style>
