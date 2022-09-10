<template>
    <nav class="w-full p-3 container mx-auto">
        <div class="relative flex items-center">
            <a href="/" class="mr-auto flex-none font-bold">
                stryfly
            </a>
            <ul class="list-none flex gap-4 text-left">
                <li>
                    {{props.user && props.user.email}} <button v-if="props.user" @click="$emit('signOut')">(Sign Out)</button>
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

</script>
