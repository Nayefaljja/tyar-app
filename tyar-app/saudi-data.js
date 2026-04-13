// Saudi-specific EV models and locations data

const saudiData = {
    // Popular EV models in Saudi Arabia
    evModels: [
        {
            name: "Ceer (أول سيارة كهربائية سعودية)",
            price: "165,000 ر.س",
            range: "475 كم",
            image: "https://images.unsplash.com/photo-1593941707882-a5bfcf2dd8b4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
        },
        {
            name: "Tesla Model 3",
            price: "189,900 ر.س",
            range: "513 كم",
            image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
        },
        {
            name: "Lucid Air",
            price: "320,000 ر.س",
            range: "650 كم",
            image: "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
        },
        {
            name: "BYD Han",
            price: "199,900 ر.س",
            range: "521 كم",
            image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
        },
        {
            name: "Nissan Leaf",
            price: "132,000 ر.س",
            range: "270 كم",
            image: "https://images.unsplash.com/photo-1593941707882-a5bfcf2dd8b4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
        },
        {
            name: "Hyundai IONIQ 5",
            price: "185,000 ر.س",
            range: "481 كم",
            image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
        }
    ],
    
    // Saudi cities for service locations
    serviceCities: [
        {
            name: "الرياض",
            nameEn: "Riyadh",
            centers: ["مركز خدمة الرياض الشمالي", "مركز خدمة الرياض الجنوبي", "مركز خدمة الرياض الشرقي"]
        },
        {
            name: "جدة",
            nameEn: "Jeddah",
            centers: ["مركز خدمة جدة الشمالي", "مركز خدمة جدة الجنوبي"]
        },
        {
            name: "الدمام",
            nameEn: "Dammam",
            centers: ["مركز خدمة الدمام"]
        },
        {
            name: "مكة المكرمة",
            nameEn: "Makkah",
            centers: ["مركز خدمة مكة المكرمة"]
        },
        {
            name: "المدينة المنورة",
            nameEn: "Madinah",
            centers: ["مركز خدمة المدينة المنورة"]
        },
        {
            name: "الخبر",
            nameEn: "Khobar",
            centers: ["مركز خدمة الخبر"]
        }
    ],
    
    // Charging station networks in Saudi Arabia
    chargingNetworks: [
        {
            name: "EVIQ",
            description: "أول شبكة شحن سريعة على مستوى المملكة",
            descriptionEn: "Saudi's first Kingdom-wide rapid charging network"
        },
        {
            name: "Electromin",
            description: "أكبر شبكة شحن للسيارات الكهربائية في المملكة العربية السعودية",
            descriptionEn: "Saudi Arabia's largest EV Charging network"
        },
        {
            name: "SASCO",
            description: "محطات شحن على الطرق السريعة",
            descriptionEn: "Highway charging stations"
        }
    ],
    
    // Popular charging locations
    chargingLocations: [
        {
            city: "الرياض",
            cityEn: "Riyadh",
            locations: ["محطة شحن الرياض - القصيم", "محطة شحن الريحاب", "محطة شحن الأمير فواز الجنوبي"]
        },
        {
            city: "جدة",
            cityEn: "Jeddah",
            locations: ["محطة شحن Electromin", "محطة شحن الريحاب", "محطة شحن الأمير فواز الجنوبي"]
        },
        {
            city: "وادي الدواسر",
            cityEn: "Wadi Al-Dawasir",
            locations: ["محطة شحن وادي الدواسر 1", "محطة شحن وادي الدواسر 2", "محطة شحن وادي الدواسر 3"]
        }
    ]
};

// Export data
if (typeof module !== 'undefined' && module.exports) {
    module.exports = saudiData;
}
