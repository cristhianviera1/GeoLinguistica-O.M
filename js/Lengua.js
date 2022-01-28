var preguntas = ['22', '24', '23'];
var lenguasLayer = ['Lengua materna', 'Lengua preferida', 'Uso más frecuente'];
var lenguasPrincipales = [];
var colores = ['#ddddff', '#ccddff', '#ccdddd', '#ccffdd', '#bbddcc', '#ddffcc', '#ccddcc', '#ddddcc', '#ddccbb', '#ffddcc', '#ffcccc', '#ffccdd', '#ddbbcc', '#ddccdd', '#ddccff'];
var primerZoom;
var objetos = [];
var contador;
var baseLayers;
var lenguaControl;
var pastelControlInstanciado = false;
var pastelesPrueba = {}
var lengs;
var eye = false;
var legend;

function coloresCondicion(arr) {
    if (arr.slice(0, -3) === 'L1') {
        return '#33cc33'
    } else if (arr.slice(0, -3) === 'BILI') {
        return '#ffbb00'
    } else if (arr.slice(0, -3) === 'CAST') {
        return '#ec4040'
    } else if (arr.slice(0, -3) === 'OTRA') {
        return '#821C00'
    } else if (arr.slice(0, -3) === 'NR') {
        return '#fff'
    } else if (arr.slice(0, -3) === 'MULTI') {
        return '#65A7FD'
    } else if (arr.slice(0, -3) === 'NA') {
        return '#373737'
    }
}

function getColor() {
    contador++
    if (contador >= colores.length) {
        contador = 0;
    }
    return colores[contador]
}
function tamañoPastel(t, c) {
    var currentZoom
    if (t === 1) {
        currentZoom = 4542.85
        return currentZoom
    } else if (c === 1) {
        currentZoom = 342.85;
        return currentZoom
    } else {
        currentZoom = 2142.85;
        return currentZoom
    }
}

function preguntar(capa) {
    for (len in preguntas) {
        pastelesPrueba[preguntas[len]] = [];
        for (i in objetos) {
            var pastel = []
            if (objetos[i].properties.LENGUA_L1 === capa) {
                for (e in objetos[i].properties) {
                    if (e.slice(-2) === preguntas[len] && objetos[i].properties[e] > 0) {
                        pastel.push({ num: parseInt(objetos[i].properties[e]), color: coloresCondicion(e) });
                    }
                }
            }
            pie_charts = L.pie(getCentro(objetos[i].geometry.coordinates[0][0]), pastel, {
                labels: false,
                radius: tamañoPastel(objetos[i].properties.past_g, objetos[i].properties.comu),
                pathOptions: {
                    fillOpacity: 1,
                    className: "interactivo"
                }
            });
            pastelesPrueba[preguntas[len]].push(pie_charts);

        }
    }
    layerGroups = {

    }
    for (pregunta in pastelesPrueba) {
        layerGroups[pregunta] = L.layerGroup();
        for (e in pastelesPrueba[pregunta]) {
            var pastel = pastelesPrueba[pregunta][e]
            layerGroups[pregunta].addLayer(pastel);
        }
    }
    lengs = {
        "Hablantes": {
        }
    }
    for (var j = 0; j < lenguasLayer.length; j++) {
        lengs["Hablantes"][lenguasLayer[j]] = layerGroups[preguntas[j]]
    }
    var options = {
        exclusiveGroups: ["Hablantes"],
        groupCheckBoxes: false,
        collapsed: false,
        position: 'topright'
    }
    if (pastelControlInstanciado) {
        map.removeControl(pastelControl);
        pastelControlInstanciado = false;
    }
    pastelControl = L.control.groupedLayers(null, lengs, options).addTo(map)
    pastelControlInstanciado = true;
    if (legend) {
        legend.remove();
    }
    legend = L.control({ position: 'topright' });
    legend.onAdd = function (map) {
        var div = L.DomUtil.create('div', 'info legend');
        div.innerHTML = '<span class="leaflet-control-layers-group-name">Lenguas en uso</span><table style="margin: auto"><td id="LN1">Seleccione una lengua</td><td><div class="circulo verde"></div></td></tr><tr><td>Bilingüe</td><td><div class="circulo amarillo"></div></td></tr><tr><td>Castellano</td><td><div class="circulo rojo"></div></td></tr><tr><td>Multilingüe</td><td><div class="circulo celeste-leyenda"></div></td></tr><tr><td>Otra</td><td><div class="circulo cafe-leyenda"></div></td></tr><tr><td>No Aplica</td><td><div class="circulo plomo-leyenda"></div></td></tr><tr><td>No Responde</td><td><div class="circulo blanco"></div></td></tr></table>';
        return div;
    };

    legend.addTo(map);


}
function dibujarControlLenguas(overlay) {
    baseLayers = {};
    contador = 0;
    for (var i = 0; i < overlay.length; i++) {
        baseLayers[overlay[i]] = []
        for (var j = 0; j < objetos.length; j++) {
            if (objetos[j].properties.LENGUA_L1 == overlay[i]) {
                baseLayers[overlay[i]].push(objetos[j])
            }
        }
        baseLayers[overlay[i]] = L.geoJson(baseLayers[overlay[i]], {
            onEachFeature: function (feature, featureLayer) {
                featureLayer.bindPopup(feature.properties.PARROQUIA);
                featureLayer.on('mouseover', function (e) {
                    this.openPopup();
                });
                featureLayer.on('mouseout', function (e) {
                    this.closePopup();
                });
            },
            style: function (layer) {
                return {
                    fillOpacity: 0.6,
                    color: getColor(),
                    weight: 2,
                }
            }
        });
        baseLayers[overlay[i]].setStyle({ 'className': 'parroquias' });
    }


    lenguaControl = L.control.layers(baseLayers, null, {
        collapsed: false,
    }).addTo(map);
    //Se agrega título al control de lenguas
    $(".leaflet-control-layers-base").before("<span class='leaflet-control-layers-group-name'>Lenguas</span>");



}


