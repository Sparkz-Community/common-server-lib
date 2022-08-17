<template>
  <q-page class="q-pa-xl">
    <div class="flex justify-between">
      <q-btn icon="fas fa-arrow-left" color="primary" @click="$router.push({path: '/admin/permissions', query: {page: 'permissions'}})"></q-btn>
      <q-btn outline rounded color="primary" label="Create Ability" icon="add" @click="abilityForm = !abilityForm"></q-btn>
    </div>
    <div>
      <ability-table @editAbility="editAbility" ref="abilityTable"></ability-table>
    </div>
    <q-dialog v-model="abilityForm" @hide="refreshAbility">
      <add-ability-form @back="abilityForm = false" :editing-ability="abilityToEdit"
      @refreshTable="refreshAbilityTable"></add-ability-form>
    </q-dialog>
  </q-page>
</template>

<script>
  import addAbilityForm from 'components/admin/Roles/addAbilityForm';
  import AbilityTable from 'components/admin/Roles/AbilityTable';
  import {models} from 'feathers-vuex';

  export default {
    name: 'Abilities',
    components: {
      addAbilityForm,
      AbilityTable
    },
    data(){
      return {
        abilityToEdit: null,
        abilityForm: false,
      };
    },
    methods: {
      refreshAbility(){
        this.abilityToEdit = new models.api.IrRolesAbilities().clone();
      },
      editAbility(event){
        this.abilityToEdit = event;
        this.abilityForm = true;
      },
      refreshAbilityTable(){
        this.abilityForm = false;
        this.$refs.abilityTable.irRolesAbilitiesRefresh();
      },
    }
  };
</script>

<style scoped>

</style>
