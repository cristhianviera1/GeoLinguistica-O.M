/**
 *
 * @param {Recibe un array con objetos de numeros y colores} array
 * ejm {num:1, color:'#fff'}
 * @param {Se reciba latitud y longitud donde dibujar el pastel} latlng
 * @param {Recibe el nombre del array donde se incertarán los pasteles retornantes} arrayPush
 */
function dibujar(array, latlng, arrayPush) {
    const num_pie = []
    for (var i = 0; i < array.length; i++) {
        if (array[i].num > 0) {
            num_pie.push(array[i]);
        }
    }
    var pie_charts = L.pie(latlng, num_pie, {
        labels: false,
        radius: 2000,
        pathOptions: {
            fillOpacity: 1,
        }
    });
    arrayPush.push(pie_charts);
}
/**
 * Función para generar un color aleatorio 
 */
function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
/**
 * @param {Recibe un array de coordenadas para calcular el centro de las mismas} arr 
 */
var getCentro = function (arr) {
    var twoTimesSignedArea = 0;
    var cxTimes6SignedArea = 0;
    var cyTimes6SignedArea = 0;
    var length = arr.length

    var x = function (i) { return arr[i % length][0] };
    var y = function (i) { return arr[i % length][1] };

    for (var i = 0; i < arr.length; i++) {
        var twoSA = x(i) * y(i + 1) - x(i + 1) * y(i);
        twoTimesSignedArea += twoSA;
        cxTimes6SignedArea += (x(i) + x(i + 1)) * twoSA;
        cyTimes6SignedArea += (y(i) + y(i + 1)) * twoSA;
    }
    var sixSignedArea = 3 * twoTimesSignedArea;
    return [cyTimes6SignedArea / sixSignedArea, cxTimes6SignedArea / sixSignedArea];
}