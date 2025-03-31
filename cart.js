// Function to remove a product from the cart
const removeFromCart = (productId) => {
    let cartItems = JSON.parse(localStorage.getItem('cart')) || []; // Retrieve cart from localStorage

    // Filter out the product with the given ID
    cartItems = cartItems.filter(item => item.id !== productId);

    // Update localStorage with the new cart array
    localStorage.setItem('cart', JSON.stringify(cartItems));

    // Re-render the cart
    displayCartProducts();
};

// Event listener for remove buttons
const setupRemoveButtons = () => {
    const removeButtons = document.querySelectorAll('.cr-cart-remove a'); // Select all remove buttons

    // Add event listeners to each remove button
    removeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const productId = button.getAttribute('data-id'); // Get the product ID from data-id
            removeFromCart(productId); // Call removeFromCart with the product ID
        });
    });
};

// Function to update the quantity of a product in the cart
const updateCartQuantity = (productId, newQuantity) => {
    let cartItems = JSON.parse(localStorage.getItem('cart')) || [];

    // Find the product and update its quantity
    cartItems = cartItems.map(item => {
        if (item.id === productId) {
            item.quantity = newQuantity;
        }
        return item;
    });

    // Update localStorage with the new cart array
    localStorage.setItem('cart', JSON.stringify(cartItems));

    // Re-render the cart
    displayCartProducts();
};

// Function to calculate the total cart price
const calculateTotalPrice = () => { 
    let cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    let totalPrice = 0;

    // Sum up the subtotals of all products in the cart
    cartItems.forEach(item => {
        totalPrice += item.price * item.quantity;
    });

    // Update the total price displayed in the table
    const totalPriceElement = document.getElementById('total-price');
    totalPriceElement.textContent = `${totalPrice} RSD`;
};

// Call the function to update the total price whenever the page loads or cart items change
calculateTotalPrice();

// Event listener for updating quantity via input or buttons
const setupQuantityHandlers = () => {
    const plusButtons = document.querySelectorAll('.plus');
    const minusButtons = document.querySelectorAll('.minus');
    const quantityInputs = document.querySelectorAll('.quantity');

    // Handle clicking the "+" button
    plusButtons.forEach(button => {
        button.addEventListener('click', () => {
            const productId = button.getAttribute('data-id');
            const quantityInput = button.nextElementSibling; // The input next to the "+" button
            let newQuantity = parseInt(quantityInput.value) + 1;
            
            // Update the quantity in the input and in localStorage
            quantityInput.value = newQuantity;
            updateCartQuantity(productId, newQuantity);
        });
    });

    // Handle clicking the "-" button
    minusButtons.forEach(button => {
        button.addEventListener('click', () => {
            const productId = button.getAttribute('data-id');
            const quantityInput = button.previousElementSibling; // The input next to the "-" button
            let newQuantity = parseInt(quantityInput.value) - 1;
            
            // Ensure the quantity is at least 1
            if (newQuantity < 1) newQuantity = 1;

            // Update the quantity in the input and in localStorage
            quantityInput.value = newQuantity;
            updateCartQuantity(productId, newQuantity);
        });
    });

    // Handle typing in the quantity input
    quantityInputs.forEach(input => {
        input.addEventListener('input', () => {
            const productId = input.closest('tr').querySelector('.plus').getAttribute('data-id');
            let newQuantity = parseInt(input.value);

            // Ensure the quantity is at least 1
            if (isNaN(newQuantity) || newQuantity < 1) newQuantity = 1;
            input.value = newQuantity;

            // Update the quantity in localStorage
            updateCartQuantity(productId, newQuantity);
        });
    });
};

// Function to display products in the cart (with quantity handlers setup)
const displayCartProducts = () => {
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    const cartTableBody = document.querySelector('#cart-table-body'); // Assuming there's a <tbody> with this ID

    // Clear the current contents of the cart
    cartTableBody.innerHTML = '';

    // Loop through the cart items and generate HTML for each
    cartItems.forEach((item) => {
        const productHTML = `
            <tr class="border-b-[1px] border-solid border-[#e9e9e9]">
                <!-- Proizvod - sakriven na malim ekranima -->
                <td class="hidden sm:table-cell cr-cart-name w-[30%] py-[15px] px-[10px] text-[#444] text-[14px] text-left bg-[#f7f7f8]">
                    <a href="javascript:void(0)" class="text-[#444] font-medium text-xs sm:text-[14px] flex leading-[1.5] tracking-[0.6px] items-center">
                        ${item.name}
                    </a>
                </td>
                <!-- Cena -->
                <td class="cr-cart-price py-[15px] px-[10px] text-[#555] text-xs sm:text-[15px] font-medium text-left bg-[#f7f7f8]">
                    <span class="amount">${item.price} RSD</span>
                </td>
                <!-- Količina -->
                <td class="cr-cart-qty py-[15px] px-[10px] text-[#444] text-xs sm:text-[15px] text-center bg-[#f7f7f8]">
                    <div class="cart-qty-plus-minus w-[70px] h-[28px] relative flex bg-[#fff] border border-[#e9e9e9] rounded-[5px] items-center justify-between">
                        <button type="button" class="plus h-[25px] w-[25px] bg-transparent flex justify-center items-center" data-id="${item.id}">+</button>
                        <input type="text" value="${item.quantity}" class="quantity w-[20px] text-center text-xs sm:text-[14px] font-semibold outline-none">
                        <button type="button" class="minus h-[25px] w-[25px] bg-transparent flex justify-center items-center" data-id="${item.id}">-</button>
                    </div>
                </td>
                <!-- Ukupno -->
                <td class="cr-cart-subtotal py-[15px] px-[10px] text-[#555] font-medium text-xs sm:text-[15px] text-left bg-[#f7f7f8]">
                    ${item.price * item.quantity} RSD
                </td>
                <!-- Brisanje -->
                <td class="cr-cart-remove py-[15px] px-[10px] w-[50px] sm:w-[90px] text-[#555] text-right bg-[#f7f7f8]">
                    <a href="javascript:void(0)" class="transition-all duration-300 ease-in-out text-[#555] hover:text-[#fb5555]" data-id="${item.id}">
                        <i class="ri-delete-bin-line text-[18px] sm:text-[22px]"></i>
                    </a>
                </td>
            </tr>
            `;

        // Append the product HTML to the cart table body
        cartTableBody.insertAdjacentHTML('beforeend', productHTML);
    });

    // Setup remove button functionality after rendering
    setupRemoveButtons();

    // Setup quantity handlers for the inputs and buttons
    setupQuantityHandlers();

    // Calculate and display the total price
    calculateTotalPrice();
};

// Call the function to display the cart products
displayCartProducts();

// Listen for changes in quantity inputs
document.querySelectorAll('.quantity-input').forEach(input => {
    input.addEventListener('change', (event) => {
        const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
        const productId = event.target.dataset.productId; // Assume each input has a data-product-id attribute

        // Update the quantity in localStorage
        cartItems.forEach(item => {
            if (item.id === productId) {
                item.quantity = parseInt(event.target.value);
            }
        });

        // Save updated cart back to localStorage
        localStorage.setItem('cart', JSON.stringify(cartItems));

        // Recalculate total price
        calculateTotalPrice();
    });
});