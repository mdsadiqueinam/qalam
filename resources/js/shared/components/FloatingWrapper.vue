<script setup>
import { ref, computed } from 'vue'
import { useFloating, offset, flip, shift, autoUpdate } from '@floating-ui/vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  placement: {
    type: String,
    default: 'bottom',
  },
  offsetValue: {
    type: Number,
    default: 4,
  },
})

const reference = ref(null)
const floating = ref(null)

const { floatingStyles } = useFloating(reference, floating, {
  placement: computed(() => props.placement),
  middleware: [offset(props.offsetValue), flip(), shift({ padding: 8 })],
  whileElementsMounted: autoUpdate,
})
</script>

<template>
  <div class="relative inline-block">
    <div ref="reference">
      <slot name="trigger" />
    </div>
    <Teleport to="body">
      <div
        v-if="show"
        ref="floating"
        :style="floatingStyles"
        class="z-50"
      >
        <slot name="content" />
      </div>
    </Teleport>
  </div>
</template>
