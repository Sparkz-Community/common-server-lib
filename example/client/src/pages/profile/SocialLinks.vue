<template>
  <q-page>
    <div class="social-links">
      <div class="header">Social Links</div>
      <div v-if="$lget(user, 'socialLinks', []).length">
        <div class="my-links-wrapper">
          <div class="my-link" v-for="(link, idx) of user.socialLinks" :key="idx" :style="{backgroundColor: $q.dark.mode ? $lightenHex('--q-color-dark', 35) : ''}">
            <q-icon :name="link.icon" size="lg" :style="{color: link.color ? link.color : ''}" :color="link.color ? '' : 'primary'" class="my-icon"/>
            <div>{{ link.type }}</div>
            <a target="_blank" :href="link.url" :style="{color: $q.dark.mode ? '#cbcbcb' : ''}">{{ link.name ? link.name : link.url }}</a>
            <q-icon @click="removeSocialLink(link)" name="far fa-trash-alt" color="negative" size="sm" class="cursor-pointer">
              <q-tooltip>Remove link</q-tooltip>
            </q-icon>
          </div>
        </div>
      </div>
      <div v-else>
        <div class="no-links">No links added</div>
      </div>
      <div class="add-link">
        <div class="icon" @click="addingNewLink = true">
          <q-icon name="fas fa-plus" color="primary"/>
        </div>
        <transition name="drop-down">
          <div v-if="addingNewLink" class="new-link-form-wrapper">
              <div class="new-link-form">
                <div class="icon-picker-wrapper">
                  <q-select v-model="newSocialLink.icon" style="width: 20%;" class="icon-picker" :options="socialLinkIcons" label="Select Icon">
                    <template v-slot:option="scope">
                      <div v-bind="scope.itemProps" v-on="scope.itemEvents" class="select-option-icon">
                        <q-icon size="sm" color="secondary" :name="scope.opt" />
                      </div>
                    </template>

                    <template v-slot:selected>
                      <q-icon style="margin-top: 3px;" :name="newSocialLink.icon" color="secondary" size="md"/>
                    </template>
                  </q-select>
                  <q-icon @click="colorDio = true" :color="newSocialLink.color.length ? '' : 'accent'" :style="{color: newSocialLink.color.length ? newSocialLink.color : ''}" class="cursor-pointer" name="fas fa-palette" size="sm" />
                </div>
                <q-input v-model="newSocialLink.type" style="width: 20%;" label="Name (github, instagram, etc...)" />
                <q-input v-model="newSocialLink.name" style="width: 20%;" label="Label (optional)" />
                <q-input hint="Prepend with http or https if linking to external site" v-model="newSocialLink.url" style="width: 20%;" label="Url" />
              </div>
              <div class="buttons">
                <q-btn @click="stopEdit" label="Cancel" color="negative" />
                <q-btn @click="addSocialLink" class="q-mx-lg" label="Save" color="primary" />
              </div>
          </div>
        </transition>
      </div>
    </div>

    <q-dialog v-model="colorDio">
      <q-color v-model="newSocialLink.color" />
    </q-dialog>
  </q-page>
</template>

<script>

  import {mapGetters, mapActions} from 'vuex';

  export default {
    name: 'SocialLinks',
    data(){
      return {
        newSocialLink: {
          icon: '',
          type: '',
          name: '',
          url: '',
          color: ''
        },
        addingNewLink: false,
        colorDio: false
      };
    },
    computed: {
      ...mapGetters('auth', {
        user: 'user'
      }),
      socialLinkIcons(){
        return [
          'fab fa-instagram', 'fab fa-instagram-square', 'fab fa-twitter',
          'fab fa-twitter-square', 'fab fa-facebook-f', 'fab fa-facebook',
          'fab fa-facebook-square', 'fab fa-github', 'fab fa-github-square',
          'fab fa-github-alt', 'fab fa-reddit', 'fab fa-reddit-square',
          'fab fa-snapchat', 'fab fa-snapchat-square'
        ];
      }
    },
    methods: {
      ...mapActions('users', {
        patchUser: 'patch'
      }),
      stopEdit(){
        this.addingNewLink = false;
        this.newSocialLink = {icon: '', type: '', name: '', url: '', color: ''};
      },
      addSocialLink() {
        let {icon, url} = this.newSocialLink;
        if(!icon || !url) {
          this.$q.notify({
            message: 'Must Have Selected Icon And Url'
          });
          return;
        }
        this.patchUser([this.user._id, {
          $push: {
            socialLinks: this.newSocialLink
          }
        }]).then(() => {
          this.$q.notify({
            message: 'Added Social Link',
            color: 'positive'
          });
          this.stopEdit();
        }).catch(() => {
          this.$q.notify({
            message: 'Something went wrong, try refreshing the page',
            color: 'negative'
          });
        });
      },
      removeSocialLink(link) {
        this.patchUser([this.user._id, {
          $pull: {
            socialLinks: link
          }
        }]);
      }
    }
  };
</script>

<style scoped lang="scss">
  .social-links {
    .header {
      text-align: center;
      font-size: 2.1em;
      margin-top: 25px;
    }

    .no-links {
      text-align: center;
      margin-top: 35px;
      font-size: 1.4em;
      font-weight: 300;
    }

    .icon {
      text-align: center;
      margin: 50px auto 0 auto;
      font-size: 2.2em;
      cursor: pointer;
      transition: 0.2s all;
      width: 95%;
      border-radius: 10px;
      padding: 5px;
    }
    .icon:hover {
      background-color: #f5f5f535;
    }
  }

  .new-link-form-wrapper {
    .new-link-form {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 70px;
      padding: 0 30px;
    }

    .buttons {
      display: flex;
      justify-content: flex-end;
      margin-top: 60px;
    }
  }

  .select-option-icon {
    padding: 10px;
    cursor: pointer;
    transition: 0.2s all;
  }

  .icon-picker-wrapper {
    display: flex;
    align-items: center;
    width: 20%;
    .icon-picker {
      flex: .9;
      margin-right: 12px;
    }
  }

  .my-links-wrapper {
    //text-align: center;
    width: 88%;
    margin: 100px auto 10px auto;

    .my-link {
      display: grid;
      align-items: center;
      margin: 25px 0;
      grid-template-columns: 1fr 1fr 1fr 1fr;
      transition: 0.2s all;
      padding: 10px;
      border-radius: 5px;

      div {
        //margin: 0 50px;
        font-size: 1.2em;
      }
    }

    .my-link:hover {
      box-shadow: 2px 2px 3px 2px rgba(0, 0, 0, 0.1);
      cursor: pointer;
    }
  }

  .select-option-icon:hover {
    background-color: #e8eaef;
  }

  .drop-down-enter-active {
    transition: all .3s ease;
  }
  .drop-down-leave-active {
    transition: all .2s ease-in-out;
  }
  .drop-down-enter, .drop-down-leave-to {
    transform: translateY(100px);
    margin-top: -20vh;
    opacity: 0;
  }

</style>
