<template>
<!-- :fields="columns" -->
    <div>
        <h4 class="font-weight-bold py-3 mb-0"> Tambor de Ordenes de Producción </h4>
        <drump></drump>
    </div>
</template>
<script>
import drump from './drump.vue'
export default {
    metaInfo: {
       title: 'Tambor de Ordenes de Producción'
    },
    components: {
        drump
    },
}
</script>
