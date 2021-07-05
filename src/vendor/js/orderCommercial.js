var jsPDF = require('jspdf');
require('jspdf-autotable');


function UrlExists(url) { var http = new XMLHttpRequest(); http.open('HEAD', url, false); http.send(); return http.status!=404; }


function CrearCommercialPDF(titlePDF, totales, columns,items, path_img, path_sbx_img){
    // Only pt supported (not mm or in)

    var img = new Image();
    img.src = path_img;
    
    var doc = new jsPDF('p', 'pt');

    var pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();

    try{
        doc.addImage(img, 'JPG', 50, 40, 80, 60)
    }catch{
        img.src = path_sbx_img
        doc.addImage(img, 'PNG', 60, 40, 140, 50)
    }
    
    var centeredText = function(text, y) {
        let textWidth = doc.getStringUnitWidth(text) * doc.internal.getFontSize() / doc.internal.scaleFactor;
        let textOffset = ((doc.internal.pageSize.width+200) - textWidth) / 2;
        doc.text(textOffset, y, text);
    }

    var fullCentered = function(text, y) {
        let textWidth = doc.getStringUnitWidth(text) * doc.internal.getFontSize() / doc.internal.scaleFactor;
        let textOffset = ((doc.internal.pageSize.width) - textWidth) / 2;
        doc.text(textOffset, y, text);
    }

    doc.setFontSize(12);
    centeredText('REPRESENTACIONES OSCAR JARAMILLO',45) //text('REPRESENTACIONES OSCAR JARAMILLO PLÁSTICOS OJARA S.A.', 280, 45);
    centeredText(' PLÁSTICOS OJARA S.A.',60)
    
    doc.setFontSize(12);
    doc.setTextColor(100);
    centeredText('NIT 890.920.025-0',75) //doc.text('NIT 890.920.025-0', 240, 60);

    doc.setFontSize(10);
    doc.setTextColor(100);
    centeredText('CR 42 54A 155 IN 1050 Itagüí – Antioquia – Colombia',85)

    doc.setFontSize(10);
    doc.setTextColor(100);
    centeredText("PBX: (57) (4) 444 8786 – www.ojara.com",95)
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    centeredText("Correo electrónico: cliente@ojara.com",105)

    doc.setFontSize(9);
    doc.setTextColor(100);
    centeredText("Somos Auto-Retenedores",115)

    doc.setFontSize(14);
    doc.setTextColor(60);
    fullCentered("CI HERMECO",144)

    doc.setFontSize(10);
    doc.setTextColor(100);
    fullCentered("Contacto: Juan Pablo Mesa",  160);

    doc.setFontSize(10);
    doc.setTextColor(100);
    fullCentered("Direccion: CR 50 FF 8 SUR 27 OF 215 CONJUNTO DE BODEGAS",  172);

    doc.setFontSize(10);
    doc.setTextColor(100);
    fullCentered("Telefono: 444-44-44",  184);

    doc.setFontSize(10);
    doc.setTextColor(100);
    fullCentered("Pedido Nro: ##### | Orden de Compra: ###",  198);
    

    doc.setFontSize(14);
    doc.setTextColor(100);
    doc.text("Informacion Entrega:", 40, 214);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text("Direccion: CR 50 FF 8 SUR 27 OF 215 CONJUNTO DE BODEGAS", 40, 226);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text("Telefono: 222-22-22", 40, 238);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text("Asesor Comercial: UNo Dos Tres", 40, 250);
    
    // doc.setFontSize(9);
    // doc.setTextColor(100);

    // doc.setFontSize(10)
    // doc.fromHTML(`
    //     <table style="font-family: Arial, Helvetica, sans-serif; font-size:10px; text-align:center;"> 
    //     <tr>
    //         <td style="width:20%">CLIENTE</td> 
    //         <td >CLIENTE</td> 
    //     </tr>
           
    //     </table> 
    //     `, 85, 135)
    //     doc.setFontSize(10)
    
    doc.page = 1;
    var totalPagesExp = "{total_pages_count_string}";

    doc.autoTable(columns, items, {
        //startY: 110,
        styles: { fontSize: 10},
        columnStyles: {
            id: {fontSize: 10}
        },
        margin: {top: 260},
        
        addPageContent: function(data) {
            var str = "SyncBox i4.0 | Página " + data.pageCount;
            // Total page number plugin only available in jspdf v1.0+
            if (typeof doc.putTotalPages === 'function') {
                str = str + " de " + totalPagesExp;
            }

            doc.setFontSize(10);
            doc.text(str, 420, 20);

        }
    });
    
    let finalY = doc.lastAutoTable.finalY+20;
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(4.0);
    doc.line(30, finalY, 565, finalY);

    if (typeof doc.putTotalPages === 'function') {
        doc.putTotalPages(totalPagesExp);
    }
    var pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
    var pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();
    
    let str = ["Beneficiario Representaciones Oscar Jaramillo", "Bancolombia 66580834881 Cuenta Corriente - Recaudo empresarial Convenio 17074"]
    doc.setTextColor(100);
    doc.setFontSize(10);
    doc.text(str, pageWidth / 2, pageHeight  - 30, 'center');

    doc.text(`Lorem ipsum dolor sit amet consectetur adipisicing elit. Natus, aliquam, perferendis modi nesciunt sed pariatur debitis facilis dolorem blanditiis delectus illo tempore nostrum ipsam assumenda quas et id, sint incidunt!
    Illum et ratione voluptate minus aliquam ea tenetur officia velit a saepe necessitatibus quod quisquam libero ullam pariatur explicabo voluptas, aut qui dolore rem fuga quia. Facere culpa aperiam voluptatum.
    Nam adipisci, ipsa quas harum incidunt soluta dignissimos quam totam, consequatur doloremque quae blanditiis quasi excepturi dolore nobis sit iste labore, veniam eaque accusamus nemo. Sequi modi ea possimus iusto!
    Beatae esse magnam, cumque fuga hic aut reprehenderit odit maiores quo pariatur soluta suscipit autem exercitationem ratione, at voluptate numquam quam nemo deserunt tenetur sequi unde tempore perspiciatis. Esse, suscipit!`,
     30, finalY+40, {maxWidth: 300, align: "justify"});

    doc.setFontSize(11);
    doc.text('Cantidad Total: ' + 0,30, finalY+20, {maxWidth: 300, align: "justify"});
    
    doc.setFontSize(11);
    doc.text('Total Bruto: ', 350, finalY+20, {maxWidth: 100, align: "justify"});
    doc.setFontSize(11);
    doc.text(550, finalY+20, totales[0], {align: "right"});

    doc.setFontSize(11);
    doc.text('Total Descuento: ',350, finalY+35, {maxWidth: 100, align: "justify"});
    doc.setFontSize(11);
    doc.text(550, finalY+35, totales[1], {align: "right"});

    doc.setFontSize(11);
    doc.text('Subtotal: ',350, finalY+50, {maxWidth: 100, align: "justify"});
    doc.setFontSize(11);
    doc.text(550, finalY+50, totales[2], {align: "right"});

    doc.setFontSize(11);
    doc.text('Total impuesto: ',350, finalY+65, {maxWidth: 100, align: "justify"});
    doc.setFontSize(11);
    doc.text(550, finalY+65, totales[3], {align: "right"});

    doc.setFontSize(11);
    doc.text('Gran Total: ',350, finalY+80, {maxWidth: 100, align: "justify"});
    doc.setFontSize(11);
    doc.text(550, finalY+80, totales[4], {align: "right"});

    return doc
}

export { CrearCommercialPDF }