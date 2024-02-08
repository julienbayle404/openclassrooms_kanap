// Afficher le numéro de commande sur la page de confirmation
let params = new URLSearchParams(window.location.search);
let orderId = params.get('id');
if (orderId) {
  document.getElementById('orderId').textContent = orderId;
}
else {
  alert("Commande non trouvée.")
}