var dataEncuesta = $.getJSON("https://oralidadmodernidad.org/wp-content/uploads/geoMaps/geojson_files/encuesta.geojson", function (response) {
    var dataGS = L.geoJson(response, {
        onEachFeature: function (feature) {
            objetos.push(feature);
            if (lenguasPrincipales.indexOf(feature.properties.LENGUA_L1) === -1) {
                lenguasPrincipales.push(feature.properties.LENGUA_L1)
            }
        },
        style: function (layer) {
            return { fillOpacity: 0.8, color: '#555' }
        }
    });
    lenguasPrincipales.sort();

    dibujarControlLenguas(lenguasPrincipales);
    $(".leaflet-control-layers-toggle").append('<span>Lenguas</span><i class="fas fa-angle-down"></i>');
    var divLenguaControl = lenguaControl.getContainer();
    $(divLenguaControl).mouseover(function () {
        lenguaControl.expand();
    });
    $(divLenguaControl).mouseout(function () {
        lenguaControl.collapse();
    });

})

var map = L.map('map', {
    minZoom: 6,
    center: [-0.657396, -83.800946],
    zoom: 6,
    maxZoom: 18
});


const MaxBoxTiles = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZ2FicmllbHZpZXJhIiwiYSI6ImNramJuaW80eDduMWQydnBkdDc5Mm11bTMifQ.o-9-A2sAE9fOU_3tvsYqsg', {
    attribution: '© <a href="https://www.mapbox.com/feedback/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    tileSize: 512,
    zoomOffset: -1
});
MaxBoxTiles.addTo(map);

map.addControl(new L.Control.Fullscreen());



L.control.scale().addTo(map);


var pastelPequeño = false;
function zoomPasteles() {
    if (!primerZoom) {
        if (map.getZoom() > 9) {
            if (!pastelPequeño) {
                for (preg in layerGroups) {
                    if (map.hasLayer(layerGroups[preg])) {
                        map.removeLayer(layerGroups[preg]);
                        for (pieChart in layerGroups[preg]._layers) {
                            layerGroups[preg]._layers[pieChart].options.radius = layerGroups[preg]._layers[pieChart].options.radius / 1.9;
                            pastelPequeño = true;
                        }
                        layerGroups[preg].addTo(map);
                    } else {
                        for (var i = 0; i < pastelesPrueba[preg].length; i++) {
                            pastelesPrueba[preg][i].options.radius = pastelesPrueba[preg][i].options.radius / 1.9;
                        }
                    }
                }
            }
        } else if (pastelPequeño && map.getZoom() < 10) {
            for (preg in layerGroups) {
                if (map.hasLayer(layerGroups[preg])) {
                    map.removeLayer(layerGroups[preg]);
                    for (pieChart in layerGroups[preg]._layers) {
                        layerGroups[preg]._layers[pieChart].options.radius = layerGroups[preg]._layers[pieChart].options.radius * 1.9;
                        pastelPequeño = false;
                    }
                    layerGroups[preg].addTo(map);
                } else {
                    for (var i = 0; i < pastelesPrueba[preg].length; i++) {
                        pastelesPrueba[preg][i].options.radius = pastelesPrueba[preg][i].options.radius * 1.9;
                    }
                }

            }

        }
    }
    primerZoom = false
}



