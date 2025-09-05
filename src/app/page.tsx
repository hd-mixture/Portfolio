import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Projects from "@/components/sections/Projects";
import Internship from "@/components/sections/Internship";
import Contact from "@/components/sections/Contact";
import Achievements from "@/components/sections/Achievements";
import TechStack from "@/components/sections/TechStack";
import Testimonials from "@/components/sections/Testimonials";

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <TechStack />
      <Projects />
      <Internship />
      <Achievements />
      <Contact />
      <Testimonials />
    </>
  );
}
