<template>
    <div class="avatar relative flex flex-col place-items-center">
            <label class="mb-8 w-full h-full mask mask-circle shadow-lg bg-gray-200" for="single">
                <img :src="props.src" :alt="props.title" />
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
