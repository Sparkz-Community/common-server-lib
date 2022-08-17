<template>
  <q-page>

    <q-btn color="accent" @click="addCardDio = true" label="Add New Card" />

    <q-dialog v-model="addCardDio">
      <q-card>
        <CreditCardForm @input="addNewCard" />
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>

  import CreditCardForm from 'components/common/molecules/CreditCardForm';

  export default {
    name: 'ProfileWallet',
    components: {
      CreditCardForm
    },
    data() {
      return {
        addCardDio: false
      };
    },
    methods: {
      addNewCard(card) {
        console.log(card);
      }
    }
  };
</script>

<style scoped lang="scss">
  .profile-wallet {

  }
</style>
