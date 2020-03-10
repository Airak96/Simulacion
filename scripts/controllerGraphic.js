

var dataGraphic = [];

function distribucionAcomulada(pe, pr, op) {
    calcularInvervalos(pe, op);
    //Generar numeros aletorios
    for (let index = 0; index < dataGraphic.length; index++) {
        //Si es menor o igual
        // R<= b-a / c-a
        // X = c+raiz((c-a)(b-a)(R))

        //Caso contrario
        // R > b-a / c-a
        // X = c-raiz((c-a)(c-b)(1-R))
        var R = getRandomArbitrary(0, 1);
        var a = pe.tir / 100;
        var b = pr.tir / 100;
        var c = op.tir / 100;
        var condicion = (b - a) / (c - a);
        var X = 0;
        if (R <= condicion) {
            X = c + Math.sqrt((c - a) * (b - a) * (R));
        } else {
            X = c - Math.sqrt((c - a) * (c - b) * (1 - R));
        }
        console.log(R + '\t' + (1 - X));
    }
}

function calcularInvervalos(pe, op) {
    dataGraphic = [];
    //intervalo de clase = rango/número de clases.
    var intervaloClase, rango, númeroClases;
    if (pe.tir < 0) {
        rango = (pe.tir * -1) + op.tir;
    } else {
        rango = op.tir - pe.tir;
    }
    numeroIntervalos = 0;
    if (rango <= 50) {
        numeroIntervalos = 5;
        intervaloClase = rango / numeroIntervalos;
    } else if (rango > 50 && rango <= 100) {
        numeroIntervalos = 8;
        intervaloClase = rango / numeroIntervalos;
    } else if (rango > 100 && rango <= 250) {
        numeroIntervalos = 15;
        intervaloClase = rango / numeroIntervalos;
    } else if (rango > 250) {
        numeroIntervalos = 20;
        intervaloClase = rango / numeroIntervalos;
    }

    var Li = pe.tir;
    var Ls = 0;
    for (let i = 0; i < numeroIntervalos; i++) {
        Ls = Li + intervaloClase; //redondear a 2
        dataGraphic.push({
            li: Li,
            ls: Ls,
            fr: 0,
            fa: 0
        });
        Li = Ls; //redondear a 2
    }
}

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

function createGraphic() {
    $('#graficaTIR').html('');
    var medioAnio=2020+Math.round(itemData.length/2);
    var ultimoAnio=2020+itemData.length;
    Morris.Line({
        element: 'graficaTIR',
        data: [
            { x: '2020', value: pe.tir},
            { x: ''+medioAnio, value: op.tir},
            { x: ''+ultimoAnio, value: pr.tir},
          ],
          // The name of the data record attribute that contains x-values.
          xkey: 'x',
          // A list of names of data record attributes that contain y-values.
          ykeys: ['value'],
          // Labels for the ykeys -- will be displayed when you hover over the
          // chart.
          labels: ['TIR']
    });

}