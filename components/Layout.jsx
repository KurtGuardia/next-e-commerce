import { useContext, useEffect, useState } from 'react'
import Footer from './Footer'
import { ProductsContext } from './ProductsContext'

const Layout = ({ children }) => {
  const { setSelectedProducts } =
    useContext(ProductsContext)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (window.location.href.includes('success')) {
      setSelectedProducts([])
      setSuccess(true)
    }
  }, [])

  return (
    <div>
      <div className='p-5'>
        {success && (
          <div className='mb-5 bg-green-500 text-white text-lg p-5 rounded-xl'>
            Thanks for your order!
          </div>
        )}
        {children}
      </div>
      <Footer />{' '}
    </div>
  )
}

export default Layout
