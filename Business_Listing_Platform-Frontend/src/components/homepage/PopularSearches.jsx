import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getApiUrl, fetchWithAuth } from '../../config/api';
import { TrendingUp, ArrowRight } from 'lucide-react';

export default function PopularSearches({ selectedCity }) {
    const [searches, setSearches] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        generatePopularSearches();
    }, [selectedCity]);

    const generatePopularSearches = async () => {
        try {
            // Try to fetch from API if available
            const url = getApiUrl(`popular-searches?city=${selectedCity?._id || ''}`);
            const response = await fetchWithAuth(url);

            if (response.ok) {
                const data = await response.json();
                setSearches(data.data || generateDefaultSearches());
            } else {
                setSearches(generateDefaultSearches());
            }
        } catch (err) {
            // Fallback to default searches
            setSearches(generateDefaultSearches());
        } finally {
            setLoading(false);
        }
    };

    const generateDefaultSearches = () => {
        const cityName = selectedCity?.name || 'Your City';
        return [
            { title: `Restaurants in ${cityName}`, query: 'Restaurant' },
            { title: `Salon in ${cityName}`, query: 'Salon' },
            { title: `Doctors in ${cityName}`, query: 'Doctor' },
            { title: `Hotels in ${cityName}`, query: 'Hotel' },
            { title: `Plumbers in ${cityName}`, query: 'Plumber' },
            { title: `Car Repair in ${cityName}`, query: 'Car Repair' },
            { title: `Electricians in ${cityName}`, query: 'Electrician' },
            { title: `Gyms in ${cityName}`, query: 'Gym' },
        ];
    };

    return (
        <div className="bg-white py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="flex items-center gap-3 mb-10">
                    <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">Popular Searches</h2>
                        <p className="text-slate-600 text-sm mt-1">Most searched services in your area</p>
                    </div>
                </div>

                {/* Search Links Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                        {[...Array(8)].map((_, idx) => (
                            <div key={idx} className="h-12 bg-slate-100 rounded-lg animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                        {searches.map((search, idx) => (
                            <Link
                                key={idx}
                                to={`/search?q=${encodeURIComponent(search.query)}&city=${selectedCity?._id || ''}`}
                                className="flex items-center justify-between p-4 bg-slate-50 hover:bg-orange-50 rounded-lg transition-colors group"
                            >
                                <span className="font-medium text-slate-900 group-hover:text-orange-600">
                                    {search.title}
                                </span>
                                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-orange-600 transition-colors" />
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
