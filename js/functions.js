// const apiKey = 'v2/9973533';
const apiKey = 'v1/1'

function showFavorites() {
    // definimos elementos
    let pagesNumber = document.querySelector('#paginas');
    let buttonPrev = document.querySelector('#buttonPrev');
    let buttonNext = document.querySelector('#buttonNext');
    let paginationContainer = document.querySelector('#paginationContainer');

    // recuperamos favorilesList de local storage
    let favoritesList = [];
    let favorite = new Object();
    let string = localStorage.getItem("favoritesList");

    // Si el string de localstorage tiene contenido hacemos el trabajo
    if (string) {
        favoritesList = JSON.parse(string);
        console.log('recuperado favoritesList de localstorage');
        // si no esta vacio
        if (favoritesList.length){

            let drinks = favoritesList;

            let pageNumber = 1;
            let pageSize = 10;
            let pagination;
            let pageCont = Math.ceil(Object.keys(drinks).length / pageSize);

            function paginate(array, page_size, page_number) {
                return array.slice((page_number - 1) * page_size, page_number * page_size);
            }
            
            let container = document.querySelector('.allCocktailsContent');
            function show() {
                container.innerHTML = ``;

                pagination = paginate(drinks, pageSize, pageNumber);

                pagination.forEach(function(drink, i) {
                    container.innerHTML += `
                        <div class='cocktail' onclick='showDetailedDrink(${drink.idDrink}, false)'>
                            <div class="cocktail-image">
                                <img src="${drink.strDrinkThumb}">
                                <div class="stars-icon">
                                    <img id="star" src="img/estrella-fav.png">
                                </div>
                            </div>
                            <p class="title-list">${drink.strDrink}</p>
                        </div>
                        <hr>
                    `;
                });

                // mostramos paginas
                pagesNumber.style.display = 'block';
                pagesNumber.innerHTML = `${pageNumber} / ${pageCont}`;

                // si la página es la primera no mostramos botón prev
                if (pageNumber === 1) {
                    buttonPrev.style.display = 'none';
                }
                else {
                    buttonPrev.style.display = 'inline';
                }

                // si la página es la última no mostramos botón next
                if (pageNumber === pageCont) {
                    buttonNext.style.display = 'none';
                }
                else {
                    buttonNext.style.display = 'inline';
                }

                // si solo hay una página ocultamos texto de páginas
                if (pageCont === 1) {
                    paginationContainer.style.display = 'none';
                }
                else {
                    paginationContainer.style.display = 'flex';
                }
            }

            // evento si pulsamos boton prev
            buttonPrev.addEventListener('click', () => {
                pageNumber--;
                show();
            })

            // evento si pulsamos boton next
            buttonNext.addEventListener('click', () => {
                pageNumber++;
                show(); 
            })

            // mostramos la paginación
            show();
        }
    }
    // si no no hay contenido en localstorage mostramos mensaje y no hacemos nada
    else {
        console.log('No hay favoritos')
        document.querySelector('.allCocktailsContent').innerHTML = `
                <h2>NO HAY FAVORITOS DISPONIBLES</h2>
            `;

        // Ocultamos controles de pagina
        hideControls();
    }
}

