var itemData = [];
var pe,pr,op;
function onAddNewItem() {
    itemData.push({
        pe: 35400.0,
        pr: 41772.0,
        op: 50400.0
    });
    onHtmlData();
}

function onHtmlData() {
    var html = itemData.map(function (item, index) {
        return (`
        '<tr>'
        '<th scope="row" style="width: 15px;">${index + 1}</th>'
        '<td><input type="number" class="form-control" id="flujoPe${index}"  onkeyup="onChageData(${index})"  step="0.01" value="${item.pe}" required></td>'
        '<td><input type="number" class="form-control" id="flujoPr${index}" onkeyup="onChageData(${index})"  step="0.01" value="${item.pr}" required></td>'
        '<td><input type="number" class="form-control" id="flujoOp${index}" onkeyup="onChageData(${index})"  step="0.01" value="${item.op}" required></td>'
        '<td><a href="#" class="btn btn-danger"  onclick="cleanDataItem(${index})">X</a></td>'
        '</tr>'
            `);
    }).join(' ');
    $('#tbodyNewData').html(html);
}


function onChageData(i) {
    itemData[i].pe = $('#flujoPe' + i).val();
    itemData[i].pr = $('#flujoPr' + i).val();
    itemData[i].op = $('#flujoOp' + i).val();
}
function cleanAllData() {
    itemData = [];
    $('#tbodyNewData').html('');
    $('#tasaInteres').val('');
    $('#inversioInicial').val('');
    $('#tbodyResultado').html('');
    $('#tbodyCorridas').html('');
    $('#graficaTIR').html('');
}

function cleanDataItem(i) {
    var i = itemData.indexOf(itemData[i]);
    i !== -1 && itemData.splice(i, 1);
    onHtmlData();
}

function calcularValores() {
    onLoading(true);
    setTimeout(function () {
        var itemPe = [];
        var itemPr = [];
        var itemOp = [];
        itemData.forEach(data => {
            itemPe.push(data.pe);
            itemPr.push(data.pr);
            itemOp.push(data.op);
        });
        pe = calcularTir($('#inversioInicialPe').val() * 1, itemPe);
        pr = calcularTir($('#inversioInicialPr').val() * 1, itemPr);
        op = calcularTir($('#inversioInicialOp').val() * 1, itemOp);
        printResult(pe, pr, op);
        createGraphic();
        onLoading(false);
    }, 500);
}

function printResult(pe, pr, op) {
    var html = (`
        <tr>
            <th scope="col">TIR</th>
            <td scope="col">${pe.tir} %</td>
            <td scope="col">${pr.tir} %</td>
            <td scope="col">${op.tir} %</td>
        </tr>
        <tr>
            <th scope="col">TREMA</th>
            <td scope="col">${pe.vpn}</td>
            <td scope="col">${pr.vpn}</td>
            <td scope="col">${op.vpn}</td>
        </tr>
    `);
    $('#tbodyResultado').html(html);
}

function calcularTir(inversionInicial, aregloData) {
    var tir = 0.0000;
    var vpn = 1;
    var sumaFlujo = 0;
    aregloData.forEach(item => {
        sumaFlujo += item;
    });
    if (sumaFlujo > inversionInicial) {
        while (vpn > 0.05) {
            tir = tir + 0.0001;
            var periodo = 0;
            for (let i = 0; i < aregloData.length; i++) {
                periodo += aregloData[i] / Math.pow(1 + tir, i + 1);
            }
            vpn = -inversionInicial + periodo;
        }
    } else {
        console.log('negativo');
        vpn = -1;
        while (vpn < -0.05) {
            tir = tir - 0.0001;
            var periodo = 0;
            for (let i = 0; i < aregloData.length; i++) {
                periodo += aregloData[i] / Math.pow(1 + tir, i + 1);
            }
            vpn = -inversionInicial + periodo;
        }
    }
    var TIR = Math.round((tir * 100 + Number.EPSILON) * 100) / 100;//Math.round(tir * 100);
    var VPN = calcularVpn(inversionInicial, aregloData);
    console.log('termino');
    return {
        tir: TIR,
        vpn: VPN
    }
}

function calcularVpn(inversionInicial, aregloData) {
    var tasa = $('#tasaInteres').val() * 1 / 100;
    var periodo = 0;
    for (let i = 0; i < aregloData.length; i++) {
        periodo += aregloData[i] / Math.pow(1 + tasa, i + 1);
    }
    var vpn = - inversionInicial + periodo;
    var VPN = Math.round((vpn + Number.EPSILON) * 100) / 100;
    return VPN;
}

function onLoading(valor) {
    if (valor == true) {
        var html = (`
        <div class="spinner-border text-primary" role="status">
            <span class="sr-only">Loading...</span>
        </div>
        <div class="spinner-border text-success" role="status">
            <span class="sr-only">Loading...</span>
        </div>
        <div class="spinner-border text-danger" role="status">
            <span class="sr-only">Loading...</span>
        </div>
        <div class="spinner-border text-warning" role="status">
            <span class="sr-only">Loading...</span>
        </div>
        <div class="spinner-border text-dark" role="status">
            <span class="sr-only">Loading...</span>
        </div>
        `);
        $('#cargando').html(html);
    } else {
        $('#cargando').html('');
    }

}
