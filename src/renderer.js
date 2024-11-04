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
    const selectedColor = document.getElementById(`color-dropdown-${id}`)?.value || null;

    const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    const itemExists = wishlist.some(item => item.id === id && item.selectedColor === selectedColor);

    if (!itemExists) {
        wishlist.push({ id, name, image, price, selectedColor, quantity: 1 });
        localStorage.setItem("wishlist", JSON.stringify(wishlist));
        alert("Added to wishlist!");
    } else {
        alert("Item already in wishlist!");
    }
}

function removeFromWishlist(id) {
    let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    wishlist = wishlist.filter(item => item.id !== id);
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    initWishlistPage();
}

// Initialize Home Page
function initHomePage() {
    document.getElementById("search-btn").addEventListener("click", async () => {
        const brand = document.getElementById("brand").value;
        const maxPrice = document.getElementById("price").value;
        const apiUrl = `http://makeup-api.herokuapp.com/api/v1/products.json?brand=${brand}`;

        try {
            const response = await fetch(apiUrl);
            if (!response.ok) throw new Error('Network response was not ok');
            const products = await response.json();
            displayProducts(products, maxPrice);
        } catch (error) {
            console.error("Error fetching data:", error);
            alert("Error fetching products. Please try again later.");
        }
    });
}

function displayProducts(products, maxPrice) {
    const productList = document.getElementById("product-list");
    productList.innerHTML = "";

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
                    <p><strong>Price:</strong> ${product.price_sign || 'RM'}${product.price}</p>
                    <p><strong>Currency:</strong> ${product.currency || 'N/A'}</p>
                    <p><strong>Rating:</strong> ${product.rating || 'No rating available'}</p>
                    <p><strong>Type:</strong> ${product.product_type}</p>
                    ${generateColorOptions(product)}
                    <p><strong>Product Link:</strong> ${product.product_link ? `<a href="${product.product_link}" target="_blank">View Product</a>` : 'No product link available'}</p>
                    <button onclick="addToWishlist('${product.id}', '${product.name}', '${product.image_link}', '${product.price}')">Add to Wishlist</button>
                    <button onclick="toggleDetails(this)">View Details</button>
                    <div class="product-details" style="display: none;">
                        <p><strong>Description:</strong> ${product.description || 'No description available'}</p>
                        <p><strong>Website Link:</strong> ${product.website_link ? `<a href="${product.website_link}" target="_blank">Visit Website</a>` : 'No website link available'}</p>
                    </div>
                </div>
            `;
            productList.appendChild(productDiv);
        });
}

function generateColorOptions(product) {
    if (product.product_colors && product.product_colors.length > 0) {
        return `
            <div class="color-select" id="color-select-${product.id}">
                <label for="color-dropdown-${product.id}">Choose Color:</label>
                <select id="color-dropdown-${product.id}">
                    ${product.product_colors.map(color =>
                        `<option value="${color.hex_value}">${color.colour_name}</option>`
                    ).join('')}
                </select>
            </div>
        `;
    }
    return '';
}


// Initialize Wishlist Page
function initWishlistPage() {
    const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    const wishlistDiv = document.getElementById("wishlist");
    wishlistDiv.innerHTML = "";

    if (wishlist.length === 0) {
        wishlistDiv.innerHTML = "<p class='empty-message'>Your wishlist is currently empty.</p>";
    } else {
        wishlist.forEach(item => {
            const itemCard = document.createElement("div");
            itemCard.className = "wishlist-item-card";

            itemCard.innerHTML = `
                <div class="wishlist-item-content">
                    <img src="${item.image}" alt="${item.name}" class="wishlist-item-image">
                    <div class="wishlist-item-details">
                        <h3 class="wishlist-item-title">${item.name}</h3>
                        <p class="wishlist-item-price">Price:${item.price}</p>
                        <p><strong>Selected Color:</strong> <span class="wishlist-item-color">${item.selectedColor || 'No color selected'}</span></p>
                        <p><strong>Quantity:</strong> <span class="wishlist-item-quantity">${item.quantity || 1}</span></p>
                    </div>
                    <div class="wishlist-item-actions">
                        <button class="wishlist-action-btn edit-btn" onclick="showEditOptions('${item.id}')">Edit</button>
                        <button class="wishlist-action-btn remove-btn" onclick="removeFromWishlist('${item.id}')">Remove</button>
                    </div>
                </div>
                
                <div id="edit-options-${item.id}" class="wishlist-edit-options" style="display: none;">
                    <label for="quantity-${item.id}">Quantity:</label>
                    <input type="number" id="quantity-${item.id}" min="1" value="${item.quantity || 1}">
                    <div class="edit-buttons">
                        <button class="wishlist-action-btn save-btn" onclick="saveWishlistItem('${item.id}')">Save</button>
                        <button class="wishlist-action-btn cancel-btn" onclick="cancelEdit('${item.id}')">Cancel</button>
                    </div>
                </div>
            `;

            wishlistDiv.appendChild(itemCard);
        });

        const clearAllButton = document.createElement("button");
        clearAllButton.className = "wishlist-action-btn clear-btn";
        clearAllButton.textContent = "Clear All";
        clearAllButton.onclick = clearWishlist;
        wishlistDiv.appendChild(clearAllButton);
    }
}

function showEditOptions(itemId) {
    const currentEditOptions = document.getElementById(`edit-options-${itemId}`);
    if (currentEditOptions) {
        // Hide all other edit options before showing the current one
        document.querySelectorAll(".wishlist-edit-options").forEach(div => {
            if (div.id !== `edit-options-${itemId}`) div.style.display = "none";
        });
        // Toggle visibility for the selected item
        currentEditOptions.style.display = currentEditOptions.style.display === "block" ? "none" : "block";
    }
}

function cancelEdit(itemId) {
    document.getElementById(`edit-options-${itemId}`).style.display = "none";
}

function clearWishlist() {
    localStorage.removeItem("wishlist");
    initWishlistPage();
}

function saveWishlistItem(itemId) {
    const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    const itemIndex = wishlist.findIndex(item => item.id === itemId);

    if (itemIndex !== -1) {
        // Get updated quantity from the input field
        const updatedQuantity = parseInt(document.getElementById(`quantity-${itemId}`).value, 10) || 1;

        // Update the item in the wishlist
        wishlist[itemIndex].quantity = updatedQuantity;

        // Save the updated wishlist back to local storage
        localStorage.setItem("wishlist", JSON.stringify(wishlist));
        alert("Wishlist item updated!");
        initWishlistPage(); // Refresh the wishlist display
    }
}



// Initialize Product Page
function initProductPage() {
    const apiUrl = "https://makeup-api.herokuapp.com/api/v1/products.json";

    fetch(apiUrl)
        .then(response => response.json())
        .then(products => {
            const brandList = document.getElementById("brandList");
            brandList.innerHTML = "";

            const brands = [...new Set(products.map(product => product.brand).filter(Boolean))];

            brands.forEach(brand => {
                const listItem = document.createElement("li");
                listItem.innerHTML = `<span class="brand-name">${brand}</span>`;
                listItem.querySelector('.brand-name').addEventListener("click", () => {
                    displayBrandProducts(brand, products);
                });
                brandList.appendChild(listItem);
            });
        })
        .catch(error => console.error("Error fetching product data:", error));
}

function displayBrandProducts(brand, products) {
    const productList = document.getElementById("product-list");
    productList.innerHTML = "";

    const filteredProducts = products.filter(product => product.brand === brand);
    filteredProducts.forEach(product => {
        const productDiv = document.createElement("div");
        productDiv.className = "product";
        productDiv.innerHTML = `
            <img src="${product.image_link}" alt="${product.name}">
            <div>
                <h3>${product.name}</h3>
                <p><strong>Brand:</strong> ${product.brand}</p>
                <p><strong>Price:</strong> ${product.price_sign || 'RM'}${product.price}</p>
                <p><strong>Currency:</strong> ${product.currency}</p>
                ${generateColorOptions(product)}
                <button onclick="addToWishlist('${product.id}', '${product.name}', '${product.image_link}', '${product.price}')">Add to Wishlist</button>
            </div>
        `;
        productList.appendChild(productDiv);
    });
}

// Toggle product details
function toggleDetails(button) {
    const detailsDiv = button.nextElementSibling;
    detailsDiv.style.display = detailsDiv.style.display === "none" ? "block" : "none";
}
