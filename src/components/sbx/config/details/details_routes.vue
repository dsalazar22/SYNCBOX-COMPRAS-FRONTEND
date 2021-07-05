<template>
    <div>

        <h4 class="font-weight-bold py-3 mb-0">{{title}}</h4>
            <hr class="border-light container-m--x mt-0 mb-4">
            <div class="w-100 text-right">
        </div>

        <!-- <route-detail :id_route="route_id"></route-detail> -->
        <route-detail :route_product_id="route_product_id" :id_route="route_id" :is_product="true" 
        :id_product="product_selected_id" v-on:refresh="tableRutasProcesos = $event"> </route-detail>
    </div>
</template>


<script>
import route from './route_controller'

export default {
    watch: {
        '$route.params.id':function(value){
            this.route_id = value
        },

        '$route.params.routeproductid':function(value){
            this.route_product_id = value
        },
        
        '$route.params.productid':function(value){
            this.product_selected_id = value
        }
    },
    components: {
        'route-detail': route,
    },
    computed:{

    },
    data() {
        return {
            title:'Administración y Edición de Rutas',
            route_id:0,
            route_product_id:0,
            product_selected_id:0,
            tableRutasProcesos:[]

        }
    },
    methods: {
    },
    created(){
        this.route_id = parseInt(this.$route.params['id'])
        this.route_product_id = parseInt(this.$route.params['routeproductid'])
        this.product_selected_id = parseInt(this.$route.params['productid'])
    }
}
</script>
