// app/api/products/route.js

const exampleProducts = {
    Electronics: [
      {
        image: "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png",
        title: "Smartphone XYZ",
        description: "A high-end smartphone with amazing features.",
        link: "#"
      },
      {
        image: "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png",
        title: "Laptop ABC",
        description: "A powerful laptop for all your computing needs.",
        link: "#"
      }
    ],
    Books: [
      {
        image: "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png",
        title: "The Great Book",
        description: "An engaging and fascinating read.",
        link: "#"
      },
      {
        image: "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png",
        title: "Learn JavaScript",
        description: "A comprehensive guide to mastering JavaScript.",
        link: "#"
      }
    ],
    Clothing: [
      {
        image: "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png",
        title: "T-Shirt",
        description: "A comfortable and stylish T-shirt.",
        link: "#"
      },
      {
        image: "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png",
        title: "Jeans",
        description: "Trendy and durable jeans.",
        link: "#"
      }
    ],
    HomeKitchen: [
      {
        image: "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png",
        title: "Blender",
        description: "A high-performance blender for your kitchen.",
        link: "#"
      },
      {
        image: "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png",
        title: "Cookware Set",
        description: "A complete cookware set for all your cooking needs.",
        link: "#"
      }
    ]
  };
  
  export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const numberOfProducts = parseInt(searchParams.get('numberOfProducts'), 10) || 1;
  
    const products = exampleProducts[category] || [];
  
    // Limit the number of products to the requested number
    const limitedProducts = products.slice(0, numberOfProducts);
  
    return new Response(JSON.stringify({ category, products: limitedProducts }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
  