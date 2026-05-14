import Navbar from './components/Navbar';
import Hero from './components/Hero';
import BookingWidget from './components/BookingWidget';
import Footer from './components/Footer';

const Home = () => {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <BookingWidget />
      </main>
      <Footer />
    </>
  );
};

export default Home;
