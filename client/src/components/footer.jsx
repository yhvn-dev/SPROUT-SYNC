import { Leaf, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, ArrowRight } from 'lucide-react';


export function Footer() {
  
  
  return (
    <footer className="bg-[#003333] text-white ">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#027c68] to-[#009983] flex items-center justify-center">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold">SPROUTSYNC</span>
            </div>


            <p className="text-[#A8C7B8] mb-6 max-w-md">
              Committed to sustainable solutions and environmental innovation. Building a greener future, one step at a time.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-9 h-9 rounded-full bg-[#027c68] hover:bg-[#009983] flex items-center justify-center transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-[#027c68] hover:bg-[#009983] flex items-center justify-center transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-[#027c68] hover:bg-[#009983] flex items-center justify-center transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-[#027c68] hover:bg-[#009983] flex items-center justify-center transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-[#b0e892] font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-[#A8C7B8] hover:text-[#b0e892] transition-colors flex items-center gap-2 group">
                  <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-[#A8C7B8] hover:text-[#b0e892] transition-colors flex items-center gap-2 group">
                  <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Services
                </a>
              </li>
              <li>
                <a href="#" className="text-[#A8C7B8] hover:text-[#b0e892] transition-colors flex items-center gap-2 group">
                  <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Projects
                </a>
              </li>
              <li>
                <a href="#" className="text-[#A8C7B8] hover:text-[#b0e892] transition-colors flex items-center gap-2 group">
                  <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="text-[#A8C7B8] hover:text-[#b0e892] transition-colors flex items-center gap-2 group">
                  <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-[#b0e892] font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#027c68] mt-0.5 flex-shrink-0" />
                <span className="text-[#A8C7B8] text-sm">
                   Mamala 2 Sariaya Quezon <br />
                   4322, Quezon Province 
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-[#027c68] flex-shrink-0" />
                <a href="tel:+1234567890" className="text-[#A8C7B8] hover:text-[#b0e892] transition-colors text-sm">
                  +63 915 684 3701
                </a>
              </li>
              <li className="flex items-center gap-3">
               
              </li>
            </ul>
          </div>
        </div>

  

        {/* Bottom Bar */}
        <div className="border-t border-[#027c68] pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[#A8C7B8] text-sm">
            © 2025 SPROUTSYNC. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <a href="#" className="text-[#A8C7B8] hover:text-[#b0e892] transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-[#A8C7B8] hover:text-[#b0e892] transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-[#A8C7B8] hover:text-[#b0e892] transition-colors">
              Security Policy
            </a>
          </div>
        </div>
      </div>

      
    </footer>
  );
}