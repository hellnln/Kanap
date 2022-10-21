
/**on recupere le panier du localStorage */
let basket = getBasket();

/** Creation d'un objet pour stocker les prix provenant de l'API */
let productsPrices = {};

/**Quand le DOM est charge on lance la fonction apicall() */
addEventListener('DOMContentLoaded', apiCall);

/** Recuperation des donnees de l'API */ 
function apiCall() {
  fetch('http://localhost:3000/api/products')
    .then(productList => productList.json())
    .then(response => showProducts(response))
    .catch(error => console.log("Erreur : " + error));
}

/**
 * La fonction showProducts permet d'afficher les produits recupere depuis l'api
 * @param {object} response : version json de la reponse de l'api
*/
function showProducts(response) { 
  const allProductsFromApi = response;
  
  const section = document.getElementById("cart__items");
  // on fait une boucle sur les produits du panier pour creer les elements HTML pour chaque produit
  for (const product of basket) {

    const productFromApi = allProductsFromApi.find((singleProduct) => product.id === singleProduct._id);
   
    // a reexpliquer !!!
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

/**
 * Fonction pour supprimer un produit du panier en filtrant sur les produits que l'on veut conserver
 * Appelee par le addEventListener('click', ) de l'element ayant la classe 'deleteItem'
 * @param { string } productId 
 * @param { string } productColor 
 */
function removeFromBasket(productId, productColor) {
  let basket = getBasket();
  basket = basket.filter(productToKeep => productToKeep.id != productId || productToKeep.color != productColor);
  saveBasket(basket);
  location.reload();
}
/**
 * Fonction pour modifier la quantite dans le panier d'un produit
 * Fonction appelee par le addEventListener('change' ) de l'element input ayant pour class 'itemQuantity'
 * @param {string} item 
 * @param {string} id 
 * @param {string} color 
 */
function changeQuantity(item, id, color) {
  let basket = getBasket();
  let newQuantity = Number(item.value);
  let foundproduct = basket.find(product => product.id == id && product.color == color);

  if (foundproduct != undefined) {  
    foundproduct.quantity = newQuantity;  
    if (foundproduct.quantity <= 0) {
      foundproduct.quantity = item.value = 1;
    }
  }
  saveBasket(basket);
};

/**
* La fonction getBasket() permet de recupere le panier stocke dans le localStorage
* @returns {basket[]} 
*/
function getBasket() {
  let basket = localStorage.getItem('basket');
  if (basket == null) {
    return [];
  } else {

    return JSON.parse(basket);
  }
}

/**
 * La fonction saveBasket() permet d'enregistrer le panier dans le localStorage
 * @param {Array} basket 
 */
function saveBasket(basket) {
  localStorage.setItem('basket', JSON.stringify(basket));
}

/**
 * Fonction pour calculer le nombre total de produit dans le panier
 * @returns {number} le nombre total de produit dans le panier
 */
function getTotalQuantity() {
  let basket = getBasket();
  let number = 0;

  for (let product of basket) {
    number += product.quantity;
  }

  return number;
}

/**
 * Fonction pour calculer le prix total du panier
 * @returns {number} totalPrice
 */
function getTotalPrice() {
  let basket = getBasket();
  let totalPrice = 0;

  for (let product of basket) {
    totalPrice += productsPrices[product.id] * product.quantity;
  }

  return totalPrice;
}

/**
 * Fonction qui permet de mettre a jour la quantite totale et le prix total du panier 
 */
function displayCartTotal() {
  let totalQuantity = document.querySelector('#totalQuantity');
  totalQuantity.replaceChildren(document.createTextNode(getTotalQuantity()));

  let totalPrice = document.querySelector('#totalPrice');
  totalPrice.replaceChildren(document.createTextNode(getTotalPrice()));
}

/**
 * Fonction qui permet de recuperer les donnees de contact saisies dans le formulaire
 * @returns {object}
 */
function getContact() {

  const contact = {
        firstName: document.querySelector('#firstName').value,
        lastName: document.querySelector('#lastName').value,
        address: document.querySelector('#address').value,
        city: document.querySelector('#city').value,
        email: document.querySelector('#email').value,
  }
      return contact;
}

/**
 * Fonction pour effectuer les verifications du formulaire grace aux regex
 * @returns 
 */
function checkErrors() {
  
  let contact = getContact();
  
  const formFields = [
    {
      property: 'firstName',
      regex: /[a-zA-Z]+/g,
      id: 'firstNameErrorMsg',
      errorMessage: 'Veuillez saisir un prénom valide.'
    },
    {
      property: 'lastName',
      regex: /[a-zA-Z]+/g,
      id: 'lastNameErrorMsg',
      errorMessage: 'Veuillez saisir un nom valide.'
    },
    {
      property: 'address',
      regex: /^[a-zA-z0-9\s',-]+$/g,
      id: 'addressErrorMsg',
      errorMessage: 'Veuillez saisir une adresse valide.'
    },
    {
      property: 'city',
      regex: /[a-zA-Z]+/g,
      id: 'cityErrorMsg',
      errorMessage: 'Veuillez saisir un ville valide.'
    },
    {
      property: 'email',
      regex: /.+@.+\.[a-z]+/g,
      id: 'emailErrorMsg',
      errorMessage: 'Veuillez saisir un eMail valide.'
    },
  ]

  const errors = {
    firstName: true,
    lastName: true,
    address: true,
    city: true,
    email: true,
  }

  formFields.forEach((item) => {
    if (!contact[item.property].match(item.regex)) {
      document.getElementById(item.id).innerHTML=item.errorMessage;
    } else {
      document.getElementById(item.id).innerHTML='';
      errors[item.property] = false;
    }
  })

  const areFalse = Object.values(errors).every(
    value => value === false
  );
  return areFalse
}


/**
 * Fonction sendInfos() appelee au clic sur btn commander
 */
let clickOrder = document.querySelector("#order");
clickOrder.addEventListener("click", function sendInfos(event){
  event.preventDefault();

  let contact = getContact();
  let basket = getBasket();
  
  let products = []
  for (const item of basket) {
    let id = item.id;
    products.push(id); 
  }

  const isFreeOfErrors = checkErrors()
  
  // si isFreeOfErrors = true alors on lance la requete fetch
  if (isFreeOfErrors) {
    fetch('http://localhost:3000/api/products/order', {
      method: 'POST',
      body: JSON.stringify({
        contact,
        products
      }),
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
    })
    .then((response)=> response.json())
    .then((data)=> {
      console.log('orderId', data.orderId);
      window.location = `confirmation.html?orderId=${data.orderId}`;
    }) 
  }
})
