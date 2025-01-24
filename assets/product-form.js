class ProductForm extends HTMLElement {
  constructor() {
    super();
    this.form = this.querySelector('form');
    this.variantsData = JSON.parse(this.dataset.variants);
    this.optionSelectors = this.querySelectorAll('.option-selector');
    this.variantIdInput = this.querySelector('input[name="id"]');
    this.productImage = this.querySelector('.product-image');
    this.priceElement = this.querySelector('.product-price');
    
    this.optionSelectors.forEach(selector => {
      selector.addEventListener('change', this.onVariantChange.bind(this));
    });
    
    this.form.addEventListener('submit', this.onSubmit.bind(this));
  }

  getCurrentOptions() {
    const options = [];
    this.optionSelectors.forEach(selector => {
      const checkedInput = selector.querySelector('input[type="radio"]:checked');
      options.push(checkedInput ? checkedInput.value : null);
    });
    return options;
  }

  findVariantByOptions(selectedOptions) {
    return this.variantsData.find(variant => 
      variant.options.every((option, index) => option === selectedOptions[index])
    );
  }

  onVariantChange(event) {
    const selectedOptions = this.getCurrentOptions();
    const variant = this.findVariantByOptions(selectedOptions);
    
    if (!variant) return;

    // Update URL
    window.history.replaceState({}, '', `${this.dataset.url}?variant=${variant.id}`);
    
    // Update form ID
    this.variantIdInput.value = variant.id;
    
    // Update price
    this.priceElement.textContent = new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(variant.price / 100);

    // Update image if variant has one
    if (variant.featured_image) {
      this.productImage.src = variant.featured_image.src;
    }

    // Update button state
    const submitButton = this.querySelector('[type="submit"]');
    if (variant.available) {
      submitButton.disabled = false;
      submitButton.querySelector('.loading\\:hidden').textContent = 'Add to Cart';
    } else {
      submitButton.disabled = true;
      submitButton.querySelector('.loading\\:hidden').textContent = 'Sold Out';
    }
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
      
      // Redirect to cart page after successful addition
      window.location.href = '/cart';
      
    } catch (error) {
      console.error('Error:', error);
      submitButton.classList.remove('loading');
      submitButton.disabled = false;
    }
  }
}

customElements.define('product-form', ProductForm);