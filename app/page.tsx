import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Benefits from "./components/Benefits";
import WorkshopDetails from "./components/WorkshopDetails";
import Pricing from "./components/Pricing";
import EnrollmentForm from "./components/EnrollmentForm";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Benefits />
        <WorkshopDetails />
        <Pricing />
        <EnrollmentForm />
      </main>
      <Footer />
    </>
  );
}
