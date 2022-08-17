<template>
  <q-page class="flex flex-center">
<!--    <message-dialogue></message-dialogue>-->

    <div style="height: 80vh; width: 80vh; border: 3px solid #FD746C; position: relative;">
      <drag-and-resize :w="300" :h="300" :parent="true" :min-width="200" :min-height="200">
        <h2>This is some text content...</h2>
      </drag-and-resize>
    </div>
    <div style="padding: 50px">
      <h3><b>camelCase:</b> {{ $changeCase.camelCase(str) }}</h3>
      <h3><b>pascalCase:</b> {{ $changeCase.pascalCase(str) }}</h3>
      <h3><b>lowerCase:</b> {{ $changeCase.lowerCase(str) }}</h3>
      <h3><b>upperCase:</b> {{ $changeCase.upperCase(str) }}</h3>
      <h3><b>titleCase:</b> {{ $changeCase.titleCase(str) }}</h3>
      <h3><b>spongeCase:</b> {{ $changeCase.spongeCase(str) }}</h3>
    </div>

<!--    <img alt="Quasar logo"-->
<!--         src="~assets/quasar-logo-full.svg">-->
  </q-page>
</template>

<script>
  // import MessageDialogue from '../components/MessageDialogue.vue';
  import DragAndResize from 'components/drag-and-resize.vue';


  export default {
    name: 'PageIndex',
    components: {
      // MessageDialogue,
      DragAndResize,
    },
    data() {
      return {
        str: 'Hello World!',
      };
    },
  };
</script>
