// Function to calculate the total cart price
const calculateTotalPrice = () => { 
    let cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    let totalPrice = 0;

    // Sum up the subtotals of all products in the cart
    cartItems.forEach(item => {
        totalPrice += item.price * item.quantity;
    });

    // Display the total price in the checkout summary
    const totalPriceElement = document.querySelector('.cr-checkout-summary .text-right');
    totalPriceElement.textContent = `${totalPrice} RSD`;

    // Select the container where you want to display the total price
    const totalPriceWithShippingElement = document.querySelector('.cr-checkout-summary-total span.text-right');

    // Display the total price in the specified element
    totalPriceWithShippingElement.textContent = `${totalPrice} RSD`;
};

// Call the function to update the total price
calculateTotalPrice();

// Function to display products in the cart
const displayCartItems = () => {
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    const cartContainer = document.querySelector('.cr-checkout-pro'); // Assuming this is your container

    // Clear the current contents of the cart
    cartContainer.innerHTML = '';

    // Loop through the cart items and generate HTML for each
    cartItems.forEach((item) => {
        const productHTML = `
            <div class="w-full mb-[15px]">
                <div class="cr-product-inner flex flex-row items-center">
                    <div class="cr-pro-image-outer w-[80px] mr-[15px]">
                        <div class="cr-pro-image overflow-hidden">
                            <a href="product-left-sidebar.html" class="image">
                                <img class="main-image" src="${item.image}" alt="${item.name}" class="w-full">
                            </a>
                        </div>
                    </div>
                    <div class="cr-pro-content cr-product-details justify-start w-[calc(100%-143px)] p-[0] flex flex-col border-[0]">
                        <h5 class="cr-pro-title text-left mb-[.5rem] pr-[15px] text-[15px] leading-[1.2] max-[1199px]:mb-[0]">
                            <a href="product-left-sidebar.html" class="text-[15px] text-[#000] font-medium leading-[1.2]">${item.name}</a>
                        </h5>
                        <p class="cr-price font-Poppins text-[16px] leading-[1.75] text-[#7a7a7a] text-left max-[1199px]:text-[14px]">
                            <span class="new-price text-[#64b496] font-bold">${item.price} RSD</span>
                        </p>
                        <p class="quantity text-[14px] text-[#555]">Količina: ${item.quantity}</p>
                    </div>
                </div>
            </div>
        `;

        // Append the product HTML to the cart container
        cartContainer.insertAdjacentHTML('beforeend', productHTML);
    });
};

// Call the function to display cart items
displayCartItems();

document.querySelector('.cr-check-order-btn a').addEventListener('click', async (event) => {
    const submitButton = event.target;

    // If button is "disabled", prevent the request
    if (submitButton.classList.contains("pointer-events-none")) {
        return;  // Stop execution if the button is disabled
    }

    event.preventDefault();  // Prevent the default behavior

    // Get the form element
    const form = document.getElementById('checkout-form');

    // Collect form data
    const formData = new FormData(form);

    // Convert form data to an object
    const data = {};
    formData.forEach((value, key) => {
        data[key] = value;
    });

    // Convert cart items (from localStorage) into an array
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    data.cartItems = cartItems;

    // Send data to the server via fetch
    try {
        const response = await fetch('submit_order.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (result.success) {
            showOrderPopup('Hvala na porudžbini!', 'Vaša porudžbina je uspešno zabeležena. Uskoro ćete dobiti potvrdu poružbine na mejl adresi.');
            localStorage.removeItem('cart');  // Clear cart after successful submission
        } else {
            console.error(result.error);
        }
    } catch (error) {
        console.error('Greška prilikom naručivanja:', error);
    }

    function showOrderPopup(title, message) {
        const popup = document.getElementById('order-popup');
        const popupTitle = document.getElementById('popup-title2');
        const popupMessage = document.getElementById('popup-message2');
        const closePopupButton = document.getElementById('close-order-popup');

        popupTitle.textContent = title;
        popupMessage.textContent = message;
        popup.classList.remove('hidden'); // Show the popup

        closePopupButton.addEventListener('click', () => {
            window.location.href = 'index.html';
        });
    }
});

document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("checkout-form");
    const submitButton = document.querySelector(".cr-check-order-btn a");

    function checkInputs() {
      const inputs = form.querySelectorAll("input[required]");
      let allFilled = true;

      inputs.forEach(input => {
        if (input.value.trim() === "") {
          allFilled = false;
        }
      });

      if (allFilled) {
        submitButton.classList.remove("pointer-events-none", "opacity-50");
        submitButton.removeAttribute("disabled");
      } else {
        submitButton.classList.add("pointer-events-none", "opacity-50");
        submitButton.setAttribute("disabled", "true");
      }
    }

    // Add event listeners to all required inputs
    form.querySelectorAll("input[required]").forEach(input => {
      input.addEventListener("input", checkInputs);
    });

    // Initialize button state
    checkInputs();
});