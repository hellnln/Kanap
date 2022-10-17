// on recupere l'id du produit selectionne
let searchParam = new URLSearchParams(window.location.search);
console.log('searchParam', searchParam);
addEventListener("DOMContentLoaded", apiCall(searchParam.get("id")));
console.log('searParam.getId',searchParam.get('id'));

// on recupere les donnees de l'api sur le produit selectionne
function apiCall(productId) {
  fetch(`http://localhost:3000/api/products/${productId}`)
    .then((product) => product.json())
    .then((response) => showProduct(response))
    .catch((error) => console.log("Erreur : " + error));
}

// on cree une fonction pour afficher le produit

function showProduct(product) {
  
  // creation de l'element img
  const itemImg = document.querySelector(".item__img");

  let img = document.createElement("img");
  img.setAttribute("alt", product.altTxt);
  img.setAttribute("src", product.imageUrl);
  itemImg.appendChild(img);

  // ajout des valeurs name, price, description

    document.querySelector("#title")
    .appendChild(document.createTextNode(product.name));
  
    document.querySelector("#price")
    .appendChild(document.createTextNode(product.price));
  
    document.querySelector("#description")
    .appendChild(document.createTextNode(product.description));

  // creation de l'element option. on cree une boucle color qui va iterer sur le tableau colors pour recuperer les valeurs de option
  // ajout de l'attribut value de l'element option
  const colorSelector = document.querySelector("#colors");

  for (const color of product.colors) {
    let option = document.createElement("option");
    option.appendChild(document.createTextNode(color));
    option.setAttribute("value", color);
    colorSelector.appendChild(option);
    
  }
}
    
    
let kanapId = searchParam.get("id"); // on recuperer l'id du canape
 
// on cree une fonction pour enregistrer le panier dans le localStorage
function saveBasket(basket) {
  localStorage.setItem('basket', JSON.stringify(basket));
}

// creation d'une fonction pour recuperer le panier du localStorage s'il existe, sinon on cree un array vide
function getBasket() {
  let basket = localStorage.getItem('basket');
  if (basket == null){
    return [];
  }else{
    return JSON.parse(basket);
  }
}

// click ajout au panier
let clickbutton = document.querySelector("#addToCart");
clickbutton.addEventListener("click", function addBasket(product){

  let basket = getBasket();  // creation de la variable basket qui va executer la fonction getBasket
  let kanapQuantity = Number.parseInt(document.querySelector("#quantity").value); // on recupere la quantite selectionnee et on la transforme ne number
  let kanapColor = document.querySelector("#colors").value; // on recupere la couleur choisie
 
  
  // on cree l'objet product pour stocker les donnees 
  product = {
    id : kanapId,
    color : kanapColor,
    quantity : kanapQuantity,
  }

  
  let foundproduct = basket.find(p => p.id == product.id && p.color == product.color); // on cherche dans le tableau basket si l'id et la couleur existe deja
  if(kanapColor == '') {
    alert('Veuillez choisir une couleur'); // on verifie que la couleur et la quantite ont bien ete selectionne
  }else if (kanapQuantity <= 0 || kanapQuantity > 100){
    alert('Veuillez choisir une quantite entre 0 et 100');
  }else if(foundproduct != undefined){
    foundproduct.quantity += product.quantity; // si foundproduct est different de undefined => le produit existe deja donc on ajoute la quantite a celle dana le panier
  }else{
    product.quantity = kanapQuantity; // sinon on ajoute la quantite selectionne et on cree une nouvelle ligne dans basket
    basket.push(product);
  }
  saveBasket(basket);
});





    

   




