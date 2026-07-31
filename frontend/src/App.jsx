import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Topbar from './components/Topbar'
import Dashboard from './pages/Dashboard'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import Categories from './pages/Categories'
import Suppliers from './pages/Suppliers'
import Movements from './pages/Movements'
import Login from './pages/Login'
import ProtectedRoute from './components/ProtectedRoute'

function AppLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background text-white">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="md:ml-64">
        <Topbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/*" element={
          <ProtectedRoute>
            <AppLayout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/:id" element={<ProductDetail />} />
                <Route path="/categories" element={<Categories />} />
                <Route path="/suppliers" element={<Suppliers />} />
                <Route path="/movements" element={<Movements />} />
              </Routes>
            </AppLayout>
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  )
}

export default App