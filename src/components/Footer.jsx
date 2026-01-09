import { Link } from 'react-router-dom'
import {
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline'

const Footer = () => {
  return (
    <footer className="bg-wastra-brown-800 text-white">
      <div className="max-w-7xl mx-auto px-6 py-12">

        {/* Top Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">

          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-wastra-brown-600 rounded-lg flex items-center justify-center">
                <span className="font-bold text-lg">W</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold">Wastra Digital</h3>
                <p className="text-xs text-wastra-brown-300 -mt-1">
                  Kain Tradisional Bali
                </p>
              </div>
            </div>

            <p className="text-wastra-brown-300 text-sm leading-relaxed max-w-md">
              Marketplace digital untuk mempromosikan dan memasarkan
              kain tradisional endek & songket dari Desa Sidemen,
              Karangasem, Bali.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-base font-semibold mb-4">Kontak</h4>
            <ul className="space-y-3 text-sm text-wastra-brown-300">
              <li className="flex gap-3">
                <MapPinIcon className="w-5 h-5 flex-shrink-0" />
                <span>Desa Sidemen, Karangasem, Bali</span>
              </li>
              <li className="flex gap-3">
                <PhoneIcon className="w-5 h-5 flex-shrink-0" />
                <span>+62 XXX XXX XXXX</span>
              </li>
              <li className="flex gap-3">
                <EnvelopeIcon className="w-5 h-5 flex-shrink-0" />
                <span>info@wastradigital.com</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Section */}
        <div className="border-t border-wastra-brown-700 mt-10 pt-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-wastra-brown-300">
            <p>
              © {new Date().getFullYear()} Wastra Digital. Hak Cipta Dilindungi.
            </p>
            <div className="flex gap-6">
              <Link to="#" className="hover:text-white transition">
                Kebijakan Privasi
              </Link>
              <Link to="#" className="hover:text-white transition">
                Syarat & Ketentuan
              </Link>
            </div>
          </div>
        </div>

      </div>
    </footer>
  )
}

export default Footer
