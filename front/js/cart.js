
//on recupere le panier du localStorage
let basket = JSON.parse(localStorage.getItem('basket'));
console.log('panier', basket);

let productsPrices = {};


addEventListener('DOMContentLoaded', apiCall);

// recuperation des donnees de l'api
function apiCall() {
  fetch('http://localhost:3000/api/products')
    .then(productList => productList.json())
    .then(response => showProducts(response))
    .catch(error => console.log("Erreur : " + error));
}


function showProducts(response) { // on recupere la reponse de l'api
  const allProductsFromApi = response; // on stocke la reponse de l'api dans la variable productsFromAPI
  console.log('api', allProductsFromApi);

  const section = document.getElementById("cart__items");
  // on fait une boucle sur les produits du panier
  for (const product of basket) {

    // creation d'une variable productFromApi pour rechercher dans les produits de l'api
    // le produit avec le meme id que le produit dans le panier
    const productFromApi = allProductsFromApi.find((singleProduct) => product.id === singleProduct._id);
    productsPrices[productFromApi._id] = productFromApi.price
    //creation des elements HTML pour afficher le panier   
    let article = document.createElement('article');
    article.setAttribute('data-id', product.id);
    article.setAttribute('data-color', product.color)
    article.setAttribute('class', "cart__item");
    section.appendChild(article);

    let divImg = document.createElement('div');
    divImg.setAttribute('class', 'cart__item__img');
    article.appendChild(divImg);

    let img = document.createElement('img');
    img.setAttribute('src', productFromApi.imageUrl);
    img.setAttribute('alt', productFromApi.altTxt);
    divImg.appendChild(img);

    let divContent = document.createElement('div');
    divContent.setAttribute('class', "cart__item__content");
    article.appendChild(divContent);

    let divDescription = document.createElement('div');
    divDescription.setAttribute('class', "cart__item__content__description");
    divContent.appendChild(divDescription);

    let h2 = document.createElement('h2');
    h2.appendChild(document.createTextNode(productFromApi.name));
    divDescription.appendChild(h2);

    let pColor = document.createElement('p');
    pColor.appendChild(document.createTextNode(product.color));
    divDescription.appendChild(pColor);

    let pPrice = document.createElement('p');
    pPrice.appendChild(document.createTextNode(productFromApi.price + ' €'));
    divDescription.appendChild(pPrice);

    let divSettings = document.createElement('div');
    divSettings.setAttribute('class', "cart__item__content__settings");
    divContent.appendChild(divSettings);

    let divQuantity = document.createElement('div');
    divQuantity.setAttribute('class', "cart__item__content__settings__quantity");
    divSettings.appendChild(divQuantity);

    let pQuantity = document.createElement('p');
    pQuantity.appendChild(document.createTextNode('Qté : '));
    divQuantity.appendChild(pQuantity);

    let input = document.createElement('input');
    input.setAttribute('Type', 'number');
    input.setAttribute('class', 'itemQuantity');
    input.setAttribute('name', 'itemQuantity');
    input.setAttribute('min', '1');
    input.setAttribute('max', '100');
    input.setAttribute('value', product.quantity);
    divQuantity.appendChild(input);
    let itemQuantity = document.querySelectorAll('.itemQuantity');
    itemQuantity.forEach((item) => {
      let dataArticle = item.closest('article');
      let id = dataArticle.dataset.id;
      let color = dataArticle.dataset.color;
      item.addEventListener('change', function () {
        changeQuantity(item, id, color);
        displayCartTotal();        
      });
    })

    let divDelete = document.createElement('div');
    divDelete.setAttribute('class', "cart__item__content__settings__delete");
    divSettings.appendChild(divDelete);

    let pDelete = document.createElement('p');
    pDelete.setAttribute('class', "deleteItem");
    pDelete.appendChild(document.createTextNode('Supprimer'));
    pDelete.addEventListener('click', function () {
      removeFromBasket(product.id, product.color)
    });
    divDelete.appendChild(pDelete);

  }

  displayCartTotal();
  
}

// on filtre sur les produits different de l'article a supprimer
function removeFromBasket(productId, productColor) {
  let basket = getBasket();
  basket = basket.filter(productToKeep => productToKeep.id != productId || productToKeep.color != productColor);
  saveBasket(basket);
  location.reload();
}

