var jsPDF = require('jspdf');
require('jspdf-autotable');

function UrlExists(url) { var http = new XMLHttpRequest(); http.open('HEAD', url, false); http.send(); return http.status!=404; }


function CrearPDF(titlePDF, infoFecha, columns,items, path_img, path_sbx_img){
    // Only pt supported (not mm or in)

    var img = new Image();
    img.src = path_img;
    


               
    var doc = new jsPDF('p', 'pt');

    var pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();
        
    
    doc.page = 1;
    var totalPagesExp = "{total_pages_count_string}";

    doc.autoTable(columns, items, {
        //startY: 110,
        styles: { fontSize: 7},
        columnStyles: {
            id: {fontSize: 7}
        },
        margin: {top: 110},
        
        addPageContent: function(data) {
            var str = "SyncBox i4.0 | Página " + data.pageCount;
            // Total page number plugin only available in jspdf v1.0+
            if (typeof doc.putTotalPages === 'function') {
                str = str + " de " + totalPagesExp;
            }
            
            doc.setFontSize(10);
            doc.text(str, 420, 20);

            try{
                doc.addImage(img, 'JPG', 50, 40, 80, 60)
            }catch{
                img.src = path_sbx_img
                doc.addImage(img, 'PNG', 60, 40, 140, 50)
            }
            

            doc.setFontSize(18);
            doc.text('DIVISIÓN TÉCNICA', 280, 45);
            doc.setFontSize(14);
            doc.setTextColor(100);
            doc.text('DEPARTAMENTO DE PRODUCCIÓN', 240, 60);
            doc.setFontSize(12);
            doc.setTextColor(100);

            doc.text('----------------------------------------------------------------------', 220, 70);
            doc.setFontSize(11);
            doc.setTextColor(100);

            doc.text(titlePDF, 190, 80);
            doc.setFontSize(10);
            doc.setTextColor(100);

            doc.text(infoFecha, 210, 95);
            doc.setFontSize(9);
            doc.setTextColor(100);
        }
    });

    if (typeof doc.putTotalPages === 'function') {
        doc.putTotalPages(totalPagesExp);
    }

   

    return doc
}

export { CrearPDF }