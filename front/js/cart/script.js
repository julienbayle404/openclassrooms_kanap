let cartItems = JSON.parse(localStorage.getItem("cart")) || [];
const cartItemsContainer = document.querySelector("#cart__items");
const totalPrice = document.getElementById("totalPrice");

const products = fetch("http://localhost:3000/api/products")

.then(response => response.json())
.then(products => {
  afficherTotal(products);
  cartItems.forEach(item => {
    const product = products.find(p => p._id === item.id);
    const article = document.createElement("article");
    article.classList.add("cart__item");
    article.setAttribute("data-id", item.id);
    article.setAttribute("data-color", item.color);
  
    const itemImage = document.createElement("div");
    itemImage.classList.add("cart__item__img");
  
    const image = document.createElement("img");
    image.setAttribute("src", product.imageUrl);
    image.setAttribute("alt", product.name);
  
    itemImage.appendChild(image);
    article.appendChild(itemImage);
  
    const itemContent = document.createElement("div");
    itemContent.classList.add("cart__item__content");
  
    const itemDescription = document.createElement("div");
    itemDescription.classList.add("cart__item__content__description");
  
    const itemName = document.createElement("h2");
    itemName.textContent = product.name;
  
    const itemColor = document.createElement("p");
    itemColor.textContent = ("Couleur : " + item.color);
  
    const itemPrice = document.createElement("p");
    itemPrice.textContent = (product.price + " €");

  
    itemDescription.appendChild(itemName);
    itemDescription.appendChild(itemColor);
    itemDescription.appendChild(itemPrice);
    itemContent.appendChild(itemDescription);
  
    const itemSettings = document.createElement("div");
    itemSettings.classList.add("cart__item__content__settings");
  
    const itemQuantity = document.createElement("div");
    itemQuantity.classList.add("cart__item__content__settings__quantity");
  
    const quantityLabel = document.createElement("p");
    quantityLabel.textContent = "Qté : ";
  
    const quantityInput = document.createElement("input");
    quantityInput.setAttribute("type", "number");
    quantityInput.setAttribute("class", "itemQuantity");
    quantityInput.setAttribute("name", "itemQuantity");
    quantityInput.setAttribute("min", "1");
    quantityInput.setAttribute("max", "100");
    quantityInput.setAttribute("value", item.quantity);
        
    // Ajouter le listener au changement de la quantité -> Changer la quantité dans le local storage + actualiser le total en euro.

    quantityInput.addEventListener("change", (event) => {
      const newQuantity = event.target.valueAsNumber;
      const article = event.target.closest(".cart__item");
      const id = article.getAttribute("data-id");
      const color = article.getAttribute("data-color");
      const itemIndex = cartItems.findIndex(item => item.id === id && item.color === color);
      if (newQuantity < 1 || newQuantity > 100) {
        event.target.value = cartItems[itemIndex].quantity;
        alert("La quantité doit être comprise entre 1 et 100.");
      }
      else {
        cartItems[itemIndex].quantity = newQuantity;
        localStorage.setItem("cart", JSON.stringify(cartItems));
        afficherTotal(products);
      }
    });
  
    itemQuantity.appendChild(quantityLabel);
    itemQuantity.appendChild(quantityInput);
    itemSettings.appendChild(itemQuantity);
  
    const itemDelete = document.createElement("div");
    itemDelete.classList.add("cart__item__content__settings__delete");
  
    const deleteButton = document.createElement("p");
    deleteButton.classList.add("deleteItem");
    deleteButton.textContent = "Supprimer";

    // Ajouter un gestionnaire d'événements click pour chaque bouton "Supprimer"
    deleteButton.addEventListener("click", () => {
      const article = deleteButton.closest(".cart__item");
      const id = article.getAttribute("data-id");
      const color = article.getAttribute("data-color");

      // Supprimer l'article du panier
      cartItems = cartItems.filter(item => item.id !== id || item.color !== color);
      localStorage.setItem("cart", JSON.stringify(cartItems));
      
      // Supprimer l'article de l'affichage
      article.remove();
      afficherTotal(products);
  });
  
    itemDelete.appendChild(deleteButton);
    itemSettings.appendChild(itemDelete);
  
    itemContent.appendChild(itemSettings);
  
    article.appendChild(itemContent);
    cartItemsContainer.appendChild(article);
  });
})
.catch((e)=> {
  console.error(e);
  alert("Une erreur s'est produite, veuillez recharger la page");
  return [];
});

