<template>
    <nav class="w-full p-3 container mx-auto">
        <div class="relative flex items-center">
            <a href="/" class="mr-auto flex-none font-bold">
                stryfly
            </a>
            <ul class="list-none flex gap-6 text-left items-center">
                <li>
                    <router-link to="/about">About</router-link>
                </li>
                <li v-if="props.user" class="self-center" ref="dropdownMenu">
                    <span class="dropdown">
                        <div class="dropdown-trigger">
                            <button aria-haspopup="true" aria-controls="dropdown-menu" @click.prevent="toggle">
                                <span class="sr-only">Open menu</span>
                                <img :src="profile?.avatar_url" :title="profile?.username" class="w-8 h-8 rounded-full"/>
                            </button>
                        </div>
                        <div class="dropdown-menu hidden" :class="{'is-active': open}">
                            <div class="absolute right-0 z-10 w-44 bg-white rounded shadow dark:bg-gray-700 dark:divide-gray-600 py-3 text-sm text-gray-900 dark:text-white">
                                <div class="pb-2 px-4 border-b">{{ profile?.username }}</div>
                                <router-link to="/profile" class="dropdown-item block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Profile</router-link>
                                <a @click="$emit('signOut')" href="#" class="block pt-2 px-4 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Sign out</a>
                            </div>
                        </div>
                    </span>
                </li>
                <NuxtLink v-if="!props.user" class="justify-self-end" to="/auth">Log in</NuxtLink>
            </ul>
        </div>
        </nav>
</template>

<script lang="ts" setup>
    import type { User } from '@supabase/supabase-js'

    type NavProps = {
        user: User
    }

    const props = defineProps<NavProps>()

        console.log(props)

    type NavEvts = {
        (e: 'signOut'): void
    }

    const emit = defineEmits<NavEvts>()

    // profile attrs
    type ProfileAttrs = {
        username?: string,
        avatar_url?:string,
    }
    const GET_COL_SET = `username, avatar_url`
    const PROFILE_INITIAL_STATE: ProfileAttrs = {
        username: '',
        avatar_url: ''
    }

    const { $supabase, $alert } = useNuxtApp()
    // Supabase CRUD methods for profile
    const getUserProfile = (id: string) => $supabase.from('profiles').select(GET_COL_SET).eq('id', id).single()
    const getCurrentUserProfile = () => getUserProfile($supabase.auth.user()!.id)

    const getAvatar = async(url: string) => {
        const { data, error: downloadError } = await $supabase.storage.from('avatars').download(url)
        if (downloadError) { throw downloadError }

        return URL.createObjectURL(data as Blob)
    }

    const loading = ref<boolean>(true)
    const profile = reactive<ProfileAttrs>(PROFILE_INITIAL_STATE)

    async function getProfile() {
        try {
            let { data: { username, avatar_url } , error } = await getCurrentUserProfile()
            avatar_url = await getAvatar(avatar_url)
            // update
            profile.username = username
            profile.avatar_url = avatar_url
            loading.value = false
            if(error) {
                return $alert({ type: 'error', text: error.message })
            }
        } catch(error) {}
    }

    onMounted(getProfile)

</script>

<script lang="ts">
    export default {
      data() {
        return {
          open: false
        };
      },

      created() {
        window.addEventListener("click", this.close);
      },

      beforeDestroy() {
        window.removeEventListener("click", this.close);
      },

      methods: {
        toggle() {
          this.open = !this.open;
        },

        close(e) {
          if (!this.$el.contains(e.target)) {
            this.open = false;
          }
        }
      },

      watch: {
        '$route' () {
        // close the dropdown on new view
        this.open = false
        }
    }
    }
</script>

<style>
    .is-active {
        display: block;
    }
</style>