class ProductForm extends HTMLElement {
  constructor() {
    super();
    this.form = this.querySelector('form');
    this.variantSelectors = this.querySelectorAll('input[type="radio"]');
    this.variantJson = JSON.parse(this.querySelector('[type="application/json"]').textContent);

    this.variantSelectors.forEach(selector => 
      selector.addEventListener('change', this.onVariantChange.bind(this))
    );
    
    this.form.addEventListener('submit', this.onSubmit.bind(this));
  }

  onVariantChange() {
    const selectedOptions = Array.from(this.variantSelectors)
      .filter(input => input.checked)
      .map(input => ({ value: input.value, name: input.name.replace('options[', '').replace(']', '') }));

    const selectedVariant = this.variantJson.find(variant => {
      return selectedOptions.every(option => 
        variant.options[variant.options.indexOf(option.name)] === option.value
      );
    });

    if (!selectedVariant) return;

    this.updatePrice(selectedVariant);
    this.updateURL(selectedVariant);
    this.updateFormID(selectedVariant);
  }

  updatePrice(variant) {
    const price = new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(variant.price / 100);
    
    this.querySelector('.product-price').textContent = price;
  }

  updateURL(variant) {
    if (!variant) return;
    window.history.replaceState({ }, '', `${this.dataset.url}?variant=${variant.id}`);
  }

  updateFormID(variant) {
    const input = this.querySelector('input[name="id"]');
    input.value = variant.id;
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
        body: formData
      });

      if (!response.ok) throw new Error('Network response was not ok');
      
      const cart = await response.json();
      this.dispatchEvent(new CustomEvent('cart:updated', { detail: cart }));
      
      submitButton.classList.remove('loading');
      submitButton.disabled = false;
    } catch (error) {
      console.error('Error:', error);
      submitButton.classList.remove('loading');
      submitButton.disabled = false;
    }
  }
}

customElements.define('product-form', ProductForm);