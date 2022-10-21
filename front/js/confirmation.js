/** on recupere l'order id de la commande */ 
let searchOrderId = new URLSearchParams(window.location.search);
addEventListener("DOMContentLoaded", getOrderId(searchOrderId.get("orderId")));
console.log('searOrderID.getOrderId',searchOrderId.get('orderId'));

/**
 * Function pour afficher le numero de commande sur la page de confirmation
 * @param {string} orderId 
 */
function getOrderId(orderId) {
    document.getElementById('orderId').innerHTML = orderId;
    localStorage.clear();
}