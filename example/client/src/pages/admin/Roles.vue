<template>
  <q-page class="pageContainer justify-center">
    <div class="rolesContainer q-ma-lg">
      <div>
        <div class="sourceSansProBold" style="display: flex; justify-content: space-between;">
          <div>Roles Management</div>
          <div>
            <q-btn color="primary" outline rounded icon="fas fa-user-tag"
                   @click="addRole = true" class="q-mx-sm text-weight-bold">&nbsp;&nbsp;Add Role
            </q-btn>
            <q-btn color="primary" outline rounded icon="fas fa-tags"
                   @click="$router.push({path: 'permissions/abilities', query: {page: 'permissions'}})" class="q-mx-sm text-weight-bold">&nbsp; &nbsp;Manage Abilities
            </q-btn>
            <q-btn color="primary" outline rounded icon="fas fa-balance-scale"
                   @click="$router.push({path: 'permissions/rules', query: {page: 'permissions'}})" class="q-mx-sm text-weight-bold">&nbsp; &nbsp;Manage Rules
            </q-btn>
            <q-btn color="blue" flat icon="help" class="q-mx-xs" @click="rolesDialog = !rolesDialog">
            </q-btn>
          </div>
        </div>

        <RolesTable @deleteRole="deleteRole" @editRole="editRole" ref="roleTable"></RolesTable>
      </div>
      <q-dialog v-model="addRole" class="sourceSansProBold" @hide="closeRoleForm">
        <add-role-form :editing-role="roleToEdit" @refreshTable="refreshRoleTable"></add-role-form>
      </q-dialog>
    </div>
    <q-dialog v-model="rolesDialog">
      <q-card style="min-width: 300px;overflow: hidden;">
        <q-btn icon="cancel" color="negative" round flat size="lg" @click="rolesDialog = false;" class="closeButton"></q-btn>
        <q-card-section class="flex flex-center">
          <div class="sourceSansProBold">Roles Help</div>
           <q-icon color="primary" name="help" size="md"></q-icon>
        </q-card-section>
        <q-card-section class="sourceSansProBold q-ma-xs" style="font-size: 1.3em;font-weight: 400;">
          Roles are defined to give some users different permissions than others. Abilities are groupings of rules and are assigned to roles. An example of an ability would be "Todos Management", that would consist of rules regarding Todos about read/write permissions. You then might assign that ability to a role named "Todos Manager", which would then give users with that role read/write permissions on todos.
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
  import RolesTable from 'components/admin/RolesTable';
  import AddRoleForm from 'components/admin/Roles/addRoleForm';
  import {models} from 'feathers-vuex';

  export default {
    name: 'Roles',
    components: { AddRoleForm, RolesTable},
    data() {
      return {
        addRole: false,
        roleToEdit: null,
        rolesDialog: false,
      };
    },
    methods: {
      refreshRoleTable(){
        this.$refs.roleTable.irRolesRolesRefresh();
        this.closeRoleForm();
      },
      closeRoleForm(){
        this.addRole = false;
        this.roleToEdit = new models.api.IrRolesRoles().clone();
      },
      deleteRole(event) {
        this.$q.dialog({
          title: `Delete Role(${event.name})`,
          message: 'Are you sure you want to delete this role? This action is irreversible and could effect current users.',
          ok: {
            push: true,
            color: 'negative',
            label: 'Delete'
          },
          cancel: {
            push: true,
            color: 'primary'
          },
        }).onOk(() => {
          this.$isLoading(true);
          event.remove().then(() => {
            this.$isLoading(false);
          }).catch((err) => {
            console.log(err);
            this.$isLoading(false);
            this.$q.notify({
              type: 'negative',
              message: `Something went wrong deleting role ${event.name}, please refresh and try again.`
            });
          });
        }).onCancel(() => {

        });
      },
      editRole(event){
        this.roleToEdit = event;
        this.addRole = true;
      },

    },
  };
</script>

<style scoped>

  .sourceSansProBold {
    font-family: 'Source Sans Pro', sans-serif;
    font-weight: 600;
    font-size: 1.7em;
  }

  .rolesContainer {
    height: 95%;
    width: 95%;
  }

  .pageContainer {
    height: 100%;
    width: 100vw;
    overflow: hidden;
  }

  .closeButton {
    position: absolute;
    top: -10px;
    right: -10px;
    z-index: 1;
  }
</style>
