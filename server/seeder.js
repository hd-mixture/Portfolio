require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Project = require('./models/Project');
const Design = require('./models/Design');

const projectsData = [
  {
    date: "Feb 2026 - Apr 2026",
    title: "CyberAegXs",
    description: "CyberAegXs is an AI-powered PDF Security and Management Platform designed for secure and smart document handling. It combines advanced PDF productivity tools with modern authentication, cloud storage, and premium subscription access.",
    liveLink: "https://cyberaegxs.hdmixture.site/",
    codeLink: "https://github.com/hd-mixture/CyberAegXs.git",
    iconSrc: "https://cyberaegxs.hdmixture.site/CyberAegXs%20Logo.png",
    timelineIconClass: "fa-solid fa-file-shield",
    status: 'completed',
    techStack: [
      { icon: 'fa-brands fa-react', name: 'React' },
      { icon: 'fa-solid fa-fire', name: 'Firebase' },
      { icon: 'fa-brands fa-js', name: 'JavaScript' },
      { icon: 'fa-solid fa-brain', name: 'AI' }
    ]
  },
  {
    date: "Jul 2025 - Ongoing",
    title: "DevTeXhHub",
    description: "DevTeXhHub is a modern, full-featured project management application designed to streamline workflows for software development teams. It provides distinct, role-based dashboards for Admins, Managers, Developers, QAs, and Designers, ensuring that every team member has the tools they need to be productive.",
    liveLink: null,
    codeLink: null,
    iconSrc: "/Project Logo/DevTeXhHub Logo.png",
    timelineIconClass: "fa-solid fa-tasks",
    status: 'ongoing',
    techStack: [
      { icon: 'fa-brands fa-react', name: 'React' },
      { icon: 'fa-brands fa-node-js', name: 'Node.js' },
      { icon: 'fa-solid fa-database', name: 'MongoDB' },
      { icon: 'fa-brands fa-js', name: 'JavaScript' }
    ]
  },
  {
    date: "Jun 2025 - Jul 2025",
    title: "Cardify",
    description: "Cardify is a modern, web-based application that allows users to effortlessly create, customize, and download professional virtual visiting cards. With a live preview and a wide range of customization options, creating your perfect digital card has never been easier.",
    liveLink: "https://cardify.hdmixture.site",
    codeLink: "https://github.com/hd-mixture/Cardify.git",
    iconSrc: "/Project Logo/Cardify Logo.png",
    timelineIconClass: "fa-solid fa-address-card",
    status: 'completed',
    techStack: [
      { icon: 'fa-brands fa-html5', name: 'HTML5' },
      { icon: 'fa-brands fa-css3-alt', name: 'CSS3' },
      { icon: 'fa-brands fa-js', name: 'JavaScript' },
      { icon: 'fa-brands fa-react', name: 'React' }
    ]
  },
  {
    date: "Mar 2020 - Ongoing",
    title: "Graphic Designs",
    description: "A showcase of my creative graphic design works, including posters, banners, logos, and more.",
    portfolioLink: true,
    behanceLink: "https://www.behance.net/hd_mixture",
    iconClass: "fa-solid fa-palette",
    timelineIconClass: "fa-solid fa-palette",
    status: 'ongoing',
    techStack: [
      { icon: 'fa-brands fa-figma', name: 'Figma' },
      { icon: 'fa-solid fa-palette', name: 'Graphic Design' },
      { icon: 'fa-solid fa-pen-nib', name: 'Illustrator' }
    ]
  },
  {
    date: "Jan 2025 - May 2025",
    title: "Campus Cuisine 2.0",
    description: "Upgraded the UI/UX, added real-time ordering features, and role-based admin functionalities.",
    liveLink: "https://hd-mixture.github.io/Campus-Cuisine-2/",
    codeLink: "https://github.com/hd-mixture/Campus-Cuisine-2",
    iconSrc: "/Project Logo/Campus_Cuisine_Logo_.2.0.png",
    timelineIconClass: "fa-solid fa-utensils",
    status: 'completed',
    techStack: [
      { icon: 'fa-brands fa-react', name: 'React' },
      { icon: 'fa-brands fa-node-js', name: 'Node.js' },
      { icon: 'fa-solid fa-fire', name: 'Firebase' },
      { icon: 'fa-brands fa-js', name: 'JavaScript' }
    ]
  },
  {
    date: "Feb 2025 - Apr 2025",
    title: "Save & Share",
    description: "Designed a donation network connecting food donors, NGOs, and volunteers using PHP.",
    liveLink: "https://github.com/100rabx23/Save-Share.git",
    codeLink: "https://github.com/100rabx23/Save-Share.git",
    iconSrc: "/Project Logo/save_share_logo.png",
    timelineIconClass: "fa-solid fa-hand-holding-heart",
    status: 'completed',
    techStack: [
      { icon: 'fa-brands fa-php', name: 'PHP' },
      { icon: 'fa-solid fa-database', name: 'MySQL' },
      { icon: 'fa-brands fa-html5', name: 'HTML5' }
    ]
  },
  {
    date: "Oct 2024 - Present",
    title: "ABHAR : AI-Home Robot",
    description: "Built an automation robot to control home appliances via voice commands and sensors. Programmed using G-Code and C++.",
    liveLink: "https://epicpjm05.github.io/ABHAR/WEb",
    codeLink: "https://github.com/EPICPJM05/ABHAR.git",
    iconSrc: "/Project Logo/ABHAR Orange Resize Logo.png",
    timelineIconClass: "fa-solid fa-robot",
    status: 'live',
    techStack: [
      { icon: 'fa-solid fa-microchip', name: 'Hardware' },
      { icon: 'fa-solid fa-code', name: 'C++' },
      { icon: 'fa-solid fa-robot', name: 'Robotics' }
    ]
  },
  {
    date: "Apr 2025 - Apr 2025",
    title: "BitTRiX AI : Automated Test Agent",
    description: "Developed a smart testing system to generate and integrate with CI/CD tools using Python.",
    liveLink: "https://github.com/EPICPJM05/NU-Thon-Bittrix.git",
    codeLink: "https://github.com/EPICPJM05/NU-Thon-Bittrix.git",
    iconSrc: "/Project Logo/BitTRix Logo.jpg",
    timelineIconClass: "fa-solid fa-microchip",
    status: 'completed',
    techStack: [
      { icon: 'fa-brands fa-python', name: 'Python' },
      { icon: 'fa-solid fa-brain', name: 'AI' },
      { icon: 'fa-brands fa-github', name: 'CI/CD' }
    ]
  },
  {
    date: "Mar 2024 - Jun 2024",
    title: "Campus Cuisine",
    description: "Built a web app for students to discover and review affordable meals on campus.",
    liveLink: "https://hd-mixture.github.io/Campus-Cuisine/",
    codeLink: "https://github.com/hd-mixture/Campus-Cuisine.git",
    iconSrc: "/Project Logo/Campus Cuisin Logo Black.png",
    timelineIconClass: "fa-solid fa-utensils",
    status: 'completed',
    techStack: [
      { icon: 'fa-brands fa-html5', name: 'HTML5' },
      { icon: 'fa-brands fa-css3-alt', name: 'CSS3' },
      { icon: 'fa-brands fa-js', name: 'JavaScript' }
    ]
  },
  {
    date: "Aug 2023 - Sep 2023",
    title: "Driving Licence App",
    description: "Designed a user-friendly interface to apply, check documents, and track driving licence.",
    liveLink: "https://github.com/hd-mixture/DrivingLicenceApplicaion.git",
    codeLink: "https://github.com/hd-mixture/DrivingLicenceApplicaion.git",
    iconSrc: "/Project Logo/Driving Licence App Logo.png",
    timelineIconClass: "fa-solid fa-id-card",
    status: 'completed',
    techStack: [
      { icon: 'fa-brands fa-android', name: 'Android' },
      { icon: 'fa-brands fa-java', name: 'Java' },
      { icon: 'fa-solid fa-database', name: 'SQLite' }
    ]
  },
  {
    date: "Aug 2022 - Sep 2022",
    title: "Nearby Places",
    description: "Created an Android app using Google Maps API to display nearby essential locations.",
    liveLink: "https://github.com/hd-mixture/Nearby-Places.git",
    codeLink: "https://github.com/hd-mixture/Nearby-Places.git",
    iconSrc: "/Project Logo/Nearby Place Logo.png?v=2",
    timelineIconClass: "fa-solid fa-location-dot",
    status: 'completed',
    techStack: [
      { icon: 'fa-brands fa-android', name: 'Android' },
      { icon: 'fa-brands fa-google', name: 'Google Maps API' },
      { icon: 'fa-solid fa-location-dot', name: 'GPS' }
    ]
  }
];

