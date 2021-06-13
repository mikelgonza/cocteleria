// showFavorites();

let favoritesList;
let favorite = new Object();
let string = localStorage.getItem("favoritesList");
favoritesList = JSON.parse(string);

// Si el string de localstorage tiene contenido hacemos el trabajo
if (string) {
    favoritesList = JSON.parse(string);
    
    if (favoritesList.lenght) {
        
        console.log('tenemos contenido en localstorage')
    } else { 
        console.log('esta vacio')
    }

} else {
    console.log('no existe el array')
}
