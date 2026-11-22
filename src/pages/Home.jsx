import Navbar from "../components/layout/Navbar";
import Hero from "../components/sections/Hero";
import About from "../components/sections/About";
import ExperienceTabs from "../components/sections/ExperienceTabs";
import ProjectsGrid from "../components/sections/ProjectsGrid";
import Footer from "../components/layout/Footer";
import aboutMe from "../data/aboutMe";
import experiences from "../data/experiences";
import projects from "../data/projects";
import titles from "../styles/SectionTitles.module.scss";
import styles from "./Home.module.scss";

const Home = ({ onEject }) => (
  <>
    <Navbar onEject={onEject} />
    <main className={styles.home}>
      <Hero />
      <About statements={aboutMe} onPlay={() => onEject({ play: true })} />
      <section id="experience" className={styles.section} aria-labelledby="experience-heading">
        <h2 id="experience-heading" className={titles.sectionTitle}>Experience</h2>
        <ExperienceTabs experiences={experiences} />
      </section>
      <section id="projects" className={styles.section} aria-labelledby="projects-heading">
        <h2 id="projects-heading" className={titles.sectionTitle}>Projects</h2>
        <ProjectsGrid projects={projects} />
      </section>
    </main>
    <Footer />
  </>
);

export default Home;
