<template>
<!-- :fields="columns" -->
    <div>
        <h4 class="font-weight-bold py-3 mb-0"> TAC de Producción </h4>
        <wsdrump :fromRealTime="false" code_workstation=""></wsdrump>
    </div>
</template>
<script>
import wsdrump from './wsdrump.vue'
export default {
    metaInfo: {
       title: 'TAC de Producción'
    },
    components: {
        wsdrump
    },
}
</script>
