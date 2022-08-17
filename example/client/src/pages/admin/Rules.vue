<template>
  <q-page class="q-pa-lg">
    <div>
      <q-btn icon="fas fa-arrow-left" color="primary" @click="$router.push({path: '/admin/permissions', query: {page: 'permissions'}})"></q-btn>
    </div>
    <div>
      <RuleTable></RuleTable>
    </div>
  </q-page>
</template>

<script>
  import RuleTable from 'components/admin/Roles/RuleTable';
  export default {
    name: 'Rules',
    components: {RuleTable}
  };
</script>

<style scoped>

</style>
