<template>
    <nav class="w-full p-3 container mx-auto">
        <div class="relative flex items-center">
            <a href="/" class="mr-auto flex-none font-bold">
                stryfly
            </a>
            <ul class="list-none flex gap-6 text-left items-center">
                <li>
                    <NuxtLink to="/">Home</NuxtLink>
                </li>
                <li>
                    <NuxtLink to="/about">About</NuxtLink>
                </li>
                <Menu as="div" v-if="props.user" v-slot="{ open }" class="relative inline-block text-left">
                <div>
                    <MenuButton
                    class="inline-flex w-full justify-center"
                    >
                        <span class="sr-only">Open menu</span>
                        <img v-if="profile?.avatar_url" :src="profile?.avatar_url" :title="profile?.username" class="w-8 h-8 rounded-full"/>
                        <div v-else class="w-8 h-8 rounded-full bg-gray-300 text-black grid place-items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="gray" class="w-6 h-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </div>
                    </MenuButton>
                </div>

                <transition
                    enter-active-class="transition duration-100 ease-out"
                    enter-from-class="transform scale-95 opacity-0"
                    enter-to-class="transform scale-100 opacity-100"
                    leave-active-class="transition duration-75 ease-in"
                    leave-from-class="transform scale-100 opacity-100"
                    leave-to-class="transform scale-95 opacity-0"
                >
                    <MenuItems
                    v-show="open"
                    class="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                    >
                    <div v-if="profile?.username" class="px-1 py-1">
                        <MenuItem v-slot="{ active }">
                        <div
                            :class="[
                            'text-gray-900',
                            'group flex w-full items-center rounded-md px-2 py-2 text-sm',
                            ]"
                        >
                        {{ profile?.username }}
                        </div>
                        </MenuItem>
                    </div>
                    <div class="px-1 py-1">
                        <MenuItem v-slot="{ active }">
                        <NuxtLink to="/profile"
                            :class="[
                            active ? 'bg-blue-500 text-white' : 'text-gray-900',
                            'group flex w-full items-center rounded-md px-2 py-2 text-sm',
                            ]"
                        >
                            Profile
                        </NuxtLink>
                        </MenuItem>

                    </div>
                    <div class="px-1 py-1">
                        <MenuItem v-slot="{ active }">
                        <button
                            @click="$emit('signOut')"
                            :class="[
                            active ? 'bg-blue-500 text-white' : 'text-gray-900',
                            'group flex w-full items-center rounded-md px-2 py-2 text-sm',
                            ]"
                        >
                            Sign Out
                        </button>
                        </MenuItem>
                    </div>
                    </MenuItems>
                </transition>
                </Menu>
                <NuxtLink v-if="!props.user" class="justify-self-end" to="/auth">Log in</NuxtLink>
            </ul>
        </div>
        </nav>
</template>

<script lang="ts" setup>
    import type { User } from '@supabase/supabase-js'
    import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'

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

</script>

<style>
    .is-active {
        display: block;
    }
</style>