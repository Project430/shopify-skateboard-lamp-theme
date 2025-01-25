class ProductForm extends HTMLFormElement {
  constructor() {
    super();
    this.addEventListener('submit', this.onSubmit.bind(this));
  }

  async onSubmit(evt) {
    evt.preventDefault();
    
    const submitButton = this.querySelector('[type="submit"]');
    const variantId = this.querySelector('[name="id"]').value;
    const variant = window.variants.find(v => v.id.toString() === variantId);

    // Check if variant exists and is available
    if (!variant || !variant.available || submitButton.disabled) {
      console.log('Variant not available');
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

      if (!response.ok) throw new Error('Network response was not ok');
      
      window.location.href = '/cart';
      
    } catch (error) {
      console.error('Error:', error);
      submitButton.classList.remove('loading');
      submitButton.disabled = false;
    }
  }
}

customElements.define('product-form', ProductForm, { extends: 'form' });