function showDetailedDrink(idDrink) {
    // recuperamos favorilesList de local storage
    let isFavorite = false;
    let favoritesList = [];
    let string = localStorage.getItem("favoritesList");
    if (string) {
        favoritesList = JSON.parse(string);
        console.log('recuperado favoritesList de localstorage');
    }
    else {
        console.log('No hay favoritos')
        favoritesList = null;
    }

    axios.get(`https://www.thecocktaildb.com/api/json/${apiKey}/lookup.php?i=${idDrink}`)
        .then(response => {
            let drink = response.data.drinks[0];

            // reseselects
            resetSelects();

            // ocultamos botonUp
            if (document.querySelector('#buttonUp')){
                document.querySelector('#buttonUp').style.display = 'none';
            }

            // ocultamos controles de página
            hideControls();
            
            let stringQuery = `
                <div class='cocktail'>
                    <p class="title-detailed">${drink.strDrink}</p>
                    <div class="cocktail-body">
                        <div class="cocktail-image-detailed">
                            <img class="detailed" src="${drink.strDrinkThumb}">
                        </div>
                        <div class="cocktail-right">
                            <p class="subtitle-detailed">Categoria:</p>
                            <p>${drink.strCategory}</p>
                            <p class="subtitle-detailed">Tipo:</p>
                            <p>${drink.strAlcoholic}</p>
                            <p class="subtitle-detailed">Ingredientes:</p>
            `;
            for (let i = 1; i <= 15; i++) {
                let ingredient = drink[`strIngredient${i}`];
                let measure = drink[`strMeasure${i}`];

                if (!ingredient) break;

                stringQuery += `<p>${measure} ${ingredient}</p>`;
            }

            stringQuery += `
                            <p class="subtitle-detailed">Copa:</p>
                            <p>${drink.strGlass}</p>
                            <p class="subtitle-detailed">Instrucciones:</p>
            `;
            if (drink.strInstructions == ""){
                stringQuery += `
                            <p>No disponible</p>`;
            }
            else {
                stringQuery += `
                            <p>${drink.strInstructions}</p>`;
            }

            stringQuery += `
                        </div>
                    </div>
                </div>`;

            // comprobar si esta en favoritos
            if (favoritesList){
                for (let fav of favoritesList) {
                    if (fav.idDrink == drink.idDrink){
                        isFavorite = true;
                        break;
                    }
                };
            }

            if (isFavorite){
                stringQuery += `
                <div class="favorites-icon">
                    <img id="favorite" src="img/fav2-remove-min.png">
                </div>
                `;

                document.querySelector('.allCocktailsContent').innerHTML = stringQuery;
                
                document.querySelector('.cocktail-image-detailed').innerHTML += `
                <div class="stars-icon">
                    <img id="star" src="img/estrella-fav.png">
                </div>
                `;

                // evento al pulsar quitar de favoritos
                document.querySelector('#favorite').addEventListener('click', function(){
                    console.log('pulsado quitar de favoritos');
                    let obj = {
                        strDrink: `${drink.strDrink}`,
                        strDrinkThumb: `${drink.strDrinkThumb}`,
                        idDrink: `${drink.idDrink}`
                    }

                    addTofavorite(obj, false);
                })
            }
            else {
                stringQuery += `
                <div class="favorites-icon">
                    <img id="favorite" src="img/fav2-min.png">
                </div>
                `;

                document.querySelector('.allCocktailsContent').innerHTML = stringQuery;

                // evento al pulsar añadir favoritos
                document.querySelector('#favorite').addEventListener('click', function(){
                    console.log('pulsado favoritos');
                    let obj = {
                        strDrink: `${drink.strDrink}`,
                        strDrinkThumb: `${drink.strDrinkThumb}`,
                        idDrink: `${drink.idDrink}`
                    }

                    addTofavorite(obj, true);
                })
            }
        })
        .catch(error => {
            console.log(error)
            document.querySelector('.allCocktailsContent').innerHTML = `
                <h2>ERROR DEL SERVIDOR, INTENTELO MAS TARDE</h2>
            `;
        })
}

