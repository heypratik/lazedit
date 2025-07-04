import React from 'react';
import { Wand2, Scissors, Camera, User, Palette, Image, Type, Megaphone, Store } from 'lucide-react';

const Features = () => {
    const features = [
        {
            title: "🪄 Text-to-Edit Magic",
            description: "Stop clicking through 47 menus to change one product photo. Just tell LazyEdit exactly what you want: 'change the pose of the model', 'make this product background a beach' or 'change the models t-shirt to red.' Our AI understands your words instantly and makes the changes in seconds - no tutorials, no guessing which tool does what, no designer required.",
            image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=600&h=400&fit=crop&crop=center",
            icon: Wand2,
        },
        {
            title: "✂️ Remove Background Instantly",
            description: `Yeah, yeah, we know. Background removal is SO 2019. Every app and their grandmother has this feature now. But here's the thing - ours actually works without making your product look like it was cut out by a toddler with safety scissors. 
            
            One click and your messy product photos become clean, professional images ready for your store. No jagged edges, no weird white halos, no 'why does my expensive product look like a bad sticker?' moments.`,
            image: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=600&h=400&fit=crop&crop=center",
            icon: Scissors,
        },
        {
            title: "📸 Professional Product Photography",
            description: `Your iPhone product photos looking a bit... amateur? We'll take that sad, plain white background shot and transform it into magazine-worthy content. Want your skincare bottle on a marble countertop? Done. Your backpack being used by a hiker in the mountains? Easy. Your jewelry worn by an elegant model? Consider it handled.
            
            No photographer, no studio rental, no awkward direction sessions with models who don't understand your vision. Just upload your basic product photo and tell us the scene you want. Beach sunset? Cozy coffee shop? Luxury penthouse? We'll make it happen in seconds.`,
            image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop&crop=center",
            icon: Camera,
        },
        {
            title: "🕺 Change Model Poses",
            description: `Got a model photo but need a different pose? Don't reshoot - just tell us what you want. "Make her point to the product." "Have him cross his arms." "Turn her to face the camera." Our AI understands body language and repositions your models instantly.
No more expensive reshoot sessions because the model's hand was covering the logo. No more settling for "close enough" poses that don't showcase your product properly. Just describe the pose you need and watch your model move into position.`,
            image: "https://images.unsplash.com/photo-1524863479829-917d0382c78a?w=600&h=400&fit=crop&crop=center",
            icon: User,
        },
        {
            title: "👕 Change Model Clothes",
            description: `Swap outfits, shoes, accessories - literally anything your model is wearing. "Put her in a red dress instead." "Give him Nike sneakers." "Add sunglasses and a watch." "Change the shirt to white." Our AI treats your model like a virtual dress-up doll, but with photorealistic results.
No more booking separate models for different product categories. No more expensive wardrobe changes during shoots. One model photo becomes infinite outfit combinations. Want to show how your watch looks with formal wear AND casual clothes? Done in seconds.`,
            image: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=600&h=400&fit=crop&crop=center",
            icon: Palette,
        },
        {
            title: "🌴 Change Background Scenes",
            description: `Beach vibes? Mountain adventure? Luxury penthouse? Alien spaceship? (Hey, we don't judge your brand aesthetic.) Drop your product into any scene you can imagine without leaving your pajamas or hiring a travel photographer.
Want your protein powder looking at home in a gym? Easy. Need your jewelry sparkling in a fancy restaurant? Done. Craving that "shot on location in Bali" look but your budget screams "shot in my garage"? We've got you covered.`,
            image: "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=600&h=400&fit=crop&crop=center",
            icon: Image,
        },
        {
            title: "✏️ Edit Text in Images",
            description: `Remember when changing text in an image meant starting over from scratch? Or paying a designer $50 to fix one typo? Those dark ages are over.
"Change 'Summer Sale' to 'Winter Sale.'" "Fix the spelling mistake." "Make the price bigger." "Translate this to Spanish." Our AI treats text like actual text, not some mysterious graphic element that requires a computer science degree to modify.`,
            image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=600&h=400&fit=crop&crop=center",
            icon: Type,
        },
        {
            title: "📱 Generate Promotional Posts",
            description: `"Make an Instagram story for our flash sale." "Create a Facebook ad for this product." "I need 5 different promo posts, all sizes." Boom. Done. Our AI cranks out scroll-stopping promotional content faster than you can say "engagement rate."
Every size, every platform, every style. Square posts, story formats, Facebook ads, Pinterest pins - whatever the algorithm demands this week. Want 10 variations of the same promotion? Easy. Need it in 3 different color schemes? Child's play.`,
            image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=600&h=400&fit=crop&crop=center",
            icon: Megaphone,
        },
        {
            title: "🖼️ Generate Store Banners",
            description: `"Create a Black Friday banner." "Make a 'Free Shipping' header." "I need a sale banner that screams 'BUY NOW.'" Your store gets instant banners that actually convert, not those sad default templates that scream "I gave up."
Every size for every platform - website headers, email banners, social covers, mobile versions. Want to test 5 different sale banners to see which one makes customers click? Generate them all in under a minute and let the data decide.`,
            image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop&crop=center",
            icon: Store,
        }
    ];

    return (
        <section id="features" className="py-12 md:py-20 section-padding relative">
            {/* Background patterns */}
            <div className="absolute inset-0 pattern-dots opacity-40"></div>
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-white/5 to-transparent"></div>
            <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white/5 to-transparent"></div>
            
            <div className="max-w-7xl mx-auto relative z-10 px-4 md:px-6 lg:px-8">
                <div className="text-center mb-8 md:mb-12">
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-medium mb-3 md:mb-4 text-white">
                        Powerful Features
                    </h2>
                    <p className="text-base md:text-lg text-white max-w-2xl mx-auto px-4 md:px-0">
                        Everything you need for professional image editing
                    </p>
                </div>

                <div className="space-y-6 md:space-y-8">
                    {features.map((feature, index) => {
                        const IconComponent = feature.icon;
                        const isReverse = index % 2 === 1;
                        return (
                            <div 
                                key={feature.title}
                                className={`flex flex-col lg:flex-row items-center gap-4 md:gap-6 lg:gap-8 glass-strong rounded-2 p-2 md:p-6 ${
                                    isReverse ? 'lg:flex-row-reverse' : ''
                                }`}
                            >
                                {/* Image Section */}
                                <div className="w-full lg:flex-1 relative group">
                                    <div className="absolute -inset-2"></div>
                                    <div className="relative aspect-[4/3] md:aspect-[3/2] lg:aspect-[4/3] overflow-hidden rounded-lg">
                                        <img 
                                            src={feature.image} 
                                            alt={feature.title}
                                            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
                                    </div>
                                </div>
                                
                                {/* Content Section */}
                                <div className="w-full lg:flex-1 space-y-3 md:space-y-4">
                                    <div className="flex items-start gap-3 md:gap-4">
                                        <div className="hidden md:block">
                                            <IconComponent className="w-6 h-6 md:w-8 md:h-8 text-white/80 mt-1 flex-shrink-0" />
                                        </div>
                                        <h4 className="text-xl md:text-2xl lg:text-3xl font-medium text-white leading-tight">
                                            {feature.title}
                                        </h4>
                                    </div>
                                    <div className="md:ml-10 lg:ml-12">
                                        <p className="text-white text-sm md:text-base lg:text-base leading-relaxed whitespace-pre-line">
                                            {feature.description}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
            
            {/* Bottom text */}
            <div className='flex items-center justify-center mt-8 md:mt-12 px-4'>
                <span className='text-center text-white text-sm md:text-base'>and a ton more...</span>
            </div>
        </section>
    );
};

export default Features;