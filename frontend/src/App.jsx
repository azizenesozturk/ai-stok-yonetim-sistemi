import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Topbar from './components/Topbar'
import Dashboard from './pages/Dashboard'
import Products from './pages/Products'
import Movements from './pages/Movements'
import Categories from './pages/Categories'
import Suppliers from './pages/Suppliers'
import ProductDetail from './pages/ProductDetail'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background text-white">
        <Sidebar />
        <div className="ml-64">
          <Topbar />
          <main className="p-6">
            <Routes>
              <Route path="/products/:id" element={<ProductDetail />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/suppliers" element={<Suppliers />} />
              <Route path="/movements" element={<Movements />} />
              <Route path="/" element={<Dashboard />} />
              <Route path="/products" element={<Products />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App