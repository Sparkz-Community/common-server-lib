<template>
  <div>
    <slot v-if="openAddForm" name="form">

    </slot>

    <q-table
      v-else
      flat
      :filter="filter"
      hide-header
      v-bind="$attrs"
      v-on="$listeners"
    >

      <template v-slot:top-left>
        <div class="row q-gutter-sm q-mx-md items-center justify-center">

            <slot name="title">
              <div  class="row q-gutter-sm items-center justify-center text-h3">
                {{title}}
              </div>
            </slot>

          <slot name="top-left-controls">

          </slot>
        </div>
      </template>

      <template v-slot:top-right>
        <div class="row q-gutter-sm q-mx-md items-center justify-center">

          <q-input   dense debounce="300" v-model="filter" placeholder="Search">
            <template v-slot:append>
              <q-icon name="search"/>
            </template>
          </q-input>
          <slot name="top-right-controls">


          </slot>
        </div>
      </template>




      <template  is="one-column-section" v-for="(_, slot) of $scopedSlots" v-slot:[slot]="scope">
        <slot :name="slot" v-bind="scope" />
      </template>


    </q-table>

  </div>
</template>

<script>

  export default {
    name: 'table-template',

    props:{
      title:{
        type:String,
        required: false
      },
      openAddForm:{
        type:Boolean,
        defaultValue: true,
        required: true,
      }
    },

    data () {
      return {
        showRow:false,
        filter:'',
      };
    },

  };
</script>
<style lang="scss" scoped>

</style>
