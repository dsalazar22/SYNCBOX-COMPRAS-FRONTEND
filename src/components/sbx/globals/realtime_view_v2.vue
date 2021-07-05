<template>
    <div>
        <div class="d-flex justify-content-between">
            <div>
                <h4 class="font-weight-bold mt-2 mb-0">
                    {{text_name}}
                    <!-- <div class="text-muted text-tiny mt-1"><small class="font-weight-normal">Today is Tuesday, 8 February 2018</small></div> -->
                </h4>
                <b-breadcrumb :items="items3" class="mt-0"/>
            </div>
        </div>
        <div v-if="$route.params['wscode'] != null"> <wsdetails></wsdetails> </div>
        <div v-else-if="$route.params['idgroup'] != null"> <group></group> </div>
        <div v-else> <floor></floor> </div>
    </div>
</template>

<script>

import floor from './plants_view2'
import group from './group_details_v2'
import wsdetails from './workstation_details'


export default {
    name: 'dashboard-4',
    
    components:{
        floor,
        group,
        wsdetails
    },

    metaInfo: {
        title: 'Información Tiempo Real'
    },

    data: () => ({
        items3: [{ text: 'Compañía', to: '/' }],
        text_name:'Compañía'
    }),

    methods: {
        breadinfo : function(){
            this.items3 = [{ text: 'Compañía', to: '/' }]
            let count =0
            this.text_name = 'Compañía'
            let link = '/info'
            let last = false

            for (const item in this.$route.params) {
                count=count+1

                if(count ==1){
                    this.text_name = this.$route.params[item]
                    last = true
                }

                if(count ==2) {
                    count = 0
                    link += '/'+this.text_name+'/' + this.$route.params[item]
                    this.items3.push({text: this.text_name, to: link}) 
                }
            }
            
            if( count % 2 == 1){
                this.items3.push({text: this.text_name, to: link+'/'+this.text_name}) 
            }
        }
    },

    created: function() {
    },

    mounted () {
        this.breadinfo()
    },
    beforeDestroy () {
    },

    watch: {
        $route(){
            this.breadinfo()
        }
    },
}
</script>