const designData = {
    android: [
        { src: "/Graphic Designs/Android_Screen_Images/IMG-20250408-WA0020.jpg", title: "Driving Licence Application Splash Screen" },
        { src: "/Graphic Designs/Android_Screen_Images/IMG-20250408-WA0021.jpg", title: "Driving Licence Application Register Screen" },
        { src: "/Graphic Designs/Android_Screen_Images/IMG-20250408-WA0022.jpg", title: "Driving Licence Application Login Screen" },
        { src: "/Graphic Designs/Android_Screen_Images/IMG-20250408-WA0024.jpg", title: "Driving Licence Application Categories Screen" },
        { src: "/Graphic Designs/Android_Screen_Images/IMG-20250408-WA0025.jpg", title: "Driving Licence Application Categories Screen " }
    ],
    web: [
        { src: "/Graphic Designs/Web_Screen_Images/Webpage Design_1.png", title: "Campus Cuisine 2 Home Page" },
        { src: "/Graphic Designs/Web_Screen_Images/Webpage Design_2.png", title: "Campus Cuisine 2 Login Page" },
        { src: "/Graphic Designs/Web_Screen_Images/Webpage Design_3.png", title: "Campus Cuisine 2 Order Page" },
        { src: "/Graphic Designs/Web_Screen_Images/Webpage Design_4.png", title: "Campus Cuisine 2 Order Checkout Page" },
        { src: "/Graphic Designs/Web_Screen_Images/Webpage Design_5.png", title: "Campus Cuisine 2 Dashboard" },
        { src: "/Graphic Designs/Web_Screen_Images/Webpage Design_6.png", title: "Campus Cuisine 2 Delivery Page" },
        { src: "/Graphic Designs/Web_Screen_Images/Webpage Design_7.png", title: "Campus Cuisine 2 About Page" },
        { src: "/Graphic Designs/Web_Screen_Images/Webpage Design_8.png", title: "Campus Cuisine 2 Contact Page" }
    ],
    banners: [
        { src: "/Graphic Designs/Banner/Blood Donation E-Banner_.jpg", title: "UPL Blood Donation Banner" },
        { src: "/Graphic Designs/Banner/BOD Navrati Banner.png", title: "UPL Navratri Banner" },
        { src: "/Graphic Designs/Banner/Diploma Summer Result 2024 Banner.png", title: "UPL Result Standy Banner" },
        { src: "/Graphic Designs/Banner/IMG-20250311-WA0023.jpg", title: "UPL Admission Banner 2025 - 26" },
        { src: "/Graphic Designs/Banner/Main Banner.png", title: "UPL Ganpati Hostel Banner" },
        { src: "/Graphic Designs/Banner/Sec- Tec Banner Graphic Poster Final Day.jpg", title: "UPL Sci - Technovation 2022 Graphic Banner" },
        { src: "/Graphic Designs/Banner/Sec- Tec Game Banner.jpg", title: "UPL Sci - Technovation 2022 Mobile Game Banner" },
        { src: "/Graphic Designs/Banner/σ Banner.jpg", title: "Sigma Night Standy Banner" }
    ],
    certificates: [
        { src: "/Graphic Designs/Certificate/BOD Potery Certificate - 2.jpg", title: "UPL Certificate Design 1" },
        { src: "/Graphic Designs/Certificate/Certificate on Webinar.jpg", title: "UPL Certificate Design 2" },
        { src: "/Graphic Designs/Certificate/WordPrees Certificate_.jpg", title: "UPL Certificate Design 3" }
    ],
    logos: [
        { src: "/Graphic Designs/Logos/ABHAR Orange Resize Logo.png", title: "ABHAR Logo" },
        { src: "/Graphic Designs/Logos/BIttStock App Logo.png", title: "Bittstock Logo" },
        { src: "/Graphic Designs/Logos/Campus Cuisin Logo.jpg", title: "Campus Cuisine Logo" },
        { src: "/Graphic Designs/Logos/Driving Licence App Logo.png", title: "Driving Licence Logo" },
        { src: "/Graphic Designs/Logos/Netflix Unlock Creative Logo.png", title: "COHORT Logo" },
        { src: "/Graphic Designs/Logos/Neural Grafix Logo.png", title: "Neural Grafix Logo" },
        { src: "/Graphic Designs/Logos/save_share_logo1.png", title: "Save & Share Logo" },
        { src: "/Graphic Designs/Logos/YASHODA Logo.png", title: "Yashoda Furniture Logo" },
        { src: "/Graphic Designs/Logos/K-Naturals Logo.jpg", title: "Krishna Naturals Logo" }
    ],
    posters: [
        { src: "/Graphic Designs/Posters/BOD Blood Donation Poster.jpg", title: "Rotaract Rakt Kundali Post" },
        { src: "/Graphic Designs/Posters/BOD Freshers Poster Beginning.jpg", title: "Rotaract Brizzy Night Post" },
        { src: "/Graphic Designs/Posters/BOD Ganesh Mahotsav Poster.jpg", title: "Rotaract Ganpati Banner" },
        { src: "/Graphic Designs/Posters/BOD Independence Day.jpg", title: "Rotaract 76th Independence Day Post" },
        { src: "/Graphic Designs/Posters/BOD Letter Exchange PanColombo.jpg", title: "Rotaract Letterhead Poster" },
        { src: "/Graphic Designs/Posters/BOD National Cinema Day.jpg", title: "Rotaract National Cinema Day Post" },
        { src: "/Graphic Designs/Posters/BOD Physically Challenged Poster Page 3.jpg", title: "Rotaract Medical Camp Post" },
        { src: "/Graphic Designs/Posters/BOD Raksha_Bandhan.jpg", title: "Rotaract Raksha Bhandhan Post" },
        { src: "/Graphic Designs/Posters/BOD World Physo Day.jpg", title: "Rotaract Word Physo Day Post" },
        { src: "/Graphic Designs/Posters/BOD મિત્રતા - એક संबंध.jpg", title: "Rotaract મિત્રતા - એક संबंध Post" }
    ]
};

const importData = async () => {
    try {
        await connectDB();
        
        await Project.deleteMany();
        await Design.deleteMany();

        await Project.insertMany(projectsData);

        const formattedDesigns = [];
        for (const [category, designs] of Object.entries(designData)) {
            for (const design of designs) {
                formattedDesigns.push({
                    category,
                    src: design.src,
                    title: design.title
                });
            }
        }
        
        await Design.insertMany(formattedDesigns);

        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`Error with data import: ${error}`);
        process.exit(1);
    }
}

importData();
