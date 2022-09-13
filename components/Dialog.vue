<template>

  </template>

  <script lang="ts" setup>
    import {
      Dialog,
      DialogOverlay,
      DialogTitle,
      DialogDescription,
      TransitionRoot
    } from "@headlessui/vue"

    type DialogProps = {
        isOpen?: boolean
        title: string
        desc?: string
        actionLbl?: string
        acting?: boolean
        onAction?: () => void
    }

    type DialogEvts = {
        (e: 'confirm'): void
        (e: 'cancel'): void
    }

    const props = withDefaults(defineProps<DialogProps>(), {
        title: '',
        desc: '',
        isOpen: false,
        actionLbl: 'Okay',
        acting: false,
        onAction: () => {}
    })

    const emit = defineEmits<DialogEvts>()

    const isOpen = ref(props.isOpen)

    function setIsOpen(value: boolean) {
        isOpen.value = value
    }
  </script>
