import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Utensils, Hotel, HeartPulse, Dumbbell, 
    BookOpen, CreditCard, Sparkles, ShoppingBag,
    ChevronRight
} from 'lucide-react';

const QUICK_FILTERS = [
    { id: 'restaurants', name: 'Restaurants', icon: Utensils, color: 'bg-orange-50 text-orange-600 border-orange-100' },
    { id: 'hotels', name: 'Hotels', icon: Hotel, color: 'bg-blue-50 text-blue-600 border-blue-100' },
    { id: 'hospitals', name: 'Hospitals', icon: HeartPulse, color: 'bg-rose-50 text-rose-600 border-rose-100' },
    { id: 'gym', name: 'Gyms', icon: Dumbbell, color: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
    { id: 'education', name: 'Schools', icon: BookOpen, color: 'bg-violet-50 text-violet-600 border-violet-100' },
    { id: 'atm', name: 'ATMs', icon: CreditCard, color: 'bg-amber-50 text-amber-600 border-amber-100' },
    { id: 'beauty-spa', name: 'Spas', icon: Sparkles, color: 'bg-pink-50 text-pink-600 border-pink-100' },
    { id: 'shopping', name: 'Shopping', icon: ShoppingBag, color: 'bg-indigo-50 text-indigo-600 border-indigo-100' },
];

export default function NearMeChips({ selectedCity }) {
    const navigate = useNavigate();

    const handleFilterClick = (filterId) => {
        const cityQuery = selectedCity ? `&location=${selectedCity.name}` : '';
        navigate(`/search?category=${filterId}${cityQuery}`);
    };

    return (
        <div className="w-full bg-white pb-8 -mt-2">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <span className="w-8 h-[1px] bg-slate-200"></span>
                        Quick Discovery {selectedCity && `in ${selectedCity.name}`}
                    </h2>
                </div>
                
                <div className="flex items-center gap-3 overflow-x-auto pb-4 no-scrollbar">
                    {QUICK_FILTERS.map((filter) => (
                        <button
                            key={filter.id}
                            onClick={() => handleFilterClick(filter.id)}
                            className={`flex-none flex items-center gap-2.5 px-5 py-2.5 rounded-full border ${filter.color} hover:shadow-md transition-all active:scale-95 group font-bold text-[13px]`}
                        >
                            <filter.icon className="w-4 h-4" />
                            <span>{filter.name} Near Me</span>
                        </button>
                    ))}
                    
                    <button className="flex-none flex items-center gap-2 px-4 py-2 text-slate-400 hover:text-slate-600 font-bold text-[13px] transition-colors">
                        View More <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}} />
        </div>
    );
}