var comunidades = true;
function ctrl() {
    for (a in lenguasPrincipales) {
        if (map.hasLayer(baseLayers[lenguasPrincipales[a]])) {
            parroquiaInstanciada = baseLayers[lenguasPrincipales[a]]
        }
    }
    if (comunidades) {
        parroquiaInstanciada.setStyle({
            fillOpacity: 0,
            weight: 0
        })
        //parroquiaInstanciada.bringToBack();
        comunidades = false;
    } else {
        parroquiaInstanciada.setStyle({
            fillOpacity: 0.6,
            weight: 2
        })
        comunidades = true;
        //parroquiaInstanciada.bringToFront();
    }
}
var ourCustomControl = L.Control.extend({
    options: {
        position: 'bottomright'
    },
    onAdd: function (map) {
        var container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-custom-control');
        var nombre = L.DomUtil.create('span', 'bolder');
        nombre.innerText = "Parroquias"
        var icon = L.DomUtil.create('i', 'far fa-eye')
        icon.style.padding = '3px 0px 3px 10px';
        icon.id = "eyeIcon"
        container.appendChild(nombre);
        container.appendChild(icon);

        container.style.backgroundColor = 'white';

        container.style.width = 'auto';
        container.style.height = 'auto';

        container.onclick = function () {
            map.doubleClickZoom.disable();
            setTimeout(function () { map.doubleClickZoom.enable(); }, 1000);
            if (eye == true) {
                $('#eyeIcon').removeClass('fa-eye').addClass('fa-eye-slash');
                eye = false
            } else {
                $('#eyeIcon').removeClass('fa-eye-slash').addClass('fa-eye');
                eye = true;
            }
            ctrl();
        }
        return container;
    },
});
map.addControl(new ourCustomControl());
$('#eyeIcon').removeClass('fa-eye').addClass('fa-eye-slash');
function clickearPastel(status) {
    var current = map.getZoom()
    if (map.hasLayer(baseLayers.Shiwiar)) {
        currentZoom = (150000 / current)
    } else {
        currentZoom = (35000 / current);
    }
    if (status) {
        return currentZoom;
    } else {
        return currentZoom * 5 / current;
    }
}
var generaciones = false

map.on('baselayerchange', function (e) {
    //Se obtiene zoom de la capa a enfocar y se centra con una animación
    var zoom = map.getBoundsZoom(baseLayers[e.name].getBounds());
    primerZoom = true;
    var posicion = baseLayers[e.name].getBounds()
    var lat = (posicion._northEast.lat + posicion._southWest.lat) / 2
    var lng = (posicion._northEast.lng + posicion._southWest.lng) / 2
    map.flyTo([lat, lng], zoom, {
        animate: true,
        duration: 0.6
    });
    //map.fitBounds(baseLayers[e.name].getBounds());
    for (a in pastelesPrueba) {
        if (map.hasLayer(layerGroups[a])) {
            map.removeLayer(layerGroups[a]);
        }
    }
    if (pastelControlInstanciado) {
        for (layer in lengs.Usuarios) {
            if (map.hasLayer(lengs.Usuarios[layer])) {
                map.removeLayer(lengs.Usuarios[layer]);
            }
        }
    }
    $("#leyenda").removeClass('hide');

    lenguaControl.collapse();
    preguntar(e.name);
    $("#LN1").text(e.name);
    $(".leaflet-control-layers").css({ 'border-bottom': 'black 1px solid' });
    map.addLayer(layerGroups[22]);
    generaciones = true
});
map.on('zoomend', function (e) {
    if (generaciones) {
        for (a in layerGroups) {
            if (map.hasLayer(layerGroups[a])) {
                zoomPasteles();
            }
        }
    }
})

function mantenerPorcentajes(latlng, radio, labels) {
    for (a in layerGroups) {
        for (b in layerGroups[a]._layers) {
            if (layerGroups[a]._layers[b]._latlng[0] == latlng[0]) {
                if (!(map.hasLayer(layerGroups[a]))) {
                    layerGroups[a]._layers[b].options.radius = radio;
                    layerGroups[a]._layers[b].options.labels = labels;
                }
            }
        }
    }
}
