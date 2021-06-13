randomDrink();

// evento al pulsar boton refresh
document.querySelector('#refresh').addEventListener('click', function() {
    randomDrink();
})

function randomDrink(){
    axios.get(`https://www.thecocktaildb.com/api/json/${apiKey}/random.php`)
        .then(response => {
            let drink = response.data.drinks[0];

            showDetailedDrink(drink.idDrink)
        })
        .catch(error => {
            console.log(error)
            document.querySelector('.allCocktailsContent').innerHTML = `
                <h2>ERROR DEL SERVIDOR, INTENTELO MAS TARDE</h2>
            `;
        })

}
