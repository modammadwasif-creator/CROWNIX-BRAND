/* =========================================
   CROWNIX - PRODUCT DATABASE
========================================= */

const VIP_PRODUCTS = [

   // NIKE WATCH
{
    id: "watch-004",
    name: "NIKE WATCH",
    category: "Men Watches",
    price: 1500,
    oldPrice: 2499,

    description: `OFFER OFFER

NEW ARRIVAL AT ATIF WATCHES

NIKE WATCH

LIGHT WEIGHT

ALUMINIUM AND FIBER MATERIAL

BUTTERFLY LOCK

NEW ATTRACTIVE COLOURS

SPECIAL OFFER PRICE ONLY Rs. 1,500`,

    images: [
        "Screenshot 2026-11-28 004837.png",
        "Screenshot 2026-11-28 004844.png",
        "Screenshot 2026-11-28 004513.png",
        "Screenshot 2026-11-28 004734.png",
        "Screenshot 2026-11-28 004744.png",
        "Screenshot 2026-11-28 004755.png",
        "Screenshot 2026-11-28 004805.png",
        "Screenshot 2026-11-28 004816.png",
        "Screenshot 2026-11-28 004827.png"
    ],

    badge: "Special Offer",
    featured: true,
    inStock: true
},


// CUSTOMIZED WALLET & KEYCHAIN SET
{
    id: "accessory-003",
    name: "Customized Wallet Keychain Set",
    category: "Gadgets",
    price: 1000,
    oldPrice: 1799,

    description: `CUSTOMIZED WALLET & KEYCHAIN SET

PREMIUM QUALITY

PERSONALIZED DESIGN

PERFECT GIFT FOR SOMEONE SPECIAL

WITH PREMIUM GIFT BOX

MAKING TIME: 2-4 DAYS

PRICE ONLY Rs. 1,000`,

    images: [
        "Screenshot 2026-11-28 003743.png",
        "Screenshot 2026-11-28 003708.png",
        "Screenshot 2026-11-28 003729.png"
    ],

    badge: "Customized",
    featured: true,
    inStock: true
},


   
   
   // FANCY ELECTRIC SHOWPIECE
{
    id: "showpiece-002",
    name: "Fancy Electric Showpiece",
    category: "Gadgets",
    price: 2250,
    oldPrice: 4599,

    description: `FANCY SHOWPIECE

PREMIUM DECORATION PIECE

OPERATED WITH ELECTRICITY

PERFECT FOR HOME DECORATION

PRICE ONLY Rs. 2,250 EACH

DELIVERY: AVAILABLE 1 DAY AFTER ORDER CONFIRMATION`,

    images: [
        "Screenshot 2026-11-28 002812.png",
        "Screenshot 2026-11-28 002545.png",
        "Screenshot 2026-11-28 002557.png",
        "Screenshot 2026-11-28 002607.png",
        "Screenshot 2026-11-28 002703.png",
        "Screenshot 2026-11-28 002722.png",
        "Screenshot 2026-11-28 002737.png",
        "Screenshot 2026-11-28 002752.png"
    ],

    badge: "Special Offer",
    featured: true,
    inStock: true
},
   
   
   
   {
    id: "couple-locket-001",
    name: "Magnetic Broken Heart Couple Locket",
    category: "Gadgets",
    price: 650,
    oldPrice: 999,
    images: [
        "Screenshot 2026-11-21 013251.png",
        "Screenshot 2026-11-21 013310.png"
    ],
    description: `
        💖 MAGNETIC BROKEN HEART COUPLE LOCKET 💖

        Make your bond special with your loved one!

        FEATURES:
        - Beautiful Broken Heart Design ❤️
        - Premium Silver & Black Finish
        - Stylish Matching Chains
        - Magnetic Couple Pendant
        - Personalised Names Engraving
        - Perfect Gift for Couples 🎁

        💰 Price: Rs. 650 Only
        💳 Payment Method: Cash on Delivery (COD)

        Available at CROWNIX 🔥
    `,
    badge: "SPECIAL GIFT",
    featured: true,
    inStock: true,
    paymentMethod: "COD"
},
];


/* =========================================
   CROWNIX - PRODUCT HELPERS
========================================= */

function getProductById(productId) {
    const searchId = String(productId ?? "").trim();

    return VIP_PRODUCTS.find(product =>
        String(product.id) === searchId
    ) || null;
}


function getProductsByCategory(category) {
    const searchCategory = String(category ?? "").trim().toLowerCase();

    return VIP_PRODUCTS.filter(product =>
        String(product.category ?? "").trim().toLowerCase() === searchCategory
    );
}


function getFeaturedProducts() {
    return VIP_PRODUCTS.filter(product =>
        product.featured === true && product.inStock !== false
    );
}


function getAvailableProducts() {
    return VIP_PRODUCTS.filter(product =>
        product.inStock !== false
    );
}


/* =========================================
   IMAGE PATH NORMALIZER
   Product images are stored beside HTML files.
========================================= */

function vipNormalizeImagePath(value) {
    const raw = String(value ?? "").trim();

    if (!raw) return "";

    // Preserve full web URLs and data/blob URLs.
    if (
        /^(https?:)?\/\//i.test(raw) ||
        /^(data:|blob:)/i.test(raw)
    ) {
        return raw;
    }

    // Support Windows separators and old folder paths.
    return raw.replace(/\\/g, "/").split("/").pop();
}


function vipSlug(value) {
    return String(value || "option")
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "") || "option";
}


/* =========================================
   NORMALIZE ALL PRODUCT IMAGE PATHS
========================================= */

