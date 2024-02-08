// Récupération de l'ID du produit à partir de la requête GET
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const productId = urlParams.get("id");

async function afficherProduit() {
  // Récupération des données du produit correspondant à l'ID
    const product = await fetch(`http://localhost:3000/api/products/${productId}`)
    .then(response => { 
      if(!response.ok) {
        if(response.status === 404) {
          throw new Error("Produit non trouvé.");
        }
        else {
          throw new Error("Une erreur s'est produite, veuillez recharger la page.");
        }
      }
      return response.json();
    })
    .catch((e) => {
      if(e.message === "Produit non trouvé.") {
        alert(e.message);
      }
      else {
        alert("Une erreur s'est produite, veuillez recharger la page.")
      }
      return null;
    });
    console.log(product);
    if (product) {

    const productImageItem = document.createElement("img");
    document.querySelector(".item__img").appendChild(productImageItem);
  
    // Récupération des éléments HTML où les données du produit seront affichées
      const productName = document.getElementById("title");
      const productImage = document.querySelector(".item__img img");
      const productDescription = document.getElementById("description");
      const productPrice = document.getElementById("price");
      const productColors = document.getElementById("colors");
      const productQuantity = document.getElementById("quantity");
  
    // Ajout des informations du produit aux éléments HTML correspondants
      productName.textContent = product.name;
      productImage.src = product.imageUrl;
      productImage.alt = `Image de ${product.name}`;
      productDescription.textContent = product.description;
      productPrice.textContent = product.price;
  
    // Ajout des couleurs disponibles pour le produit dans la liste déroulante
      product.colors.forEach(color => {
      const option = document.createElement("option");
      option.value = color;
      option.textContent = color;
      productColors.appendChild(option);
    });
    
    const addToCartButton = document.getElementById("addToCart");
    addToCartButton.addEventListener("click", addToCart);
        
  } else {
    // Une erreur s'est produite lors de la récupération des données
    console.error("Impossible de récupérer les données du produit");
  }
}

const addToCart = () => {
  const selectedQuantity = parseInt(document.getElementById("quantity").value);

  if (selectedQuantity < 1 || selectedQuantity > 100) {
    alert("La quantité doit être comprise entre 1 et 100.");
    return;
  }

  const selectedColor = document.getElementById("colors").value;

  // Vérification si la quantité ou la couleur est renseignée
  if (!selectedQuantity || !selectedColor) {
    alert("Veuillez sélectionner une quantité et une couleur.");
  return;
  }

  const productToAdd = {
  id: productId,
  quantity: selectedQuantity,
  color: selectedColor
  };

  let cartItems = JSON.parse(localStorage.getItem("cart")) || [];
  const existingCartItemIndex = cartItems.findIndex(item => item.id === productId && item.color === selectedColor);

  if (existingCartItemIndex !== -1) {
  cartItems[existingCartItemIndex].quantity += selectedQuantity;
  } else {
  cartItems.push(productToAdd);
  }

  localStorage.setItem("cart", JSON.stringify(cartItems));
}
  
afficherProduit()

