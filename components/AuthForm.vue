<template>
    <form @submit.prevent="submit">
        <fieldset>
            <legend>{{ currActionLabel }}</legend>
            <!--<button v-if="useGithubAuth" class="flex-1 bg-gray-200 text-black py-3 rounded w-full text-center" @click="$supabase.auth.signIn({ provider: 'github'})">
                {{ currActionLabel }} with <strong>Github</strong>
            </button>-->
            <Sep v-if="useGithubAuth" />
            <div class="field">
                <label for="email">Email</label>
                <input class="p-4 text-black" id="email" name="email" type="email" v-model="form.email" placeholder="your email" />
            </div>
            <div class="field">
                <label for="password">Password</label>
                <input class="p-4 text-black" id="password" name="password" type="password" v-model="form.password" placeholder="Your password" />
            </div>
            <div class="field poles-apart">
                <Button type="submit"
                    class="inline-flex justify-center rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none"
                >
                    {{currActionLabel}}
                </Button>

                <div class="text-right text-black">
                    <small class="block">{{ isSignIn ? `not a member?` : `already a member?` }}</small>
                    <a href="" title="Sign Up" class="underline" @click.prevent="switchAuthMode()">{{ isSignIn ? `Sign Up!` : `Sign In` }}</a>
                </div>
            </div>
        </fieldset>
    </form>
</template>

<script lang="ts" setup>
    import type { UserCredentials } from '@supabase/supabase-js'
    import { ref, reactive, watch } from 'vue'

    type AuthMode = 'Sign In' | 'Sign Up'
    const isSignIn = ref<boolean>(true)
    const currActionLabel = ref<AuthMode>('Sign In')
    const form = reactive<UserCredentials>({
        email: '',
        password: ''
    })
    const { $supabase, $alert } = useNuxtApp()

    const { resetOnSubmit, useGithubAuth } = withDefaults(defineProps<{
        resetOnSubmit?: boolean
        useGithubAuth?: boolean
    }>(), {
        resetOnSubmit: true,
        useGithubAuth: true
    })
    const emit = defineEmits<{
        (e: 'submit', creds: UserCredentials, isSignIn: boolean): void
    }>()

    const switchAuthMode = () => isSignIn.value = !isSignIn.value
    watch(isSignIn, (isSignIn) =>  (currActionLabel.value = isSignIn ? `Sign In` : `Sign Up`))

    const submit = () => {
        // BYOV - Bring your own validation!
        if(!form.email || !form.password) {
            $alert({ type: 'error', text: 'Please fill-in both the <strong>email</strong> and the <strong>password</strong>!'})
            return
        }
        if(!form.email.match(/^\S+@\S+$/)) {
            $alert({ type: 'error', text: 'Please fill-in a valid <strong>email</strong> address!'})
            return
        }
        if(form.password.length <= 6) {
            $alert({ type: 'error', text: '<strong>Password</strong> must be at-least 6 chars!'})
            return
        }
        const { email, password } = form
        emit('submit', { email, password } , isSignIn.value)
        if(resetOnSubmit) {
            form.email = ''
            form.password = ''
        }
    }
</script>

<style>
    form {
        @apply w-full bg-gray-50 px-10 py-8 rounded-md shadow-md
    }
    legend {
        @apply text-gray-600 pb-4 text-4xl mb-4
    }
    .field {
        @apply w-full mb-6
    }
    label {
        @apply block uppercase font-semibold text-gray-600 text-base
    }
    input, textarea {
        @apply w-full font-normal border p-4 text-black focus:border-blue-500 rounded-md focus:outline-none
    }
    .poles-apart {
        @apply flex justify-between items-center
    }
</style>
