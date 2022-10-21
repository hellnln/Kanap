
/** Une fois que le Dom est charge, on lance la fonction apiCall() */
addEventListener('DOMContentLoaded', apiCall);

/** apiCall() recupere les produits de l'api */
function apiCall() {
    fetch('http://localhost:3000/api/products')
    .then(productList => productList.json())
    .then(response => showProducts(response))
    .catch(error => console.log("Erreur : " + error));
}

/**
 * showProducts() permet d'afficher tous les produits de l'api
 * @param {object} allProducts reponse de l'api
 */
function showProducts(allProducts) {
    
    const items = document.querySelector('#items');
    
    for(const currentProduct of allProducts){
        let a = document.createElement('a');
            a.setAttribute('href','./product.html'+ '?id=' + currentProduct._id);
            items.appendChild(a);
            
        
        let article = document.createElement('article');
            a.appendChild(article);
            
        let img = document.createElement('img');
            img.setAttribute('alt',currentProduct.altTxt);
            img.setAttribute('src', currentProduct.imageUrl)
            article.appendChild(img);

        let h3 = document.createElement("h3");
            h3.appendChild(document.createTextNode(currentProduct.name));
            article.appendChild(h3);
        
        let p = document.createElement('p');
            p.appendChild(document.createTextNode(currentProduct.description));
            article.appendChild(p);
    }  
}