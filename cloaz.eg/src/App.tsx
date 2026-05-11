import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React, { useState, useEffect } from "react";
import ScrollToTop from "./components/common/ScrollToTop";
import Preloader from "./components/common/Preloader";
import HomePage from "./pages/HomePage";
import StorePage from "./pages/StorePage";
import CategoriesPage from "./pages/CategoriesPage";
import ProductPage from "./pages/ProductPage";
import CheckoutPage from "./pages/CheckoutPage";
import AuthPage from "./pages/AuthPage";
import ContactPage from "./pages/ContactPage";
import AboutPage from "./pages/AboutPage";
import AdminPage from "./pages/AdminPage";
import { CartProvider } from "./context/CartContext";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import CartDrawer from "./components/cart/CartDrawer";
import { subscribeToProducts } from "./services/productService";

/**
 * المكون الرئيسي للتطبيق (App Component)
 * يدير التنقل بين الصفحات المختلفة.
 * وتم إضافة مكونات الغلاف مثل ThemeProvider وغيرها.
 */
export default function App() {
  const [isAppLoading, setIsAppLoading] = useState(true);

  useEffect(() => {
    // We listen to the first batch of products to consider the app "ready"
    const unsubscribe = subscribeToProducts(() => {
      // Small delay for smooth transition
      setTimeout(() => {
        setIsAppLoading(false);
      }, 1000);
    });

    return () => unsubscribe();
  }, []);

  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <Router>
          <ScrollToTop />
          <Preloader isLoading={isAppLoading} />
          <CartDrawer />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/store" element={<StorePage />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/product/:id" element={<ProductPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/login" element={<AuthPage />} />
            <Route path="/signup" element={<AuthPage />} />
            <Route path="/admin/*" element={<AdminPage />} />
            {/* Fallback for other links mentioned in request (Category and Contact are just anchors for now) */}
            <Route path="/category" element={<CategoriesPage />} />
            <Route path="/contact" element={<ContactPage />} />
          </Routes>
        </Router>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
