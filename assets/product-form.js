class ProductForm extends HTMLFormElement {
  constructor() {
    super();
    this.addEventListener('submit', this.onSubmit.bind(this));
  }

  async onSubmit(evt) {
    evt.preventDefault();
    
    const submitButton = this.querySelector('[type="submit"]');
    const variantId = this.querySelector('[name="id"]').value;
    
    // Find selected options
    const selects = this.querySelectorAll('select[name^="options["]');
    const selectedOptions = Array.from(selects).map(select => select.value);
    
    // Check if selected variant is available
    const selectedVariant = window.variants.find(variant => 
      variant.id.toString() === variantId && 
      variant.options.every((option, index) => option === selectedOptions[index])
    );

    if (!selectedVariant || !selectedVariant.available) {
      submitButton.disabled = true;
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