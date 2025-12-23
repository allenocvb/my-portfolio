import React from "react";
import Navbar from "../components/layout/Navbar";
import Hero from "../components/sections/Hero";
import About from "../components/sections/About";
import ExperienceTimeline from "../components/sections/ExperienceTimeline";
import EducationCard from "../components/sections/EducationCard";
import ProjectsGrid from "../components/sections/ProjectsGrid";
import ContactLinks from "../components/layout/ContactLinks";
import Footer from "../components/layout/Footer";
import aboutMe from "../data/aboutMe";
import experiences from "../data/experiences";
import projects from "../data/projects";
import styles from "../styles/SectionTitles.module.scss";

const Home = ({ onEject }) => (
  <div className="content-container" style={{ paddingTop: "80px" }}>
    <Navbar onEject={onEject} />
    <Hero />
    <About statements={aboutMe} />
    <h2 id="experience" className={styles.sectionTitle}>
      Experience
    </h2>
    <ExperienceTimeline experiences={experiences} />
    <h2 id="projects" className={styles.sectionTitle}>
      Projects
    </h2>
    <ProjectsGrid projects={projects} />
    <h2 id="contact" className={styles.sectionTitle}>
      Contact
    </h2>
    <ContactLinks />
    <Footer />
  </div>
);

export default Home;
