<template>
  <elFrame :src="modelerApi + modelId" />
</template>
<script>
import { mapGetters } from 'vuex'
import elFrame from '@/components/Iframe'
export default {
  name: 'Modeler',
  components: { elFrame },
  computed: {
    ...mapGetters([
      'modelerApi'
    ])
  },
  created() {
    this.modelId = this.$route.params.modelId
    this.buf = this.$store.state.settings.showFooter
    this.$store.state.settings.showFooter = false
  },
  destroyed() {
    this.$store.state.settings.showFooter = this.buf
  }
}
</script>
