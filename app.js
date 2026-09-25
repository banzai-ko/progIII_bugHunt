class EntidadBase{
    constructor(){
        if(this.constructor === EntidadBase){
            throw new Error("NO SE PUEDE INSTANCIAS UNA CLASE ABSTRACTA");

        }

    }


}



class Libro extends EntidadBase{

    _id ;
    _titulo;
    _autor;
    _genero;
    _anio;
    _paginas;
    _estado;

    constructor(titulo, autor, genero, anio, paginas, estado){
        super();
        this._id = Date.now().toString(36) + Math.random().toString(36).substring(2, 5);
        this._titulo = titulo;
        this._autor = autor;
        this._genero = genero;
        this._anio = anio;
        this._paginas = paginas;
        this._estado = estado;
    }

    get id() {
        return this._id;

    }

    get titulo() {
        return this._titulo;

    }

    get autor() {
        return this._autor;
    }

    get genero() {
        return this._genero;
    }

    get anio() {
        return this._anio;
    }

    get paginas() {
        return this._paginas;
    }

    get estado() {
        return this._estado;
    }




    set titulo(nuevoTitulo) {

        this._titulo = nuevoTitulo;

    }

    set autor(nuevoAutor) {
        this._autor = nuevoAutor;
    }

    set genero(nuevoGenero) {

        const generos = ["ficcion","no ficcion","tecnico","Ciencia"];

        if( !generos.includes(nuevoGenero)){
            throw new Error("GENERO INVALIDO")
        }
        this._genero = nuevoGenero;
    }



    set anio(nuevoAño) {
        if(Number(nuevoAño) > 2099 || Number(nuevoAño) < 1000){
            throw new Error("AÑO INVALIDO")

        }
        this._anio = nuevoAño;
    }



    set paginas(nuevasPaginas) {

        const p = Number(nuevasPaginas)

        if( p < 1){
            throw new Error("AÑO INVALIDO")
        }

        this._paginas = nuevasPaginas;
    }


    set estado(nuevoEstado) {
        const estado = ["Pendiente", "Leyendo", "Leido"];
        if( !estado.includes(nuevoEstado)){
            throw new Error("ESTADO INVALIDO")
        }

        this._estado = nuevoEstado;
    }

    toJson(){
        return {
        id : this._id,
        titulo : this._titulo,
        autor : this._autor,
        genero : this._genero,
        anio : this._anio,
        paginas : this._paginas,
        estado : this._estado,
        } ;
    }

    toString(){

        return `id : ${this._id} titulo : ${this.titulo} autor : ${this._autor} año : ${this._anio} paginas : ${this._paginas} estado : ${this._estado}`;

    }

}


class Biblioteca{

    _libros;


    constructor(){
        this._libros = [];
        this.cargarDesdeLocalStorage();
    }

    agregarLibro(libro){
        if(!(libro instanceof  Libro)){
            throw new error("no es un libro")
        }

        this._libros.push(libro);

        this.guardarEnLocalStorange();

    }


    eliminarLibro(id){
        const indice = this._libros.findIndex(l => l._id === id);

        if(indice === -1){

            return false;
        }

        this._libros.splice(indice, 1); // elimina en el indice y desde ahi la cantidad de eliminados

        this.guardarEnLocalStorange();

        return true;
    }


    editarLibro(id, {
        titulo ,
        autor ,
        genero,
        anio ,
        paginas ,
        estado
    }){

        const libro = this._libros.find(l => l._id === id);



        if(libro === undefined){
            return false;
        }

        libro.titulo = titulo;  //llama al seter cuando asigno valor
        libro.autor = autor;
        libro.genero = genero;
        libro.anio = anio;
        libro.paginas = paginas;
        libro.estado = estado;

        this.guardarEnLocalStorange();

        return true;




    }
    get libros(){
        return this._libros;
    }

    guardarEnLocalStorange(){
        const datos = this._libros.map(l => l.toJson()); //recorre y llama a la funcion


        localStorage.setItem('biblioteca', JSON.stringify(datos)); // biblio es la clave ..stringify comvierte todo el array en string


    }