function changeQuantity(item, id, color) {
  let basket = getBasket();
  let newQuantity = Number(item.value);
  let foundproduct = basket.find(product => product.id == id && product.color == color); // on cherche dans le tableau basket le produit dont la quantite a change

  if (foundproduct != undefined) {  // si foundproduct est different de undefined (le produit exsite) et newQuantity >= a 0
    foundproduct.quantity = newQuantity; // on change la quantite par la nouvelle quantity saisie  
    if (foundproduct.quantity <= 0) {
      foundproduct.quantity = item.value = 1;
    }
  }
  saveBasket(basket);
};

function getBasket() {
  let basket = localStorage.getItem('basket');
  if (basket == null) {
    return [];
  } else {

    return JSON.parse(basket);
  }
}
 
function saveBasket(basket) {
  localStorage.setItem('basket', JSON.stringify(basket));
}

function getTotalQuantity() {
  let basket = getBasket();
  let number = 0;

  for (let product of basket) {
    number += product.quantity;
  }

  return number;
}

function getTotalPrice() {
  let basket = getBasket();
  let totalPrice = 0;

  for (let product of basket) {
    totalPrice += productsPrices[product.id] * product.quantity;
  }

  return totalPrice;
}

function displayCartTotal() {
  let totalQuantity = document.querySelector('#totalQuantity');
  totalQuantity.replaceChildren(document.createTextNode(getTotalQuantity()));

  let totalPrice = document.querySelector('#totalPrice');
  totalPrice.replaceChildren(document.createTextNode(getTotalPrice()));
}



// click order
let clickOrder = document.querySelector("#order");
clickOrder.addEventListener("click", function sendInfos(event){
  event.preventDefault()

  // recuperer les infos du formulaire et alimenter un object contact
  const contact = {
    firstName: document.querySelector('#firstName').value,
    lastName: document.querySelector('#lastName').value,
    address: document.querySelector('#address').value,
    city: document.querySelector('#city').value,
    email: document.querySelector('#email').value,
  }

  // recuperer les id du basket pour alimenter le tableau products
  let basket = getBasket();
  let products = []
  for (const item of basket) {
    let id = item.id;
    products.push(id); 
  }
   
  // creation d'un objet body qui regroupe les infos de contact et les id des produits du panier
  let body = {
    contact,
    products
  }
 
   // si mauvais format dans formulaire de contact alors erreur
  if (!contact.email.match(/.+@.+\.[a-z]+/g)) {
    document.getElementById('emailErrorMsg').innerHTML='Veuillez saisir un eMail valide.';
  } else {
    document.getElementById('emailErrorMsg').innerHTML='';
  }
  if (!contact.firstName.match(/[a-zA-Z]+/g)) {
    document.getElementById('firstNameErrorMsg').innerHTML='Veuillez saisir votre prénom.';
  } else {
    document.getElementById('firstNameErrorMsg').innerHTML='';
  }
  if (!contact.lastName.match(/[a-zA-Z]+/g)) {
    document.getElementById('lastNameErrorMsg').innerHTML='Veuillez saisir votre nom.';
  } else {
    document.getElementById('lastNameErrorMsg').innerHTML='';
  }
  if (!contact.address.match(/.+/g)) {
    document.getElementById('addressErrorMsg').innerHTML='Veuillez saisir une adresse valide.';
  } else {
    document.getElementById('addressErrorMsg').innerHTML='';
  } 
  if (!contact.city.match(/[a-zA-Z]+/g)) {
    document.getElementById('cityErrorMsg').innerHTML='Veuillez saisir votre ville.';
  } else {
    document.getElementById('cityErrorMsg').innerHTML='';
   // sinon envoyer les infos de commande accompagnees des infos de contact
         // fetch en POST avec les bons parametres
      fetch('http://localhost:3000/api/products/order', {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
      })
      .then((response)=> response.json())
      .then((data)=> {
        console.log('orderId', data.orderId);
        // recuperer num de commande
        // rediriger vers page de confirmation?commande=123456
        window.location = `confirmation.html?orderId=${data.orderId}`;
        // on vide le local storage
        localStorage.clear();

      }
  )}})



 