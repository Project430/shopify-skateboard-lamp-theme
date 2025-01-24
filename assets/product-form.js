class ProductForm extends HTMLElement {
  constructor() {
    super();
    this.form = this.querySelector('form');
    this.form.addEventListener('submit', this.onSubmit.bind(this));
  }

  async onSubmit(evt) {
    evt.preventDefault();
    
    const submitButton = this.querySelector('[type="submit"]');
    submitButton.classList.add('loading');
    submitButton.disabled = true;

    try {
      const formData = new FormData(this.form);
      const response = await fetch('/cart/add.js', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: [{
            id: formData.get('id'),
            quantity: formData.get('quantity') || 1
          }]
        })
      });

      const data = await response.json();
      
      if (!response.ok) throw new Error(data.description || 'Error adding to cart');
      
      // Refresh cart count or show success message here
      window.location.href = '/cart';
      
    } catch (error) {
      console.error('Error:', error);
      // Show error message to user
      alert(error.message);
    } finally {
      submitButton.classList.remove('loading');
      submitButton.disabled = false;
    }
  }
}

customElements.define('product-form', ProductForm);