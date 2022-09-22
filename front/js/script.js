let allProducts = null;

addEventListener('DOMContentLoaded', apiCall);

function apiCall() {
    fetch('http://localhost:3000/api/products')
    .then(response => response.json())
    .then(response => showProduct(response))
    .catch(error => console.log("Erreur : " + error));
}

function showProduct(response) {
    allProducts = response;
    console.log(allProducts);
    const items = document.querySelector('#items');
    console.log(items);

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

   

