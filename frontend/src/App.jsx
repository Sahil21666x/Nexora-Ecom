import React, { useEffect, useState } from "react";
import Layout from "@/app/layout";
import { Route, Router, Routes } from "react-router-dom";
import Products from "./components/Products";
import Cart from "./components/Cart";
import Checkout from "./components/Checkout";


function App() {

  return (
   
      <Routes>
        <Route path="/" element={<Layout><Products/></Layout>} />
        <Route path="/cart" element={<Layout><Cart/></Layout>} />
        <Route path="/checkout" element={<Layout><Checkout/></Layout>} />
      </Routes>
  
  );
}

export default App;