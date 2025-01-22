// Etsy Review Scraper
import puppeteer from 'puppeteer';

async function scrapeEtsyReviews(shopUrl) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(`${shopUrl}/reviews`);

  // Wait for reviews to load
  await page.waitForSelector('.reviews-card');

  const reviews = await page.evaluate(() => {
    const reviewCards = document.querySelectorAll('.reviews-card');
    return Array.from(reviewCards).map(card => {
      const rating = card.querySelector('.stars')?.getAttribute('data-rating');
      const reviewText = card.querySelector('.review-text')?.textContent.trim();
      const reviewer = card.querySelector('.reviewer-name')?.textContent.trim();
      const date = card.querySelector('.review-date')?.textContent.trim();
      const location = card.querySelector('.reviewer-location')?.textContent.trim();
      const imageUrl = card.querySelector('.reviewer-img')?.getAttribute('src');

      return {
        rating: parseInt(rating) || 5,
        text: reviewText,
        author: reviewer,
        date,
        location,
        imageUrl
      };
    });
  });

  await browser.close();
  return reviews;
}

// Function to format reviews for Shopify
function formatForShopify(reviews) {
  return reviews.map((review, index) => ({
    type: "testimonial",
    settings: {
      testimonial: review.text,
      author_name: review.author,
      author_location: review.location,
      rating: review.rating,
      date: review.date,
      review_image_url: review.imageUrl
    }
  }));
}

// Main function to run the scraper
async function main() {
  try {
    // Replace with your Etsy shop URL
    const shopUrl = process.env.ETSY_SHOP_URL;
    console.log('Fetching reviews from:', shopUrl);

    const reviews = await scrapeEtsyReviews(shopUrl);
    const formattedReviews = formatForShopify(reviews);

    // Output the formatted reviews as JSON
    console.log(JSON.stringify(formattedReviews, null, 2));

    // Also save to a file
    const fs = require('fs');
    fs.writeFileSync('etsy-reviews.json', JSON.stringify(formattedReviews, null, 2));
    console.log('Reviews saved to etsy-reviews.json');

  } catch (error) {
    console.error('Error:', error);
  }
}

main();