function showDrinks(searchTag){

    // recuperamos favoritesList de local storage
    let isFavorite = false;
    let favoritesList = [];
    let string = localStorage.getItem("favoritesList");
    if (string) {
        favoritesList = JSON.parse(string);
        console.log('recuperado favoritesList de localstorage');
    }
    else {
        console.log('No hay favoritos')
        favoritesList = null;
    }

    axios.get(`https://www.thecocktaildb.com/api/json/${apiKey}/${searchTag}`)
        .then(response => {
            let drinks = response.data.drinks;

            if (drinks == 'None Found') drinks = null;

            if (drinks){
                let pageNumber = 1;
                let pageSize = 20;
                let pagination;
                let pageCont = Math.ceil(Object.keys(drinks).length / pageSize);

                function paginate(array, page_size, page_number) {
                    return array.slice((page_number - 1) * page_size, page_number * page_size);
                }
                
                let container = document.querySelector('.allCocktailsContent');

                function show() {
                    let stringQuery = "";

                    pagination = paginate(drinks, pageSize, pageNumber);

                    pagination.forEach(drink => {
                        // comprobar si esta en favoritos
                        if (favoritesList){
                            isFavorite = false;
                            for (let fav of favoritesList) {
                                if (fav.idDrink == drink.idDrink){
                                    isFavorite = true;
                                    break;
                                }
                            };
                        }

                        stringQuery += `
                            <div class='cocktail-list' onclick='showDetailedDrink(${drink.idDrink}, true)'>
                                <div class="cocktail-image">
                                    <img src="${drink.strDrinkThumb}">
                        `;
                        
                        if (isFavorite){
                            stringQuery += `
                                    <div class="stars-icon">
                                        <img id="star" src="img/estrella-fav.png">
                                    </div>
                            `;
                        }

                        stringQuery += `
                                </div>
                                <p class="title-list">${drink.strDrink}</p>
                            </div>
                            <hr>
                        `;

                        container.innerHTML = stringQuery;

                    });

                    // mostramos botones
                    document.querySelector('#buttonUp').style.display = 'inline';

                    // mostramos paginas
                    document.querySelector('#paginas').style.display = 'block';
                    document.querySelector('#paginas').innerHTML = `${pageNumber} / ${pageCont}`;

                    // si la página es la primera no mostramos botón prev
                    if (pageNumber === 1) {
                        document.querySelector('#buttonPrev').style.display = 'none';
                    }
                    else {
                        document.querySelector('#buttonPrev').style.display = 'inline';
                    }

                    // si la página es la última no mostramos botón next
                    if (pageNumber === pageCont) {
                        document.querySelector('#buttonNext').style.display = 'none';
                    }
                    else {
                        document.querySelector('#buttonNext').style.display = 'inline';
                    }

                    // si solo hay una página ocultamos texto de páginas
                    if (pageCont === 1) {
                        document.querySelector('#paginationContainer').style.display = 'none';
                    }
                    else {
                        document.querySelector('#paginationContainer').style.display = 'flex';
                    }
                }

                // evento si pulsamos boton prev
                document.querySelector('#buttonPrev').addEventListener('click', function() {
                    pageNumber--;
                    show();
                })

                // evento si pulsamos boton next
                document.querySelector('#buttonNext').addEventListener('click', function() {
                    pageNumber++;
                    show(); 
                })

                // mostramos la paginación
                show();
            }
            else {
                console.log('sin resultados')

                // ocultamos controles
                hideControls();

                document.querySelector('.allCocktailsContent').innerHTML = `
                <h2>SIN RESULTADOS, INTENTE OTRA BUSQUEDA</h2>
                `;
            }

        })
        .catch(error => {
            console.log(error)
            document.querySelector('.allCocktailsContent').innerHTML = `
                <h2>ERROR DEL SERVIDOR, INTENTELO MAS TARDE</h2>
            `;
        })
}

function createSelectIngredients() {

    axios.get(`https://www.thecocktaildb.com/api/json/${apiKey}/list.php?i=list`)
    .then(response =>{

        let drinks = response.data.drinks;
        drinks = _.sortBy(drinks, ['strIngredient1']);

        let docu = document.querySelector('#selectIngredients');

        drinks.forEach(element => {
            docu.innerHTML += `
                <option value='${element.strIngredient1}'>${element.strIngredient1}</option>
            `;
        });

        docu.addEventListener('change', function() {
            console.log(this.value);
        })
    })
    .catch(error => {
        console.log(error)
        document.querySelector('.allCocktailsContent').innerHTML = `
            <h2>ERROR DEL SERVIDOR, INTENTELO MAS TARDE</h2>
        `;
    })
}

function createSelectCategories() {

    axios.get(`https://www.thecocktaildb.com/api/json/${apiKey}/list.php?c=list`)
    .then(response =>{

        let drinks = response.data.drinks;
        drinks = _.sortBy(drinks, ['strIngredient1']);

        let docu = document.querySelector('#selectCategories');

        drinks.forEach(element => {
            docu.innerHTML += `
                <option value='${element.strCategory}'>${element.strCategory}</option>
            `;
        });

        docu.addEventListener('change', function() {
            console.log(this.value);
        })
    })
    .catch(error => {
        console.log(error)
        document.querySelector('.allCocktailsContent').innerHTML = `
            <h2>ERROR DEL SERVIDOR, INTENTELO MAS TARDE</h2>
        `;
    })
}

