import { MapPin, Mail, Phone} from 'lucide-react';
export function Contact_Section(){
    
    
    return(
        <>
        {/* Contact Section */}
        <section id="#contact" className="py-24 bg-gradient-to-b from-[#E8F3ED] to-[#C4DED0]">
            <div className="max-w-7xl mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-16 items-center">
                <div>
                <h2 className="text-5xl md:text-6xl font-bold text-[#003333] mb-6">
                    Get in Touch
                </h2>
                <p className="text-xl text-[#5A8F73] mb-8 leading-relaxed">
                    Interested in implementing GreenLink at your farm? We'd love to discuss how our automatic plant watering system can transform your agricultural operations.
                </p>
                
                <div className="space-y-6">
                    <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-white shadow-lg flex items-center justify-center">
                        <Mail className="w-6 h-6 text-[#027c68]" />
                    </div>
                    <div>
                        <div className="text-sm text-[#5A8F73]">Email Us</div>
                        <div className="text-lg font-semibold text-[#003333]">info@greenlink.farm</div>
                    </div>
                    </div>
    
                    <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-white shadow-lg flex items-center justify-center">
                        <Phone className="w-6 h-6 text-[#027c68]" />
                    </div>
                    <div>
                        <div className="text-sm text-[#5A8F73]">Call Us</div>
                        <div className="text-lg font-semibold text-[#003333]">+63 XXX XXX XXXX</div>
                    </div>
                    </div>
    
                    <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-white shadow-lg flex items-center justify-center">
                        <MapPin className="w-6 h-6 text-[#027c68]" />
                    </div>
                    <div>
                        <div className="text-sm text-[#5A8F73]">Visit Us</div>
                        <div className="text-lg font-semibold text-[#003333]">FLOR and Daisy's Farm</div>
                    </div>
                    </div>
                </div>
                </div>
    
                <div className="bg-white rounded-3xl p-8 shadow-2xl">
                <h3 className="text-2xl font-bold text-[#003333] mb-6">Send a Message</h3>
                <form className="space-y-5">
                    <div>
                    <label className="block text-sm font-medium text-[#5A8F73] mb-2">Name</label>
                    <input 
                        type="text"
                        className="w-full px-4 py-3 rounded-xl border-2 border-[#C4DED0] focus:border-[#027c68] focus:outline-none transition-colors"
                        placeholder="Your name"
                    />
                    </div>
                    <div>
                    <label className="block text-sm font-medium text-[#5A8F73] mb-2">Email</label>
                    <input 
                        type="email"
                        className="w-full px-4 py-3 rounded-xl border-2 border-[#C4DED0] focus:border-[#027c68] focus:outline-none transition-colors"
                        placeholder="your@email.com"
                    />
                    </div>
                    <div>
                    <label className="block text-sm font-medium text-[#5A8F73] mb-2">Message</label>
                    <textarea 
                        rows="4"
                        className="w-full px-4 py-3 rounded-xl border-2 border-[#C4DED0] focus:border-[#027c68] focus:outline-none transition-colors resize-none"
                        placeholder="Tell us about your farm..."
                    ></textarea>
                    </div>
                    <button 
                    type="submit"
                    className="w-full py-4 bg-gradient-to-r from-[#027c68] to-[#009983] text-white rounded-xl font-semibold text-lg hover:shadow-xl transition-all"
                    >
                    Send Message
                    </button>
                </form>
                </div>
            </div>
            </div>
        </section>
        </>

    )
}