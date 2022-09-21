<template>
    <div class="w-full">
        <section class="mt-12 p-2 flex flex-col">
                <em v-if="loading">loading profile details...</em>
                <div v-else class="w-full">
                    <div class="mt-2 text-center flex justify-between items-start">
                        <section class="justify-self-start">
                            <img v-if="profile?.avatar_url" :src="profile?.avatar_url" :title="profile?.username" class="w-32 h-32 rounded-full"/>
                            <button v-else @click="isModalOpened = true"  class="w-32 h-32 rounded-full bg-gray-300 text-black grid place-items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1" stroke="gray" class="w-24 h-24">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </button>
                            {{avatarLoading ? 'Updating..' : ''}}
                        </section>
                        <section class="justify-self-end">
                            <button class="btn btn-primary" @click="isModalOpened = true">Edit profile</button>
                        </section>
                    </div>
                    <div class="profile-detail my-8 flex flex-col place-items-start">
                        <label class="text-gray-400 text-sm mb-2">Username</label>
                        <h2 v-if="profile?.username" class="text-4xl mb-4">{{ profile?.username }}</h2>
                        <button v-else @click="isModalOpened = true" class="text-base mb-4">Add a username</button>
                        <label class="text-gray-400 text-sm mb-2">Bio</label>
                        <span v-if="profile?.bio" class="inline-block text-white">{{ profile?.bio }}</span>
                        <button v-else @click="isModalOpened = true"  class="text-base mb-4">Add a bio</button>
                    </div>
                    <div class="mt-12 pt-6 border-t border-gray-400">
                        <label class="text-gray-400 text-sm mb-2">Website</label>
                        <a v-if="profile?.website" :href="'//' + profile?.website" class="mb-8 flex gap-2 items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="gray" class="w-4 h-4">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
                                </svg>
                            {{ profile?.website }}
                        </a>
                        <button v-else @click="isModalOpened = true"  class="text-base mb-4">Add a website</button>
                    </div>
                </div>
                <Dialog
                    v-if="isModalOpened"
                    :isOpen="isModalOpened"
                    title="Update Profile"
                    actionLbl="Update Profile"
                    :acting="isProfileUpdating"
                    @confirm="handleConfirm"
                    @cancel="isModalOpened = false"
                >
                    <div class="form mt-6">
                        <div className="form-controls">
                            <Avatar v-if="profile?.avatar_url" class="w-32" :src="profile?.avatar_url" :title="profile?.username" :loading="avatarLoading" @change="updAvatar" />
                            <div v-else class="w-32 h-32 rounded-full bg-gray-300 text-black grid place-items-center mb-8 relative">
                                <span class="absolute p-4 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black rounded-full z-10 opacity-40 hover:opacity-80 cursor-pointer">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="white" class="w-4 h-4">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                    </svg>
                                </span>
                            </div>
                            <div class="form-control">
                                <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400">
                                    <span class="label-text">Username</span>
                                </label>
                                <input type="text" name="username" class="input input-bordered" required placeholder="Your username" minlength={3} :value="fields.username" @input="handleChange" />
                            </div>
                            <div class="form-control">
                                <label class="label">
                                    <span class="label-text">Website</span>
                                </label>
                                <input type="text" name="website" class="input input-bordered" placeholder="Your website" minlength={6} :value="fields.website"  @input="handleChange" />
                            </div>
                            <div class="form-control">
                                <label class="label">
                                    <span class="label-text">Bio</span>
                                </label>
                                <textarea type="text" name="bio" class="input input-bordered h-24" rows="4" placeholder="Your bio" minlength={6} :value="fields.bio"  @input="handleChange"></textarea>
                            </div>
                        </div>
                    </div>
                </Dialog>
        </section>
    </div>
