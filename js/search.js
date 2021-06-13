// montamos los selects
createSelectIngredients()
createSelectGlasses()
createSelectCategories()
createSelectAlcoholic()



// recogemos listado completo de bebidas, e iniciamos el autocompletado
let drinkList = createDrinkList();
autocomplete(document.querySelector("#inputName"), drinkList);

// evento al pulsar boton buscar
document.querySelector('#buttonName').addEventListener('click', function() {
    let val = document.querySelector('#inputName').value
    if (!val){
        val = null
    }
    let searchQuery = `search.php?s=${val}`;
    showDrinks(searchQuery);
})

// evento al cambiar select de ingredientes
document.querySelector('#selectIngredients').addEventListener('change', function() {
    // reset other selects
    document.querySelector('#selectGlasses').selectedIndex = 0;
    document.querySelector('#selectCategories').selectedIndex = 0;
    document.querySelector('#selectAlcoholic').selectedIndex = 0;

    let searchQuery = `filter.php?i=${this.value}`;
    showDrinks(searchQuery);
})

// evento al cambiar select de vasos
document.querySelector('#selectGlasses').addEventListener('change', function() {
    // reset other selects
    document.querySelector('#selectIngredients').selectedIndex = 0;
    document.querySelector('#selectCategories').selectedIndex = 0;
    document.querySelector('#selectAlcoholic').selectedIndex = 0;

    let searchQuery = `filter.php?g=${this.value}`;
    showDrinks(searchQuery);
})

// evento al cambiar select de categorias
document.querySelector('#selectCategories').addEventListener('change', function() {
    // reset other selects
    document.querySelector('#selectIngredients').selectedIndex = 0;
    document.querySelector('#selectGlasses').selectedIndex = 0;
    document.querySelector('#selectAlcoholic').selectedIndex = 0;

    let searchQuery = `filter.php?c=${this.value}`;
    showDrinks(searchQuery);
})

// evento al cambiar select de alcohol
document.querySelector('#selectAlcoholic').addEventListener('change', function() {
    // reset other selects
    document.querySelector('#selectIngredients').selectedIndex = 0;
    document.querySelector('#selectGlasses').selectedIndex = 0;
    document.querySelector('#selectCategories').selectedIndex = 0;

    let searchQuery = `filter.php?a=${this.value}`;
    showDrinks(searchQuery);
})





