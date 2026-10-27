const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load env vars
dotenv.config({ path: path.join(__dirname, '.env') });

const Design = require('./models/Design');

const baseProjects = [
    {
      title: "LOGO DESIGN",
      images: [
        "/Designer/Graphic Designs/Logo Design/ABHAR Orange Resize Logo.png",
        "/Designer/Graphic Designs/Logo Design/BIttStock App Logo.png",
        "/Designer/Graphic Designs/Logo Design/Campus Cuisin Logo.png",
        "/Designer/Graphic Designs/Logo Design/Driving Licence App Logo.png",
        "/Designer/Graphic Designs/Logo Design/K-Naturals Logo.png",
        "/Designer/Graphic Designs/Logo Design/Netflix Unlock Creative Logo.png",
        "/Designer/Graphic Designs/Logo Design/Neural Grafix Logo.png",
        "/Designer/Graphic Designs/Logo Design/save_share_logo1.png",
        "/Designer/Graphic Designs/Logo Design/YASHODA Logo.png"
      ]
    },
    {
      title: "POSTER DESIGN",
      images: [
        "/Designer/Graphic Designs/Posters/BOD Ganesh Mahotsav Poster.jpg",
        "/Designer/Graphic Designs/Posters/BOD Blood Donation Poster.jpg",
        "/Designer/Graphic Designs/Posters/BOD Freshers Poster Beginning.jpg",
        "/Designer/Graphic Designs/Posters/BOD Independence Day.jpg",
        "/Designer/Graphic Designs/Posters/BOD Letter Exchange PanColombo.jpg",
        "/Designer/Graphic Designs/Posters/BOD National Cinema Day.jpg",
        "/Designer/Graphic Designs/Posters/BOD Raksha_Bandhan.jpg",
        "/Designer/Graphic Designs/Posters/BOD World Physo Day.jpg"
      ]
    },
    {
      title: "WEB UI DESIGN",
      images: [
        "/Designer/Graphic Designs/Web_Screen_Images/Webpage Design_1.png",
        "/Designer/Graphic Designs/Web_Screen_Images/Webpage Design_2.png",
        "/Designer/Graphic Designs/Web_Screen_Images/Webpage Design_3.png",
        "/Designer/Graphic Designs/Web_Screen_Images/Webpage Design_4.png",
        "/Designer/Graphic Designs/Web_Screen_Images/Webpage Design_5.png",
        "/Designer/Graphic Designs/Web_Screen_Images/Webpage Design_6.png",
        "/Designer/Graphic Designs/Web_Screen_Images/Webpage Design_7.png",
        "/Designer/Graphic Designs/Web_Screen_Images/Webpage Design_8.png"
      ]
    },
    {
      title: "APP UI DESIGN",
      images: [
        "/Designer/Graphic Designs/Android_Screen_Images/IMG-20250408-WA0024.jpg",
        "/Designer/Graphic Designs/Android_Screen_Images/IMG-20250408-WA0020.jpg",
        "/Designer/Graphic Designs/Android_Screen_Images/IMG-20250408-WA0021.jpg",
        "/Designer/Graphic Designs/Android_Screen_Images/IMG-20250408-WA0022.jpg",
        "/Designer/Graphic Designs/Android_Screen_Images/IMG-20250408-WA0025.jpg"
      ]
    },
    {
      title: "BANNER DESIGN",
      images: [
        "/Designer/Graphic Designs/Banner/Main Banner.png",
        "/Designer/Graphic Designs/Banner/BOD Navrati Banner.png",
        "/Designer/Graphic Designs/Banner/Blood Donation E-Banner_.jpg",
        "/Designer/Graphic Designs/Banner/Diploma Summer Result 2024 Banner.png",
        "/Designer/Graphic Designs/Banner/Sec- Tec Banner Graphic Poster Final Day.jpg",
        "/Designer/Graphic Designs/Banner/Sec- Tec Game Banner.jpg"
      ]
    }
];

const migrate = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected...');

        let count = 0;

        for (const project of baseProjects) {
            for (let i = 0; i < project.images.length; i++) {
                const src = project.images[i];
                
                // Check if already exists
                const existing = await Design.findOne({ src });
                if (!existing) {
                    await Design.create({
                        category: project.title,
                        src: src,
                        title: `${project.title} Image ${i + 1}`,
                        caption: 'Imported from hardcoded data'
                    });
                    console.log(`Inserted: ${src}`);
                    count++;
                } else {
                    console.log(`Skipped (already exists): ${src}`);
                }
            }
        }

        console.log(`Migration Complete. Inserted ${count} images.`);
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

migrate();
