// Main theme JavaScript file

document.addEventListener('DOMContentLoaded', function() {
  // Handle smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // Initialize product image zoom if available
  const productImages = document.querySelectorAll('.product-image-zoom');
  if (productImages.length > 0) {
    productImages.forEach(image => {
      image.addEventListener('mousemove', function(e) {
        const { left, top, width, height } = this.getBoundingClientRect();
        const x = (e.clientX - left) / width;
        const y = (e.clientY - top) / height;
        
        this.style.transformOrigin = `${x * 100}% ${y * 100}%`;
      });
      
      image.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.5)';
      });
      
      image.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
      });
    });
  }

  // Add to cart functionality
  const addToCartForms = document.querySelectorAll('form[action="/cart/add"]');
  addToCartForms.forEach(form => {
    form.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      try {
        const formData = new FormData(form);
        const response = await fetch('/cart/add.js', {
          method: 'POST',
          body: formData
        });
        
        if (!response.ok) throw new Error('Network response was not ok');
        
        const result = await response.json();
        
        // Show success message
        const successMessage = document.createElement('div');
        successMessage.classList.add('fixed', 'bottom-4', 'right-4', 'bg-green-500', 'text-white', 'px-6', 'py-3', 'rounded-lg', 'shadow-lg');
        successMessage.textContent = 'Added to cart successfully!';
        document.body.appendChild(successMessage);
        
        // Remove message after 3 seconds
        setTimeout(() => {
          successMessage.remove();
        }, 3000);
        
        // Update cart count
        updateCartCount();
        
      } catch (error) {
        console.error('Error:', error);
        // Show error message
        const errorMessage = document.createElement('div');
        errorMessage.classList.add('fixed', 'bottom-4', 'right-4', 'bg-red-500', 'text-white', 'px-6', 'py-3', 'rounded-lg', 'shadow-lg');
        errorMessage.textContent = 'Error adding to cart. Please try again.';
        document.body.appendChild(errorMessage);
        
        // Remove message after 3 seconds
        setTimeout(() => {
          errorMessage.remove();
        }, 3000);
      }
    });
  });

  // Update cart count
  async function updateCartCount() {
    try {
      const response = await fetch('/cart.js');
      const cart = await response.json();
      const cartCount = document.querySelector('.cart-count');
      if (cartCount) {
        cartCount.textContent = cart.item_count;
      }
    } catch (error) {
      console.error('Error updating cart count:', error);
    }
  }

  // Initialize cart count on page load
  updateCartCount();
});