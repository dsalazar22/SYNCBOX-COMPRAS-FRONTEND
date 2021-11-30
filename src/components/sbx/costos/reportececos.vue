<template>
    <div>
        <h4 class="font-weight-bold py-3 mb-4">Informe  <span class="font-weight-light">CeCos por Actividad</span></h4>
        <div v-for="(item ,index)  in (infocecos)" :key="index" >
            <div class="text-center">
                <h4 style="margin-bottom:5px"> {{item.cc_code}} | {{item.cc_desc}} </h4>
                <b> HM: </b>{{numberWithCommas(item.hm)}} | <b> HH: </b>{{numberWithCommas(item.hh)}} | <b> Kw: </b>{{numberWithCommas(item.kw)}} | <b> Kcal: </b>{{numberWithCommas(item.Kcal)}}
                <div>
                    <b> %HM: </b>{{numberWithCommas(item.percentaje_hm)}} | <b> %HH: </b>{{numberWithCommas(item.percentaje_hh)}} | <b> %Kw: </b>{{numberWithCommas(item.percentaje_kw)}} | <b> %Kcal: </b>{{numberWithCommas(item.percentaje_kcal)}}
                </div>
            </div>
            
            <b-table small show-empty stacked="md" :items="item.array_to_json" >
                <template v-slot:cell(primaria)="row">
                    {{ numberWithCommas(row.item.primaria) }}
                </template>
                <template v-slot:cell(distribucion)="row">
                    {{ numberWithCommas(row.item.distribucion) }}
                </template>
            </b-table>
        </div>
    </div>
</template>

<script>
    import { infocosts } from "@/components/i40/js/costs";

    export default {
    
        metaInfo: {
            title: 'Presupuesto Centro de Costos'
        },
       
        data: () => ({

           infocecos : []

        }),
        
        methods:{
            showData: function(){
                infocosts.getCeCosPorActividad().then(data =>{
                    if (data.data === ""){
                        this.tblOriginal=[]
                        this.totalRows=0
                    }else{
                        this.infocecos=data.data
                        this.totalRows = this.tblOriginal.length
                    }
                })
            },
            numberWithCommas(num) {
                if(num == null)
                    num=0
                num = num.toFixed(2)
                var num_parts = num.toString().split(".");
                num_parts[0] = num_parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                return num_parts.join(".");
                // return x //.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
            },
        },

        created(){
            this.showData()
        },
    }
</script>