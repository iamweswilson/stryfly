<template>
    <div class="w-full">
        <section class="mt-12 p-2 flex flex-col">
                <em v-if="loading">loading profile details...</em>
                <div v-else class="w-full">
                    <div class="mt-2 text-center flex justify-between items-start">
                        <section class="justify-self-start">
                            <img :src="profile?.avatar_url" :title="profile?.username" class="w-32 h-32 rounded-full"/>
                            {{avatarLoading ? 'Updating..' : ''}}
                        </section>
                        <section class="justify-self-end">
                            <button class="btn btn-primary" @click="isModalOpened = true">Edit profile</button>
                        </section>
                    </div>
                    <div class="profile-detail my-4 flex flex-col place-items-start">
                        <h2 v-if="profile?.username" class="text-4xl mb-4">{{ profile?.username }}</h2>
                        <span class="inline-block text-white">{{ profile?.bio }}</span>
                    </div>
                    <div class="mt-12 pt-6 border-t border-gray-400">
                        <a v-if="profile?.website" :href="'//' + profile?.website" class="mb-8 flex gap-2 items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="gray" class="w-4 h-4">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
                                </svg>
                            {{ profile?.website }}
                        </a>
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
                            <Avatar class="w-32" :src="profile?.avatar_url" :title="profile?.username" :loading="avatarLoading" @change="updAvatar" />
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
