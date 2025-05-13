export class Serie {
    id;
    url;
    name;
    language;
    genres;
    image;
    constructor(id,url,name,language,generes,image) {
        this.id = id;
        this.url = url;
        this.name = name;
        this.language = language;
        this.generes = generes;
        this.image = image;
    }

    toJsonString(){
        return JSON.stringify({id: this.id,url: this.url,name: this.name,language: this.language,genres: this.genres,image: this.image})
    }

    static createFromJsonString(json) {
        const data = JSON.parse(json);
        return new Serie(data.id,data.url,data.name,data.language,data.genres,data.image);
    }

    createHtmlElement() {
        const div = document.createElement('div');
        div.classList.add("card", "h-100");
        const h2 = document.createElement('h2');
        h2.textContent = this.name;
        const pLang = document.createElement('p');
        pLang.textContent = `Lenguaje: ${this.language}`;
        const pGenres = document.createElement('p');

        pGenres.textContent = `Géneros: ${this.generes.join(', ')}`;
        const a = document.createElement('a');
        a.href = this.url;
        a.target = "_blank";

        const img = document.createElement('img');
        img.src = this.image;
        img.alt = this.name;
        img.width = 200;
        a.appendChild(img);

        const br = document.createElement('br');

        const btnGuardar = document.createElement('button');
        btnGuardar.textContent = 'Guardar';
        btnGuardar.addEventListener("click", async (e) => {
            console.log("Click en:", this.name);
            this.guardarSerie(this)
        });

        div.appendChild(h2);
        div.appendChild(pLang);
        div.appendChild(pGenres);
        div.appendChild(a);
        div.appendChild(br);
        div.appendChild(btnGuardar);

        return div;
    }

    guardarSerie(serie) {
        const guardadas = JSON.parse(localStorage.getItem("seriesGuardadas")) || [];
        const jsonSerie = serie.toJsonString();

        const existente = guardadas.find(seriesGuardada => seriesGuardada.id === serie.id);
        if (existente) {
            alert(`La serie "${serie.name}" ya está guardada!`);
            return;
        }

        guardadas.push(JSON.parse(jsonSerie));
    
        localStorage.setItem("seriesGuardadas", JSON.stringify(guardadas));
        console.log(`¡Serie "${serie.name}" guardada!`);
    }
}