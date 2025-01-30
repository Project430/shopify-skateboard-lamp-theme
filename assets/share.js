if (!customElements.get('share-button')) {
  customElements.define(
    'share-button',
    class ShareButton extends HTMLElement {
      constructor() {
        super();

        this.mainDetailsToggle = this.querySelector('details');
        this.shareButton = this.querySelector('button');
        this.buttonLabel = this.querySelector('.share-button__button');
        this.fallbackButton = this.querySelector('.share-button__fallback');
        this.fallbackButton?.querySelector('button')?.addEventListener('click', () => {
          this.copyToClipboard(this.fallbackButton.querySelector('input'));
        });

        if (navigator.share) {
          this.mainDetailsToggle.addEventListener('toggle', () => {
            if (!this.mainDetailsToggle.open) return;
            this.shareButton.click();
          });

          this.shareButton.addEventListener('click', () => {
            navigator.share({ url: document.location.href, title: document.title });
            this.mainDetailsToggle.removeAttribute('open');
          });
        } else {
          this.mainDetailsToggle.addEventListener('toggle', () => {
            if (!this.mainDetailsToggle.open) return;
            this.fallbackButton.querySelector('input')?.select();
          });
        }
      }

      copyToClipboard(button) {
        navigator.clipboard.writeText(button.value).then(() => {
          button.focus();
          this.fallbackButton.setAttribute('success', '');
          this.fallbackButton.querySelector('.share-button__copy')?.setAttribute('hidden', '');
          this.fallbackButton.querySelector('.share-button__close')?.removeAttribute('hidden');
        });
      }
    }
  );
}