import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Header from '../components/homepage/Header';
import SearchBar from '../components/homepage/SearchBar';
import HeroBanners from '../components/homepage/HeroBanners';
import CategoryGrid from '../components/homepage/CategoryGrid';
import FeaturedBusinesses from '../components/homepage/FeaturedBusinesses';
import AdvertisementBanner from '../components/homepage/AdvertisementBanner';
import PopularSearches from '../components/homepage/PopularSearches';
import LatestBusinesses from '../components/homepage/LatestBusinesses';
import FreeListingCTA from '../components/homepage/FreeListingCTA';
import ReviewsSection from '../components/homepage/ReviewsSection';
import MobileAppPromotion from '../components/homepage/MobileAppPromotion';
import Footer from '../components/homepage/Footer';
import NearMeChips from '../components/homepage/NearMeChips';
import RecentlyViewed from '../components/homepage/RecentlyViewed';
import { getApiUrl, fetchWithAuth } from '../config/api';
import { SAMPLE_CITIES } from '../data/sampleData';
import { getDeviceLocation, findNearestCity } from '../utils/geolocation';

export default function HomePage() {
    const [cities, setCities] = useState([]);
    const [selectedCity, setSelectedCity] = useState(null);
    const [loadingCities, setLoadingCities] = useState(true);
    const [userLocation, setUserLocation] = useState(null);
    const [locationError, setLocationError] = useState(null);

    useEffect(() => {
        fetchCities();
        detectUserLocation();

        // Listen for location detection events
        const handleLocationDetected = (event) => {
            const { latitude, longitude } = event.detail;
            const nearest = findNearestCity(latitude, longitude, cities.length > 0 ? cities : SAMPLE_CITIES);
            if (nearest) {
                console.log('Nearest city detected from event:', nearest.name);
                setSelectedCity(nearest);
            }
        };

        window.addEventListener('locationdetected', handleLocationDetected);
        return () => window.removeEventListener('locationdetected', handleLocationDetected);
    }, []);

    const fetchCities = async () => {
        try {
            const url = getApiUrl('locations/cities?limit=50');
            const response = await fetchWithAuth(url);
            const data = await response.json();

            if (response.ok && data.data && data.data.length > 0) {
                const citiesData = data.data;
                setCities(citiesData);
                setSelectedCity(citiesData[0]);
            } else {
                console.log('Using sample cities data');
                setCities(SAMPLE_CITIES);
                setSelectedCity(SAMPLE_CITIES[0]);
            }
        } catch (err) {
            console.error('Error fetching cities, using sample data:', err);
            setCities(SAMPLE_CITIES);
            setSelectedCity(SAMPLE_CITIES[0]);
        } finally {
            setLoadingCities(false);
        }
    };

    const detectUserLocation = async () => {
        try {
            const location = await getDeviceLocation();
            setUserLocation(location);
            console.log('Device location:', location);

            // Wait for cities to load before finding nearest
            setTimeout(() => {
                if (cities.length > 0) {
                    const nearest = findNearestCity(location.latitude, location.longitude, cities);
                    if (nearest) {
                        console.log('Nearest city detected:', nearest.name);
                        setSelectedCity(nearest);
                    }
                } else {
                    const nearest = findNearestCity(location.latitude, location.longitude, SAMPLE_CITIES);
                    if (nearest) {
                        console.log('Nearest city detected (sample):', nearest.name);
                        setSelectedCity(nearest);
                    }
                }
            }, 300);
        } catch (err) {
            console.warn('Geolocation not available:', err.message);
            setLocationError(err.message);
            // Will use default city
        }
    };

    const handleCityChange = (cityId) => {
        const city = cities.find(c => c._id === cityId);
        if (city) {
            setSelectedCity(city);
        }
    };

    const handleSearch = (query) => {
        console.log('Search query:', query, 'City:', selectedCity);
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Header - Sticky */}
            <Header
                selectedCity={selectedCity || {}}
                cities={cities}
                onCityChange={handleCityChange}
                onSearch={handleSearch}
            />

            {/* Hero Search Section */}
            <SearchBar
                selectedCity={selectedCity}
                cities={cities}
            />

            {/* Recently Viewed */}
            <RecentlyViewed />

            {/* Banners */}
            <HeroBanners />

            {/* Category Grid */}
            <CategoryGrid />

            {/* Quick Filters (Near Me) */}
            <NearMeChips selectedCity={selectedCity} />

            {/* Advertisement Banner */}
            <AdvertisementBanner />

            {/* Featured Businesses */}
            <FeaturedBusinesses />

            {/* Popular Searches */}
            <PopularSearches selectedCity={selectedCity} />

            {/* Latest Businesses */}
            <LatestBusinesses />

            {/* Reviews Section */}
            <ReviewsSection />

            {/* Free Listing CTA */}
            <FreeListingCTA />

            {/* Mobile App Promotion */}
            <MobileAppPromotion />

            {/* Floating Side Tabs (Justdial Style) */}
            <div className="hidden lg:flex fixed right-0 top-1/2 -translate-y-1/2 z-50 flex-col gap-1">
                <Link 
                    to="/advertise" 
                    className="bg-[#ef4444] text-white text-[13px] font-bold py-6 px-1.5 rounded-l shadow-lg hover:pr-3 transition-all tracking-wide"
                    style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
                >
                    Advertise
                </Link>
                <Link 
                    to="/free-listing" 
                    className="bg-[#0a84d0] text-white text-[13px] font-bold py-6 px-1.5 rounded-l shadow-lg hover:pr-3 transition-all tracking-wide"
                    style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
                >
                    Free Listing
                </Link>
            </div>

            {/* Footer */}
            <Footer />
        </div>
    );
}
