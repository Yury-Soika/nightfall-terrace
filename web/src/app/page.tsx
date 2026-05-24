import Navbar from './components/Navbar';
import Hero from './components/Hero';
import FeatureBlocks from './components/FeatureBlocks';
import MenuSection from './components/MenuSection';
import Gallery from './components/Gallery';
import About from './components/About';
import Hours from './components/Hours';
import BookingWidget from './components/BookingWidget';
import Footer from './components/Footer';

const Home = () => {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <FeatureBlocks />
        <MenuSection />
        <Gallery />
        <About />
        <Hours />
        <BookingWidget />
      </main>
      <Footer />
    </>
  );
};

export default Home;
