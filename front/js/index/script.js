async function afficherProduits() {

  const products = await fetch("http://localhost:3000/api/products")
    .then(response => response.json())
    .catch(()=> {
      alert("Une erreur s'est produite, veuillez recharger la page")
      return []
    })

    console.log(products);
  // Récupération de l'élément parent où les produits seront affichés
  const productsContainer = document.getElementById("items");

  // Boucle qui va traverser chaque produit
  for(let i = 0; i < products.length; i++) {

    //Récupération des informations du produit
    const product = products[i];
    const productId = product._id;
    const productName = product.name;
    const productImage = product.imageUrl;
    const productDescription = product.description;

    // Création des éléments HTML pour chaque produit
    const containerProduct = document.createElement("article");
    const containerId = document.createElement("a");
    const containerName = document.createElement("h3");
    const containerImage = document.createElement("img");
    const containerDescription = document.createElement("p");

    //Ajout des informations du produit aux éléments HTML correspondants
    containerId.dataset.id = productId;
    containerName.textContent = productName;
    containerImage.src = productImage;
    containerImage.alt = `Image de ${productName}`; // Ajout du texte alternatif
    containerDescription.textContent = productDescription;
    containerDescription.classList.add("productDescription");
    containerName.classList.add("productName");
    containerId.setAttribute("href", `product.html?id=${productId}`)


    containerProduct.appendChild(containerImage);
    containerProduct.appendChild(containerName);
    containerProduct.appendChild(containerDescription);
    containerId.appendChild(containerProduct)
    productsContainer.appendChild(containerId);
  }
  
}

afficherProduits()

