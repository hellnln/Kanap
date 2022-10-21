/**
 * On recupere l'id du produit selectionne dans l'url de la page produit * 
 */
let searchParam = new URLSearchParams(window.location.search);
let kanapId = searchParam.get("id");

/** Une fois le DOM charge, on lance la function apiCall */
addEventListener("DOMContentLoaded", apiCall(kanapId));

/**
 * La fonction apiCall() recupere les donnees de l'api sur le produit selectionne
 * @param {string} productId 
 */
function apiCall(productId) {
  fetch(`http://localhost:3000/api/products/${productId}`)
    .then((product) => product.json())
    .then((response) => showProduct(response))
    .catch((error) => console.log("Erreur : " + error));
}

/** La fonction showProduct() affiche les informations sur le produit selectionne
 *  permet de creer les elements HTML pour afficher le produit sur la page
 *  @param {string} product
 * */ 

function showProduct(product) {
  
  const itemImg = document.querySelector(".item__img");

  let img = document.createElement("img");
  img.setAttribute("alt", product.altTxt);
  img.setAttribute("src", product.imageUrl);
  itemImg.appendChild(img);

  document.querySelector("#title")
  .appendChild(document.createTextNode(product.name));

  document.querySelector("#price")
  .appendChild(document.createTextNode(product.price));

  document.querySelector("#description")
  .appendChild(document.createTextNode(product.description));

  // creation de l'element option. On cree une boucle color qui va iterer sur le tableau colors pour recuperer les valeurs de option
  // ajout de l'attribut value de l'element option
  for (const color of product.colors) {
    let option = document.createElement("option");
    option.appendChild(document.createTextNode(color));
    option.setAttribute("value", color);
    document.querySelector("#colors").appendChild(option);
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
 * La fonction getBasket() permet de recupere le panier stocke dans le localStorage
 * @returns {basket[]} 
 */
function getBasket() {
  let basket = localStorage.getItem('basket');
  if (basket == null){
    return [];
  }else{
    return JSON.parse(basket);
  }
}

/**
 * Verifie si la couleur est selectionnee
 * @returns { false | true }
 */
function isColorSelected() {
  let kanapColor = document.querySelector("#colors").value;
  if (kanapColor == ''){
    alert('Veuillez choisir une couleur');
    return false;
  }
  return true;
}
/**
 * Verifie si la quantite est valide (comprise entre 1 et 100)
 * @returns { false | true }
 */
function isQuantityValid() {
  let kanapQuantity = Number.parseInt(document.querySelector("#quantity").value);
  if (kanapQuantity <= 0 || kanapQuantity >= 100){
    alert('Veuillez choisir une quantite entre 1 et 100');
    return false
  }
  return true;
}

/**
 * au clic sur le bouton ajouter au panier, on lance la fonction addBasket() pour ajouter les produits au panier
 *  @param {object} product
 */
let clickbutton = document.querySelector("#addToCart");
clickbutton.addEventListener("click", function addBasket(product){

  let basket = getBasket();

  product = {
    id : kanapId,
    color : document.querySelector("#colors").value,
    quantity : Number.parseInt(document.querySelector("#quantity").value)
  }

  let foundproduct = basket.find(p => p.id == product.id && p.color == product.color);

  if (isColorSelected() && isQuantityValid()) {
    if (foundproduct != undefined) {
      foundproduct.quantity += product.quantity;
      
    } else {
      product.quantity = product.quantity;
      basket.push(product);
      
    }
      saveBasket(basket);
      alert('Votre produit a bien été ajouté au panier !');
  }
  
});





    

   




