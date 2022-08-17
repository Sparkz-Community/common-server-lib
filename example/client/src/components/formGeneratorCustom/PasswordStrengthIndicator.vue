<template>

  <q-slide-transition>
    <div v-if="$attrs['attrs']['password']" v-bind="$attrs['div-attrs']">
      <div class="flex" style="align-items: center;" >
        <div class="q-mt-sm"
             style=" font-weight: bold; display: flex; align-items: center; height: 100%; width: 40vw;">{{$attrs['attrs']['label']}}:
        </div>
        <div class="flex q-mt-sm" style="width: 50vw; justify-content: space-between">
          <div class="strength"
               :style="{
                backgroundColor: passStrength === 'Weak' ? 'rgba(220,20,60,.8)': 'white',
                fontSize: passStrength === 'Weak' ? '1rem' : 'inherit',
                fontWeight: passStrength === 'Weak' ? 'bold' : 'inherit',
                color: passStrength === 'Weak' ? 'inherit' : 'grey',
              }">Weak
          </div>
          <div class="strength"
               :style="{
                backgroundColor: passStrength === 'Medium' ? 'rgba(255,140,0,.5)': 'white',
                fontSize: passStrength === 'Medium' ? '1rem' : 'inherit',
                fontWeight: passStrength === 'Medium' ? 'bold' : 'inherit',
                color: passStrength === 'Medium' ? 'inherit' : 'grey',
              }">Medium
          </div>
          <div class="strength"
               :style="{
                backgroundColor: passStrength === 'Strong' ? 'rgba(0,255,0,.5)': 'white',
                fontSize: passStrength === 'Strong' ? '1rem' : 'inherit',
                fontWeight: passStrength === 'Strong' ? 'bold' : 'inherit',
                color: passStrength === 'Strong' ? 'inherit' : 'grey',
              }">Strong
          </div>
        </div>
      </div>
      <q-linear-progress v-bind="$attrs['attrs']" :value="passStrengthValue" :color="linerProgressColor" />
    </div>
  </q-slide-transition>
</template>

<script>


  export default {
    name: 'password-strength-indicator',
    inheritAttrs: false,
    props: {
      path: {
        required: false
      },
    },
    data() {
      return {};
    },
    watch: {
      $attrs: {
        immediate: true,
        deep: true,
        handler(newVal) {
          // attrs defaults
          this.$lset(newVal, 'attrs.value', this.$lget(newVal, 'attrs.value', 'label'));
          this.$lset(newVal, 'attrs.password', this.$lget(newVal, 'attrs.password', ));
          // div-attrs defaults
          this.$lset(newVal, 'div-attrs.class', this.$lget(newVal, 'div-attrs.class', 'col-12 col-sm-6'));
        }
      },
    },
    computed: {
      passStrength() {

        return this.$passwordStrength(this.$attrs['attrs']['password']);
      },
      passStrengthValue() {
        if (this.passStrength === 'Weak') {
          return .33333;
        } else if (this.passStrength === 'Medium') {
          return .66666;
        } else if (this.passStrength === 'Strong') {
          return 1;
        } else {
          return 0;
        }
      },
      linerProgressColor() {
        if (this.passStrength === 'Weak') {
          return 'red';
        } else if (this.passStrength === 'Medium') {
          return 'orange';
        } else if (this.passStrength === 'Strong') {
          return 'green';
        } else {
          return 'white';
        }
      },
    },
  };
</script>

<style scoped>

</style>
