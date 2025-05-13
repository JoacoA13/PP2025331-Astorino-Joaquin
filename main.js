import {Serie} from "./serie.js";

function $(x) {
    return document.getElementById(x)
}
const divSeries = $("series");
const btnAnterior = $("btnAnterior");
const btnSiguiente = $("btnSiguiente");
const guardados = $("guardados");

const url = "https://api.tvmaze.com/shows/"
const optionsGET = {
    method: "GET",
    headers: {}
};

const cantidadSeries = 6;
const idsUsados = [];
const paginas = new Array();

async function traerSerie(id) {
    try {
        const response = await fetch(url+id,optionsGET)
        if (response.status === 200) {
            const serieJSON = await response.json();
            serieJSON.image = serieJSON.image.medium;
            const serie = Serie.createFromJsonString(JSON.stringify(serieJSON));
            //const serie = new Serie(serieJSON.id,serieJSON.url,serieJSON.name,serieJSON.language,serieJSON.genres,serieJSON.image.medium);
            return serie;
        }else {
            console.error("Error HTTP:", response.status);
            return [];
        }
    } catch (error) {
        window.alert("Error al cargar los datos" + error)
        return [];
    }
}

async function crearSeries(cantidad) {
    const nuevasSeries = [];
    let intentos = 0;

    for (let i = 0; i < cantidad && intentos < 500;) {
        let id = Math.floor(Math.random() * 12) + 1;
        intentos++;

        if (!idsUsados.includes(id)) {
            const serie = await traerSerie(id);
            if (serie) {
                nuevasSeries.push(serie);
                idsUsados.push(id);
                i++;
            }
        }
    }

    return nuevasSeries;
}


function renderizarSeries(lista) {
    divSeries.innerHTML = "";
    lista.forEach(serie => {
        divSeries.appendChild(serie.createHtmlElement());
    });
}

const pag1 = await crearSeries(cantidadSeries);
paginas.push(pag1);
let paginaActual = 0;
renderizarSeries(pag1);


async function paginaSiguiente() {
    paginaActual++;

    if (paginaActual < paginas.length) {
        renderizarSeries(paginas[paginaActual]);
    }else {
        const nuevasSeries = await crearSeries(cantidadSeries);
        if (nuevasSeries.length === 0) {
            paginaActual--;
            alert("No hay más series nuevas para mostrar");
        } else {
            paginas.push(nuevasSeries);
            renderizarSeries(nuevasSeries);
        }
    }
}

async function paginaAnterior() {
    if (paginaActual > 0) {
        paginaActual--;
        renderizarSeries(paginas[paginaActual]);
    } else {
        alert("Ya estás en la primera página");
    }
}

btnSiguiente.addEventListener("click",async(e)=>{
    e.preventDefault();
    paginaSiguiente();
});

btnAnterior.addEventListener("click",async(e)=>{
    e.preventDefault();
    paginaAnterior();
});

guardados.addEventListener("click", async(e) =>{
    e.preventDefault();
    const p = $("listaSeriesGuardadas");

    const guardadas = JSON.parse(localStorage.getItem("seriesGuardadas")) || [];
    console.log(guardadas);
    //FALTA MOSTRARLO EN "Guardados.html"    
});

