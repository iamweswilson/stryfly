<template>
    <div class="avatar relative flex flex-col place-items-center">
            <label class="mb-8 w-full h-full  shadow-lg rounded-full overflow-hidden bg-gray-200 relative border-4 border-white/50" for="single">
                <span class="absolute p-4 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black rounded-full z-10 opacity-70 hover:opacity-100 cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="white" class="w-4 h-4">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                    </svg>
                </span>
                <img :src="props.src" :alt="props.title"/>
            </label>
            <input
                class="sr-only"
                type="file"
                accept="image/*"
                @change="$emit('change', $event)"
                id="single"
                :disabled="props.loading"
            />
    </div>
</template>
<script lang="ts" setup>

    type AvatarProps = {
        loading?: boolean
        src: string
        title: string
    }

    const props = withDefaults(defineProps<AvatarProps>(), {
        loading: false,
        src: '',
        title: '',
    })

    type AvatarEvts = {
        (e: 'change', event: any): void
    }

    const emit = defineEmits<AvatarEvts>()

</script>
