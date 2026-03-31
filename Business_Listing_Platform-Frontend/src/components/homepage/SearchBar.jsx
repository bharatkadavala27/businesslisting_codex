import { useNavigate } from 'react-router-dom';
import SearchInputGroup from '../ui/SearchInputGroup';

export default function SearchBar({ selectedCity, cities = [] }) {
    return (
        <div className="w-full bg-white pt-8 pb-6">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Hero Title */}
                <div className="mb-6">
                    <h1 className="text-[32px] md:text-[40px] font-bold text-slate-800 tracking-tight leading-tight">
                        Search across ' 5.9 Crore+' <span className="text-blue-500">Products & Services</span>
                    </h1>
                </div>

                <div className="flex flex-col lg:flex-row items-center gap-4">
                    {/* Search Wrapper */}
                    <div className="w-full lg:flex-1">
                        <SearchInputGroup selectedCity={selectedCity} cities={cities} variant="hero" />
                    </div>

                    {/* Download App Button */}
                    <button className="hidden lg:flex items-center gap-2 border border-slate-300 rounded hover:border-slate-400 transition-colors bg-white px-4 h-[56px] shadow-sm flex-none">
                        <span className="text-[14px] font-semibold text-slate-700">Download App</span>
                        <div className="w-6 h-8 border border-slate-800 rounded flex items-center justify-center relative bg-white">
                            <span className="text-[10px] font-black text-orange-500">Jd</span>
                            <div className="absolute top-0.5 left-1/2 -translate-x-1/2 w-2 h-px bg-slate-300"></div>
                            <div className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-slate-200"></div>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
}