</template>
<script lang="ts" setup>
    definePageMeta({
        layout: "protected",
    });
    // profile attrs
    type ProfileAttrs = {
        username?: string,
        website?: string,
        bio?: string,
        avatar_url?:string,
    }
    const GET_COL_SET = `username, website, bio, avatar_url`
    const PROFILE_INITIAL_STATE: ProfileAttrs = {
        username: '',
        website: '',
        bio: '',
        avatar_url: ''
    }

    const { $supabase, $alert } = useNuxtApp()
    // Supabase CRUD methods for profile
    const getUserProfile = (id: string) => $supabase.from('profiles').select(GET_COL_SET).eq('id', id).single()
    const getCurrentUserProfile = () => getUserProfile($supabase.auth.user()!.id)
    const updateCurrentUserProfile = (attrs: ProfileAttrs) => $supabase.from('profiles').upsert({ ...attrs, id: $supabase.auth.user()!.id, updated_at: new Date()})
    // Supabase Storage methods for profile avatar
    const updCurrUserAvatar = async (file: File) => {
        const user = $supabase.auth.user()
        const fileExt = file.name.split('.').pop()
        const fileName = `${user?.id}${Math.random()}.${fileExt}`
        const filePath = `${fileName}`

        let { error: uploadError } = await $supabase.storage.from('avatars').upload(filePath, file)
        if (uploadError) { throw uploadError }

        return await $supabase.from('profiles').upsert({ id: user?.id, avatar_url: filePath })
    }

    const getAvatar = async(url: string) => {
        const { data, error: downloadError } = await $supabase.storage.from('avatars').download(url)
        if (downloadError) { throw downloadError }

        return URL.createObjectURL(data as Blob)
    }

    const loading = ref<boolean>(true)
    const avatarLoading = ref<boolean>(false)
    const isProfileUpdating = ref<boolean>(false)
    const isModalOpened = ref<boolean>(false)
    const profile = reactive<ProfileAttrs>(PROFILE_INITIAL_STATE)
    const fields = reactive<Omit<ProfileAttrs, 'avatar_url'>>({ username: '', website: '', bio: ''})
        // @ts-ignore
    const handleChange = (e: Event) => fields[e.currentTarget.name] = e.currentTarget.value
    const handleConfirm = () => {
        updProfile(fields)
    };

    async function updAvatar(event: any) {
        const { target } = event
        try {
            if (!target!.files || target.files.length == 0) {
                throw 'You must select an image to upload.'
            }
            avatarLoading.value = true
            // @ts-ignore
            let { data: [ { avatar_url } ], error: updateError } = await updCurrUserAvatar(target.files[0])
            if (updateError) {
                throw updateError
            }
            avatar_url = await getAvatar(avatar_url)
            profile.avatar_url = avatar_url
        } catch (error: any) {
            $alert({ type: 'error', text: error.message })
        } finally {
            avatarLoading.value = false
        }
    }

    async function getProfile() {
        try {
            loading.value = true
            let { data: { username, website, bio, avatar_url } , error } = await getCurrentUserProfile()
            if (error) {
                $alert({ type: 'default', text: 'First login? You wanna update your profile details? 🙂' })
            }
            avatar_url = await getAvatar(avatar_url)
            // update
            profile.username = username
            profile.website = website
            profile.bio = bio
            profile.avatar_url = avatar_url

            fields.username = username
            fields.website = website
            fields.bio = bio
        } catch (error: any) {
            if(error instanceof TypeError) {
                $alert({ type: 'error', text: error.message })
            }
        } finally {
            loading.value = false
        }
    }

    async function updProfile({ username, website, bio }: Omit<ProfileAttrs, 'avatar_url'>) {
        try {
            isProfileUpdating.value = true
            let { data: [ updates ], error: updateError } = await updateCurrentUserProfile({ username, website, bio })
            if (updateError) {
                throw updateError
            }
            profile.username = updates.username
            profile.website = updates.website
            profile.bio = updates.bio
        } catch (error: any) {
            $alert({ type: 'error', text: error.message })
        } finally {
            isModalOpened.value = false
            isProfileUpdating.value = false
        }
    }

    onMounted(getProfile)
</script>
<script lang="ts">
    export default {
        layout: false
    }
</script>
