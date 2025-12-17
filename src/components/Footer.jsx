import { Link } from 'react-router-dom'
import { 
  MapPinIcon, 
  PhoneIcon, 
  EnvelopeIcon 
} from '@heroicons/react/24/outline'

const Footer = () => {
  return (
    <footer className="bg-wastra-brown-800 text-white mt-auto">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-wastra-brown-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">W</span>
              </div>
              <div>
                <div className="text-xl font-semibold text-white">
                  Wastra Digital
                </div>
                <div className="text-xs text-wastra-brown-300 -mt-1">
                  Kain Tradisional Bali
                </div>
              </div>
            </div>
            <p className="text-wastra-brown-300 leading-relaxed max-w-md">
              Marketplace digital untuk mempromosikan dan memasarkan 
              kain tradisional endek & songket dari Desa Sidemen, 
              Karangasem, Bali.
            </p>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Tautan Cepat</h4>
            <ul className="space-y-3 text-wastra-brown-300">
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  Beranda
                </Link>
              </li>
              <li>
                <Link to="/produk" className="hover:text-white transition-colors">
                  Katalog Produk
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-white transition-colors">
                  Admin Dashboard
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Kontak</h4>
            <ul className="space-y-3 text-wastra-brown-300">
              <li className="flex items-start gap-3">
                <MapPinIcon className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <span>Desa Sidemen, Karangasem, Bali</span>
              </li>
              <li className="flex items-center gap-3">
                <PhoneIcon className="w-5 h-5 flex-shrink-0" />
                <span>+62 XXX XXX XXXX</span>
              </li>
              <li className="flex items-center gap-3">
                <EnvelopeIcon className="w-5 h-5 flex-shrink-0" />
                <span>info@wastradigital.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-wastra-brown-700 mt-12 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-wastra-brown-300 text-sm">
            <p>&copy; {new Date().getFullYear()} Wastra Digital. Hak Cipta Dilindungi.</p>
            <div className="flex items-center gap-6">
              <Link to="#" className="hover:text-white transition-colors">Kebijakan Privasi</Link>
              <Link to="#" className="hover:text-white transition-colors">Syarat & Ketentuan</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
