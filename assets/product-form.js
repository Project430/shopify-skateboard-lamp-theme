class ProductForm extends HTMLFormElement {
  constructor() {
    super();
    this.addEventListener('submit', this.onSubmit.bind(this));
  }

  async onSubmit(evt) {
    evt.preventDefault();
    
    const submitButton = this.querySelector('[type="submit"]');
    const variantId = this.querySelector('[name="id"]').value;
    
    // Check inventory availability
    const inventory = window.variantInventory[variantId];
    if (!inventory || !inventory.available || 
        (inventory.inventory_management && 
         inventory.inventory_quantity <= 0 && 
         inventory.inventory_policy !== 'continue')) {
      return;
    }

    if (submitButton.disabled) {
      return;
    }

    submitButton.classList.add('loading');
    submitButton.disabled = true;

    try {
      const formData = new FormData(this);
      const response = await fetch('/cart/add.js', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.description || 'Network response was not ok');
      }
      
      window.location.href = '/cart';
      
    } catch (error) {
      console.error('Error:', error);
      
      // Add error message to the form
      const errorContainer = this.querySelector('.form-error') || document.createElement('p');
      errorContainer.className = 'form-error mt-3 text-sm text-red-600';
      errorContainer.textContent = error.message;
      if (!this.querySelector('.form-error')) {
        submitButton.parentNode.insertAdjacentElement('afterend', errorContainer);
      }
      
      submitButton.classList.remove('loading');
      submitButton.disabled = false;
    }
  }
}

customElements.define('product-form', ProductForm, { extends: 'form' });