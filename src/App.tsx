import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import ChatBot from './components/ChatBot';
import Home from './pages/Home';
import About from './pages/About';
import Products from './pages/Products';
import WomenCare from './pages/WomenCare';
import BabyCare from './pages/BabyCare';
import Distributor from './pages/Distributor';
import Contact from './pages/Contact';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminProducts from './pages/AdminProducts';
import { CartProvider } from './context/CartContext';

function App() {
  return (
    <CartProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-black">
          <Routes>
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/products" element={<AdminProducts />} />
            <Route
              path="*"
              element={
                <>
                  <Header />
                  <main className="flex-grow">
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/about" element={<About />} />
                      <Route path="/products" element={<Products />} />
                      <Route path="/women-care" element={<WomenCare />} />
                      <Route path="/baby-care" element={<BabyCare />} />
                      <Route path="/distributor" element={<Distributor />} />
                      <Route path="/contact" element={<Contact />} />
                      <Route path="/cart" element={<Cart />} />
                      <Route path="/checkout" element={<Checkout />} />
                      <Route path="/order-confirmation/:sessionId" element={<OrderConfirmation />} />
                    </Routes>
                  </main>
                  <Footer />
                  <ChatBot />
                </>
              }
            />
          </Routes>
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;
