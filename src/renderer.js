document.addEventListener("DOMContentLoaded", () => {
    const currentPage = window.location.pathname;

    if (currentPage.includes("index.html")) {
        initHomePage();
    } else if (currentPage.includes("wishlist.html")) {
        initWishlistPage();
    } else if (currentPage.includes("products.html")) {
        initProductPage();
    }
});

// Shared Functions
function addToWishlist(id, name, image, price) {
    const wishlistItem = { id, name, image, price };
    let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    wishlist.push(wishlistItem);
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    alert("Added to wishlist!");
}

function removeFromWishlist(id) {
    let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    wishlist = wishlist.filter(item => item.id !== id);
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    location.reload();
}

// Page-specific initializations
function initHomePage() {
    document.getElementById("search-btn").addEventListener("click", async () => {
        const brand = document.getElementById("brand").value;
        const maxPrice = document.getElementById("price").value;
        const apiUrl = `http://makeup-api.herokuapp.com/api/v1/products.json?brand=${brand}`;

        try {
            const response = await fetch(apiUrl);
            const products = await response.json();
            displayProducts(products, maxPrice);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    });

    function displayProducts(products, maxPrice) {
        const productList = document.getElementById("product-list");
        productList.innerHTML = ""; // Clear previous results

        products
            .filter(product => !maxPrice || parseFloat(product.price) <= parseFloat(maxPrice))
            .forEach(product => {
                const productDiv = document.createElement("div");
                productDiv.className = "product";
                productDiv.innerHTML = `
                    <img src="${product.image_link}" alt="${product.name}">
                    <div>
                        <h3>${product.name}</h3>
                        <p><strong>Brand:</strong> ${product.brand}</p>
                        <p><strong>Price:</strong> RM${product.price}</p>
                        <button onclick="addToWishlist('${product.id}', '${product.name}', '${product.image_link}', '${product.price}')">Add to Wishlist</button>
                    </div>
                `;
                productList.appendChild(productDiv);
            });
    }
}

function toggleDetails(productId) {
    const detailsDiv = document.getElementById(`details-${productId}`);
    if (detailsDiv.style.display === "none") {
        detailsDiv.style.display = "block"; // Show details
    } else {
        detailsDiv.style.display = "none"; // Hide details
    }
}

function initWishlistPage() {
    const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    const wishlistDiv = document.getElementById("wishlist");

    if (wishlist.length === 0) {
        wishlistDiv.innerHTML = "<p>Your wishlist is empty.</p>";
    } else {
        wishlist.forEach(item => {
            const itemDiv = document.createElement("div");
            itemDiv.className = "wishlist-item";
            itemDiv.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div>
                    <h3>${item.name}</h3>
                    <p>Price: RM${item.price}</p>
                    <button onclick="removeFromWishlist('${item.id}')">Remove</button>
                </div>
            `;
            wishlistDiv.appendChild(itemDiv);
        });
    }
}

// Function for initializing the Products page
function initProductPage() {
    const apiUrl = "https://makeup-api.herokuapp.com/api/v1/products.json?brand=maybelline";

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(products => {
            console.log(products); // Debugging line to check fetched products
            displayProducts(products);
        })
        .catch(error => console.error("Error fetching data:", error));
}

function displayProducts(products) {
    const productList = document.getElementById("product-list");
    productList.innerHTML = ""; // Clear previous content if any

    // Display all products
    products.forEach(product => {
        const productDiv = document.createElement("div");
        productDiv.className = "product";
        productDiv.innerHTML = `
            <img src="${product.image_link}" alt="${product.name}">
            <div>
                <h3>${product.name}</h3>
                <p><strong>Brand:</strong> ${product.brand}</p>
                <p><strong>Price:</strong> RM${product.price}</p>
                <button onclick="addToWishlist('${product.id}', '${product.name}', '${product.image_link}', '${product.price}')">Add to Wishlist</button>
                <button onclick="toggleDetails(this)">View Details</button>
                <div class="product-details" style="display: none;">
                    <p><strong>Description:</strong> ${product.description ? product.description : 'No description available'}</p>
                </div>
            </div>
        `;
        productList.appendChild(productDiv);
    });
}

// Function to toggle product details visibility
function toggleDetails(button) {
    const detailsDiv = button.nextElementSibling; // Get the next sibling (the details div)
    if (detailsDiv.style.display === "none") {
        detailsDiv.style.display = "block"; // Show the details
    } else {
        detailsDiv.style.display = "none"; // Hide the details
    }
}

// Initialize the product page when the window loads
window.onload = initProductPage;   