const afficherTotal = (products) => {
  // Calculer la quantité totale
  let totalQuantity = 0;
  cartItems.forEach(item => {
    totalQuantity += item.quantity;
  });

  // Calculer le coût total du panier en euros
  let totalPrice = 0;
  cartItems.forEach(item => {
    const product = products.find(p => p._id === item.id);
    totalPrice += product.price * item.quantity;
  });

  // Afficher le prix total et la quantité totale
  const totalPriceElement = document.getElementById("totalPrice");
  totalPriceElement.innerHTML = totalPrice;

  const totalQuantityElement = document.getElementById("totalQuantity");
  totalQuantityElement.innerHTML = totalQuantity;

  
};

const orderForm = document.querySelector('.cart__order__form');

orderForm.addEventListener('submit', function(e) {
  // Empêcher la soumission du formulaire
  e.preventDefault();

    // Vérification si le panier est vide
    if (totalQuantity === 0) {
      // Affichage de l'alerte si le panier est vide
        alert("Votre panier est vide. Veuillez ajouter des articles avant de commander.");
      }

  // Récupérer les valeurs des champs
  const firstName = document.getElementById('firstName').value.trim();
  const lastName = document.getElementById('lastName').value.trim();
  const address = document.getElementById('address').value.trim();
  const city = document.getElementById('city').value.trim();
  const email = document.getElementById('email').value.trim();

  // Valider les champs
  const firstNameRegex = /^[a-zA-Z\sàéè-ô]*$/;
  const lastNameRegex = /^[a-zA-Z\sàéè-ô]*$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  let isValid = true;

  if (cartItems.length === 0) {
    isValid = false;
    alert("Votre panier est vide. Veuillez ajouter des articles avant de commander.");
  }

  if (!firstNameRegex.test(firstName)) {
    document.getElementById('firstNameErrorMsg').textContent = 'Le prénom ne peut contenir que des lettres et des espaces.';
    isValid = false;
  } else {
    document.getElementById('firstNameErrorMsg').textContent = '';
  }

  if (!lastNameRegex.test(lastName)) {
    document.getElementById('lastNameErrorMsg').textContent = 'Le nom ne peut contenir que des lettres et des espaces.';
    isValid = false;
  } else {
    document.getElementById('lastNameErrorMsg').textContent = '';
  }

  if (address === '') {
    document.getElementById('addressErrorMsg').textContent = 'Veuillez saisir votre adresse.';
    isValid = false;
  } else {
    document.getElementById('addressErrorMsg').textContent = '';
  }

  if (city === '') {
    document.getElementById('cityErrorMsg').textContent = 'Veuillez saisir votre ville.';
    isValid = false;
  } else {
    document.getElementById('cityErrorMsg').textContent = '';
  }

  if (!emailRegex.test(email)) {
    document.getElementById('emailErrorMsg').textContent = 'Veuillez saisir une adresse email valide.';
    isValid = false;
  } else {
    document.getElementById('emailErrorMsg').textContent = '';
  }

  // Si toutes les validations sont passées
  if (isValid) {
    // Créer un objet contact
    const contact = {
      firstName,
      lastName,
      address,
      city,
      email
    };

    // Créer un tableau de produits
    const products = [];

    const cartItems = document.querySelectorAll('.cart__item');
    cartItems.forEach(function(item) {
      const productId = item.dataset.id;
      products.push(
        productId
      );
    });

    // Envoi des données du formulaire au serveur via une requête AJAX
    fetch('http://localhost:3000/api/products/order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contact: contact,
        products: products
      })
    })
    .then(response => response.json())
    .then(data => {
      // Récupérer l'identifiant de commande depuis la réponse
      const orderId = data.orderId;
      localStorage.setItem("cart", JSON.stringify([]));
      // Rediriger l'utilisateur vers la page Confirmation avec l'id de commande dans l'URL
      window.location.href = 'confirmation.html?id=' + orderId;
    })
    .catch(error => {
      // Code à exécuter en cas d'erreur
      console.log("Une erreur est survenue : " + error);
      alert("Une erreur est survenue. Veuillez réessayer.");
    });
  }
});