VIP_PRODUCTS.forEach(function (product) {

    product.images = Array.isArray(product.images)
        ? product.images.map(vipNormalizeImagePath).filter(Boolean)
        : [];

    // Normalize variants only when actual variants are supplied.
    if (Array.isArray(product.variants)) {

        product.variants = product.variants.map(function (rawVariant, index) {

            const source = typeof rawVariant === "string"
                ? { name: rawVariant }
                : (rawVariant || {});

            const name = String(
                source.name ||
                source.color ||
                source.label ||
                source.title ||
                ("Option " + (index + 1))
            );

            const variantImages = Array.isArray(source.images)
                ? source.images.map(vipNormalizeImagePath).filter(Boolean)
                : [];

            const singleImage = vipNormalizeImagePath(
                source.image ||
                source.imageUrl ||
                source.image_url ||
                source.src ||
                ""
            );

            const images = variantImages.length
                ? variantImages
                : (singleImage ? [singleImage] : []);

            const price = Number(
                source.price ??
                source.salePrice ??
                source.amount ??
                product.price ??
                0
            );

            return {
                ...source,
                id: String(source.id || vipSlug(name) + "-" + (index + 1)),
                name,
                color: String(source.color || name),
                price: Number.isFinite(price)
                    ? price
                    : Number(product.price || 0),
                images,
                image: images[0] || singleImage || ""
            };
        });
    }
});


/* =========================================
   PRODUCT VARIANTS + GALLERY
   Normal products keep all their images.
========================================= */

function getVIPProductVariants(product) {

    if (!product) return [];

    const productImages = Array.isArray(product.images)
        ? product.images.map(vipNormalizeImagePath).filter(Boolean)
        : [];

    let rawVariants = [];

    if (Array.isArray(product.variants)) {

        rawVariants = product.variants;

    } else if (
        product.variants &&
        typeof product.variants === "object"
    ) {

        rawVariants = Object.entries(product.variants).map(function ([name, value]) {

            return typeof value === "object" && value !== null
                ? { name, ...value }
                : { name, price: value };
        });
    }

    // Products with actual named variants keep those choices.
    if (rawVariants.length) {

        return rawVariants.map(function (rawVariant, index) {

            const variant = typeof rawVariant === "string"
                ? { name: rawVariant }
                : (rawVariant || {});

            const name = String(
                variant.name ||
                variant.color ||
                variant.label ||
                variant.title ||
                ("Option " + (index + 1))
            );

            const explicitImages = Array.isArray(variant.images)
                ? variant.images.map(vipNormalizeImagePath).filter(Boolean)
                : [];

            const singleImage = vipNormalizeImagePath(
                variant.image ||
                variant.imageUrl ||
                variant.image_url ||
                variant.src ||
                ""
            );

            const choiceImages = explicitImages.length
                ? explicitImages
                : singleImage
                    ? [singleImage]
                    : [...productImages];

            const price = Number(
                variant.price ?? product.price ?? 0
            );

            return {
                id: String(
                    variant.id || vipSlug(name) + "-" + (index + 1)
                ),
                name,
                color: String(variant.color || name),
                price: Number.isFinite(price)
                    ? price
                    : Number(product.price || 0),
                images: choiceImages,
                image: choiceImages[0] || ""
            };
        });
    }

    // Normal product: one standard option with the complete gallery.
    return [{
        id: "standard",
        name: "Standard",
        color: "",
        price: Number(product.price || 0),
        images: productImages,
        image: productImages[0] || ""
    }];
}


function getVIPVariantById(product, variantId) {

    const variants = getVIPProductVariants(product);

    return variants.find(function (variant) {
        return String(variant.id) === String(variantId);
    }) || variants[0] || null;
}


/* =========================================
   CONTINUOUS PICTURE ID SYSTEM
========================================= */

function getAllProductImages() {

    const allImages = [];

    let imageNumber = 0;

    VIP_PRODUCTS.forEach(function (product) {

        const imageList = [
            ...(Array.isArray(product.images) ? product.images : [])
        ];

        // Include variant-only images not listed in product.images.
        if (Array.isArray(product.variants)) {

            product.variants.forEach(function (variant) {

                if (Array.isArray(variant.images)) {
                    imageList.push(...variant.images);
                }

                if (variant.image) {
                    imageList.push(variant.image);
                }
            });
        }

        const uniqueImages = [...new Set(
            imageList.map(vipNormalizeImagePath).filter(Boolean)
        )];

        uniqueImages.forEach(function (imageUrl) {

            imageNumber++;

            allImages.push({
                pictureId: "VIP-IMG-0." + imageNumber,
                productId: product.id,
                productName: product.name,
                imageUrl
            });
        });
    });

    return allImages;
}


function getPictureIdForImage(productId, imageUrl) {

    const cleanImage = vipNormalizeImagePath(imageUrl);

    const found = getAllProductImages().find(function (item) {

        return (
            String(item.productId) === String(productId) &&
            item.imageUrl === cleanImage
        );
    });

    return found ? found.pictureId : null;
}


function findProductImageById(pictureId) {

    const searchId = String(pictureId || "").trim().toUpperCase();

    return getAllProductImages().find(function (image) {

        return image.pictureId.toUpperCase() === searchId;

    }) || null;
}


/* =========================================
   CROWNIX PRODUCT DATA CHECK
========================================= */

(function validateVIPProducts() {

    const seenIds = new Set();

    const duplicateIds = [];

    VIP_PRODUCTS.forEach(function (product) {

        const id = String(product.id || "");

        if (seenIds.has(id)) {
            duplicateIds.push(id);
        }

        seenIds.add(id);
    });

    if (duplicateIds.length) {
        console.error("CROWNIX duplicate product IDs:", duplicateIds);
    }

    console.info(
        "CROWNIX products loaded:",
        VIP_PRODUCTS.length,
        "| images:",
        getAllProductImages().length
    );

})();