    cargarDesdeLocalStorage(){
        const datos = localStorage.getItem("biblioteca");

        if(datos === null){
            localStorage.setItem("biblioteca", JSON.stringify(datosPrueba));
            return this.cargarDesdeLocalStorage();
        }

        try{

            const datosParseados = JSON.parse(datos);

            //this._libros = datosParseados.map(e => new Libro(e.titulo, e.autor, e.genero, e.anio, e.paginas, e.estado));
            this._libros = datosParseados.map(e =>  {

                const libro = new Libro(e.titulo, e.autor, e.genero, e.anio, e.paginas, e.estado)

                Object.defineProperty(libro, `_id`, {value : e.id , writable: false });

                return libro;



            });


        }catch(e){
            console.error("error al cargar desde el local storange ",e);
            this._libros = [];
        };


        return true;
    }










}



const biblioteca = new Biblioteca();

//biblioteca.guardarEnLocalStorange();





const cuerpoTabla = document.getElementById("cuerpo-tabla");



function renderizarTabla(listaLibros = biblioteca._libros){
    cuerpoTabla.innerHTML = "";
    if(listaLibros.length === 0){
        cuerpoTabla.innerHTML = '<tr> <td background-color = "#0e0d0d" colspan = "9" text-align = "center" >  no hay libros disponibles </td> </tr>' ;
        return ;
    }

    listaLibros.forEach(l => {

        const fila = document.createElement("tr");
// `` permite hacer multilinea
        fila.innerHTML = `
      <td>${l.titulo}</td>
      <td>${l.autor}</td>
      <td>${l.genero}</td>
      <td>${l.anio}</td>
      <td>${l.paginas}</td>
      <td class = "estado-${l.estado.toLowerCase()}">${l.estado}</td>
        <td><button class= "btn-eliminar btn-acciones" data-id = "${l.id}"> <span> Eliminar  </span> </button> <button class= "btn-editar btn-acciones" data-id = "${l.id}"> Editar </button></td>
        `;
    cuerpoTabla.appendChild(fila);});
    }





const formulario = document.getElementById("formulario-libro");


let libroEditandoId = null;

formulario.addEventListener("submit", (evento) =>{
    evento.preventDefault();

    const titulo = document.getElementById("titulo").value.trim();
    const autor = document.getElementById("autor").value.trim();
    const genero = document.getElementById("genero").value.trim();
    const anio = document.getElementById("anio").value.trim();
    const estado = document.getElementById("estado").value.trim();
    const paginas = document.getElementById("paginas").value.trim();




    if(libroEditandoId){
        console.log("el id es ", libroEditandoId);
        biblioteca.editarLibro(libroEditandoId, {

        titulo ,
        autor ,
        genero,
        anio ,
        paginas ,
        estado})

        libroEditandoId = null;

        document.querySelector(".btn-guardar-libro").textContent = "agregar libro" ;

        alert("el libro se edito correctamente");



    }else{
        biblioteca.agregarLibro(new Libro(titulo ,
        autor ,
        genero,
        anio ,
        paginas ,
        estado));

        alert("el libro se agrego correctamente");
    }


    formulario.reset();
    renderizarTabla();
});
renderizarTabla();





document.getElementById("tabla-libros").addEventListener("click" , (evento) =>{


    const btn= evento.target.closest('button');
    console.log(btn);



    let id = btn.dataset.id;  //obtiene el id



    if(btn.classList.contains("btn-eliminar")){
        if(confirm("seguro que desea eliminar este libro?")){
            console.log(biblioteca.eliminarLibro(id));
            renderizarTabla();


        }

    }



    if(btn.classList.contains("btn-editar")){


        console.log("entro al editar");
        const libro = biblioteca.libros.find(l => l.id === id);




        document.getElementById("titulo").value = libro.titulo;
        document.getElementById("autor").value = libro.autor;
        document.getElementById("genero").value = libro.genero;
        document.getElementById("anio").value = libro.anio;
        document.getElementById("estado").value = libro.estado;
        document.getElementById("paginas").value = libro.paginas;

        libroEditandoId = id;





        document.querySelector(".btn-guardar-libro").textContent = "editar libro" ;






    }



});
