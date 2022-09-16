<template>
    <nav class="w-full p-3 container mx-auto">
        <div class="relative flex items-center">
            <a href="/" class="mr-auto flex-none font-bold">
                stryfly
            </a>
            <ul class="list-none flex gap-4 text-left">
                <li>
                    <img :src="profile?.avatar_url" :title="profile?.username" class="w-8 h-8 rounded-full"/>
                </li>
                <li>
                    <button v-if="props.user" @click="$emit('signOut')">(Sign Out)</button>
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
            loading.value = true
            let { data: { username, avatar_url } , error } = await getCurrentUserProfile()
            if (error) {
                $alert({ type: 'default', text: 'First login? You wanna update your profile details? 🙂' })
            }
            avatar_url = await getAvatar(avatar_url)
            // update
            profile.username = username
            profile.avatar_url = avatar_url
        } catch (error: any) {
            if(error instanceof TypeError) {
                $alert({ type: 'default', text: 'First login? You wanna update your profile details? 🙂' })
            } else if(error.message === 'The resource was not found') {
                $alert({ type: 'default', text: 'You know? You can click on the randomly generated avatar to update your profile picture.' })
            } else {
                $alert({ type: 'error', text: error.message })
            }
        } finally {
            loading.value = false
        }
    }

    onMounted(getProfile)

</script>
