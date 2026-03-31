import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import Logo from '../ui/Logo';

export default function Footer() {
    const { settings } = useTheme();
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-slate-900 text-slate-300">
            {/* Main Footer */}
            <div className="border-b border-slate-800 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8">
                        {/* Brand */}
                        <div className="space-y-4">
                            <Link to="/" className="flex items-center gap-2">
                                <Logo 
                                    settings={settings} 
                                    className="h-8" 
                                    imgClassName="max-w-[150px] object-contain brightness-0 invert"
                                    fallbackClassName="font-bold text-lg text-white"
                                />
                            </Link>
                            <p className="text-sm">
                                Your trusted business directory platform for discovering and listing services.
                            </p>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h4 className="font-semibold text-white mb-4">Quick Links</h4>
                            <ul className="space-y-2 text-sm">
                                <li>
                                    <Link to="/" className="hover:text-orange-400 transition-colors">
                                        Home
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/free-listing" className="hover:text-orange-400 transition-colors">
                                        List Business
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/search" className="hover:text-orange-400 transition-colors">
                                        Search Businesses
                                    </Link>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-orange-400 transition-colors">
                                        Advertise With Us
                                    </a>
                                </li>
                            </ul>
                        </div>

                        {/* Popular Searches */}
                        <div>
                            <h4 className="font-semibold text-white mb-4">Popular</h4>
                            <ul className="space-y-2 text-sm">
                                <li>
                                    <Link to="/search?q=restaurant" className="hover:text-orange-400 transition-colors">
                                        Restaurants
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/search?q=salon" className="hover:text-orange-400 transition-colors">
                                        Salon & Spa
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/search?q=doctor" className="hover:text-orange-400 transition-colors">
                                        Doctors
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/search?q=hotel" className="hover:text-orange-400 transition-colors">
                                        Hotels
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Company */}
                        <div>
                            <h4 className="font-semibold text-white mb-4">Company</h4>
                            <ul className="space-y-2 text-sm">
                                <li>
                                    <a href="#" className="hover:text-orange-400 transition-colors">
                                        About Us
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-orange-400 transition-colors">
                                        Contact Us
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-orange-400 transition-colors">
                                        Terms of Service
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="hover:text-orange-400 transition-colors">
                                        Privacy Policy
                                    </a>
                                </li>
                            </ul>
                        </div>

                        {/* Contact */}
                        <div>
                            <h4 className="font-semibold text-white mb-4">Contact</h4>
                            <ul className="space-y-3 text-sm">
                                <li className="flex items-start gap-2">
                                    <Mail className="w-4 h-4 mt-1 flex-shrink-0" />
                                    <a href={`mailto:support@${settings?.siteName ? settings.siteName.toLowerCase().replace(/\s+/g, '') : 'fuertedevelopers'}.com`} className="hover:text-orange-400 transition-colors">
                                        support@{settings?.siteName ? settings.siteName.toLowerCase().replace(/\s+/g, '') : 'fuertedevelopers'}.com
                                    </a>
                                </li>
                                <li className="flex items-start gap-2">
                                    <Phone className="w-4 h-4 mt-1 flex-shrink-0" />
                                    <a href="tel:+91-1234567890" className="hover:text-orange-400 transition-colors">
                                        +91-1234567890
                                    </a>
                                </li>
                                <li className="flex items-start gap-2">
                                    <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
                                    <span>Delhi, India</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Footer */}
            <div className="py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                        {/* Copyright */}
                        <p className="text-sm text-slate-400">
                            © {currentYear} {settings?.siteName || 'Fuerte Developers'}. All rights reserved. | Built with ❤️ for businesses and customers
                        </p>

                        {/* Social Icons */}
                        <div className="flex items-center gap-4">
                            <a
                                href="#"
                                className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center hover:bg-orange-600 transition-colors"
                                title="Facebook"
                            >
                                <Facebook className="w-4 h-4" />
                            </a>
                            <a
                                href="#"
                                className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center hover:bg-orange-600 transition-colors"
                                title="Twitter"
                            >
                                <Twitter className="w-4 h-4" />
                            </a>
                            <a
                                href="#"
                                className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center hover:bg-orange-600 transition-colors"
                                title="Instagram"
                            >
                                <Instagram className="w-4 h-4" />
                            </a>
                            <a
                                href="#"
                                className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center hover:bg-orange-600 transition-colors"
                                title="LinkedIn"
                            >
                                <Linkedin className="w-4 h-4" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