function createSelectGlasses() {

    axios.get(`https://www.thecocktaildb.com/api/json/${apiKey}/list.php?g=list`)
    .then(response =>{

        let drinks = response.data.drinks;
        let docu = document.querySelector('#selectGlasses');

        drinks.forEach(element => {
            docu.innerHTML += `
                <option value='${element.strGlass}'>${element.strGlass}</option>
            `;
        });

        docu.addEventListener('change', function() {
            console.log(this.value);
        })
    })
    .catch(error => {
        console.log(error)
        document.querySelector('.allCocktailsContent').innerHTML = `
            <h2>ERROR DEL SERVIDOR, INTENTELO MAS TARDE</h2>
        `;
    })
}

function createSelectAlcoholic() {

    axios.get(`https://www.thecocktaildb.com/api/json/${apiKey}/list.php?a=list`)
    .then(response =>{

        let drinks = response.data.drinks;
        let docu = document.querySelector('#selectAlcoholic');

        drinks.forEach(element => {
            docu.innerHTML += `
                <option value='${element.strAlcoholic}'>${element.strAlcoholic}</option>
            `;
        });

        docu.addEventListener('change', function() {
            console.log(this.value);
        })
    })
    .catch(error => {
        console.log(error)
        document.querySelector('.allCocktailsContent').innerHTML = `
            <h2>ERROR DEL SERVIDOR, INTENTELO MAS TARDE</h2>
        `;
    })
}

function addTofavorite(objectFavorites, isAdd) {
    // si no existe favorites en localstorage lo creamos, si existe lo recuperamos
    let favoritesList = [];
    let favorite = new Object();
    let string = localStorage.getItem("favoritesList");
    if (string) {
        favoritesList = JSON.parse(string);
        console.log('recuperado favoritesList de localstorage');
    }
    else {
        console.log('creado favoritestList')
    }

    favorite.strDrink = objectFavorites.strDrink;
    favorite.strDrinkThumb = objectFavorites.strDrinkThumb;
    favorite.idDrink = objectFavorites.idDrink;

    if (isAdd){
        // si es true añadimos el favorito a favoritesList
        favoritesList.push(favorite)
    }
    else {
        // si es false eliminamos el favorito de favoritesList
        favoritesList = favoritesList.filter(function(f) {
            return f.idDrink !== objectFavorites.idDrink; 
        });
    }

    //Subir al local storage
    string = JSON.stringify(favoritesList);
    localStorage.setItem("favoritesList", string);
    console.log(`añadido nuevo objeto de favoritos en localstorage`);

    showDetailedDrink(objectFavorites.idDrink, false)
}

function createDrinkList() {
    // si no existe drinkList en localstorage lo creamos, si existe lo recuperamos
    let drinkList = [];
    let string = localStorage.getItem("drinkList");
    if (string) {
        drinkList = JSON.parse(string);
        console.log('recuperado drinkList de localstorage');
    }
    else {
        axios.get(`https://www.thecocktaildb.com/api/json/v2/9973533/search.php?s=`)
            .then(response =>{
                let drinks = response.data.drinks;

                drinkList = drinks.map(drink => {
                    return drink.strDrink;
                });

                //Subir al local storage
                string = JSON.stringify(drinkList);
                localStorage.setItem("drinkList", string);
                console.log('creado drinkList de la API a localstorage');

            })
            .catch(error => {
                console.log(error)
                document.querySelector('.allCocktailsContent').innerHTML = `
                    <h2>ERROR DEL SERVIDOR, INTENTELO MAS TARDE</h2>
                `;
            })
    }

    return drinkList;
}

function resetSelects() {
    if (document.querySelector('#selectIngredients'))
        document.querySelector('#selectIngredients').selectedIndex = 0;

    if (document.querySelector('#selectGlasses'))
        document.querySelector('#selectGlasses').selectedIndex = 0;

    if (document.querySelector('#selectCategories'))
        document.querySelector('#selectCategories').selectedIndex = 0;
    
    if (document.querySelector('#selectAlcoholic'))
        document.querySelector('#selectAlcoholic').selectedIndex = 0;
}

function hideControls() {
    if (document.querySelector('#paginas'))
        document.querySelector('#paginas').style.display = 'none';

    if (document.querySelector('#buttonPrev'))
        document.querySelector('#buttonPrev').style.display = 'none';

    if (document.querySelector('#buttonNext'))
        document.querySelector('#buttonNext').style.display = 'none';
    
    if (document.querySelector('#paginationContainer'))
        document.querySelector('#paginationContainer').style.display = 'none';
}