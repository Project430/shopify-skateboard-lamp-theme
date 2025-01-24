import React, { useState, useEffect } from 'react';
import { useShopify } from '@shopify/hydrogen-react';
import { Recycle, Heart, Package, ShoppingCart } from 'lucide-react';

export function ProductPage() {
  const { product, selectedVariant, setSelectedVariant } = useShopify();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (product) setIsLoading(false);
  }, [product]);

  if (isLoading) return <div>Loading...</div>;

  return (
    <main className="w-full min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-x-8 lg:items-start">
          <div className="aspect-w-1 aspect-h-1 w-full">
            <img
              src={product.images[0]?.src}
              alt={product.images[0]?.alt || product.title}
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
          <div className="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              {product.title}
            </h1>
            <div className="mt-3">
              <h2 className="sr-only">Product information</h2>
              <p className="text-3xl tracking-tight text-gray-900">
                {selectedVariant.price.amount} {selectedVariant.price.currencyCode}
              </p>
            </div>

            {product.options.map((option) => (
              <div key={option.name} className="mt-6">
                <h3 className="text-sm font-medium text-gray-900">{option.name}</h3>
                <div className="mt-2">
                  <div className="flex flex-wrap gap-2">
                    {option.values.map((value) => (
                      <button
                        key={value}
                        onClick={() => setSelectedVariant({ [option.name]: value })}
                        className={`px-4 py-2 rounded-md ${
                          selectedVariant.selectedOptions[option.name] === value
                            ? 'bg-gray-900 text-white'
                            : 'bg-gray-200 text-gray-900'
                        }`}
                      >
                        {value}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}

            <div className="mt-8">
              <button 
                onClick={() => {
                  const cart = window.Shopify.checkout.getCart();
                  cart.addItem(selectedVariant.id, 1);
                }}
                className="w-full bg-gray-900 text-white px-6 py-3 rounded-md flex items-center justify-center space-x-2 hover:bg-gray-800 transition-colors"
              >
                <ShoppingCart className="w-5 h-5" />
                <span>Add to Cart</span>
              </button>
            </div>

            <div className="mt-10">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {/* Features section remains the same */}
              </div>
            </div>

            <div className="mt-10 prose prose-sm">
              <h3 className="text-lg font-medium text-gray-900">Description</h3>
              <div className="mt-4 space-y-6" 
                dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
