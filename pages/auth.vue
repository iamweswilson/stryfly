<template>
    <div>
        <div class="min-h-screen flex justify-center">
        <div class="cont mt-28">
            <AuthForm @submit="onSubmit"/>
            <div class="w-full flex justify-center py-6">
                <Spinner v-if="loading"/>
            </div>
        </div>
    </div>
    </div>
</template>

<script lang="ts" setup>
    import AuthForm from '~~/components/AuthForm.vue'
    import type { User, Subscription } from '@supabase/supabase-js'

    const user = ref<User|null>(null)
    const { $supabase, $alert } = useNuxtApp()
    const router = useRouter()
    const loading = ref<boolean>(false)

    const onSubmit = async (creds: { email: string, password: string }, isSignIn: boolean) => {
        try {
            loading.value = true
            const { user, error } = isSignIn ? await $supabase.auth.signIn(creds) : await $supabase.auth.signUp(creds)
            loading.value = false
            if(error) {
                return $alert({ type: 'error', text: error.message })
            }
            if(isSignIn) {
                $alert({ type: 'success', text: 'Logging you in...' })
                return router.push('/profile')
            } else {
                return $alert({ type: 'success', text: 'Please check your inbox to activate your account!' })
            }
        } catch(err) {}
    }
    onMounted(() => {
        user.value = $supabase.auth.user()
        if(user.value) {
            router.replace('/')
        }
    })
</script>
<style>
    .cont {
        @apply w-10/12 sm:w-3/4 md:w-9/12 lg:w-7/12 xl:w-5/12 
    }
</style>
