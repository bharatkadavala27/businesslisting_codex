import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
    ArrowLeft, Save, Building2, MapPin, 
    Shield, Star, Clock, Trash2, ExternalLink 
} from "lucide-react";
import { API_BASE_URL, fetchWithAuth } from "../../config/api";
import ImageUploadBox from "../../components/ui/ImageUploadBox";
import LocationSelector from "../../components/location/LocationSelector";
import FormSelect from "../../components/ui/FormSelect";
import FormInput from "../../components/ui/FormInput";
import { FormTextarea } from "../../components/ui/FormTextarea";
import { Button } from "../../components/ui/button";
import Alert from "../../components/ui/Alert";
import { Spinner } from "../../components/ui/Loading";

export default function CreateListing() {
    const navigate = useNavigate();
    
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    
    const [categories, setCategories] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    
    const defaultFormState = {
        name: "", category: "", description: "",
        country_id: "", state_id: "", city_id: "", area_id: "",
        address: "", latitude: null, longitude: null,
        status: "Pending", claimed: false, verified: false, 
        verificationStatus: "Not Verified", isFeatured: false, 
        manualRank: 0, image: null, owner: ""
    };
    
    const [formData, setFormData] = useState(defaultFormState);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);

    // Fetch initial data (Categories and Users)
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                setIsLoading(true);
                const [catsRes, usersRes] = await Promise.all([
                    fetchWithAuth(`${API_BASE_URL}/categories`),
                    fetchWithAuth(`${API_BASE_URL}/users`)
                ]);

                if (catsRes.ok) {
                    const catsData = await catsRes.json();
                    setCategories(Array.isArray(catsData) ? catsData : catsData.data || []);
                }
                if (usersRes.ok) {
                    const usersData = await usersRes.json();
                    setAllUsers(Array.isArray(usersData) ? usersData : usersData.data || []);
                }
            } catch (err) {
                console.error("Fetch Initial Data Error:", err);
                setError("Failed to load form requirements.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchInitialData();
    }, []);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        const finalValue = type === 'checkbox' ? checked : value;
        setFormData(prev => {
            const newState = { ...prev, [name]: finalValue };
            if (name === 'owner' && value) newState.claimed = true;
            if (name === 'claimed' && !finalValue) newState.owner = "";
            return newState;
        });
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        setIsSaving(true);
        
        try {
            let imageUrl = formData.image;

            if (imageFile) {
                const uploadData = new FormData();
                uploadData.append('image', imageFile);
                
                const uploadRes = await fetchWithAuth(`${API_BASE_URL}/upload`, {
                    method: 'POST',
                    body: uploadData
                });
                
                const uploadResult = await uploadRes.json();
                if (!uploadRes.ok) {
                    setError(uploadResult.msg || "Image upload failed.");
                    setIsSaving(false);
                    return;
                }
                imageUrl = uploadResult.url;
            }

            const payload = { ...formData, image: imageUrl };
            const res = await fetchWithAuth(`${API_BASE_URL}/admin/listings`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                setSuccess("Listing created successfully!");
                setTimeout(() => navigate('/admin/listings'), 2000);
            } else {
                const data = await res.json();
                setError(data.msg || "Failed to create listing.");
            }
        } catch (err) {
            setError("Network error. Please try again.");
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <Spinner label="Initializing form..." />
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-8 pb-20">
            {/* Header / Navigation */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-6">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => navigate(-1)}
                        className="p-2.5 hover:bg-slate-100 rounded-xl text-slate-500 transition-colors group"
                    >
                        <ArrowLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
                            <Building2 className="w-7 h-7 text-indigo-600" />
                            Create New Listing
                        </h1>
                        <p className="text-sm text-slate-500 font-medium mt-1">
                            Add a new business presence to the platform
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <Button 
                        variant="outline" 
                        onClick={() => navigate(-1)}
                        className="flex-1 sm:flex-none"
                    >
                        Cancel
                    </Button>
                    <Button 
                        variant="primary"
                        onClick={handleSubmit} 
                        isLoading={isSaving}
                        leftIcon={Save}
                        className="flex-1 sm:flex-none min-w-[140px]"
                    >
                        Create Listing
                    </Button>
                </div>
            </div>

            {/* Notifications */}
            {error && <Alert type="error">{error}</Alert>}
            {success && <Alert type="success">{success}</Alert>}

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Core Details */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                        <div className="flex items-center gap-2 pb-2 border-b border-slate-50">
                            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
                                <Building2 className="w-5 h-5 text-indigo-600" />
                            </div>
                            <h2 className="font-black text-slate-800 uppercase tracking-widest text-xs">General Information</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormInput 
                                label="Business Name"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="e.g. Acme Corp"
                                required
                            />
                            <FormSelect
                                label="Primary Category"
                                name="category"
                                value={formData.category}
                                onChange={handleInputChange}
                                options={categories.map(cat => ({ value: cat.name, label: cat.name }))}
                            />
                        </div>

                        <FormTextarea 
                            label="Description"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            placeholder="Tell customers about this business..."
                            className="h-40"
                        />
                    </div>

                    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                        <div className="flex items-center gap-2 pb-2 border-b border-slate-50">
                            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
                                <MapPin className="w-5 h-5 text-indigo-600" />
                            </div>
                            <h2 className="font-black text-slate-800 uppercase tracking-widest text-xs">Location & Address</h2>
                        </div>

                        <LocationSelector
                            value={{
                                country_id: formData.country_id,
                                state_id: formData.state_id,
                                city_id: formData.city_id,
                                area_id: formData.area_id
                            }}
                            onChange={(loc) => setFormData(prev => ({ ...prev, ...loc }))}
                            showLabel={true}
                        />

                        <FormInput 
                            label="Street Address / Building"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            placeholder="House No, Suite, Area..."
                        />
                    </div>
                </div>

                {/* Right Column: Status & Images */}
                <div className="space-y-8">
                    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                        <h2 className="font-black text-slate-800 uppercase tracking-widest text-xs pb-2 border-b border-slate-50">Media</h2>
                        <ImageUploadBox
                            imagePreview={imagePreview}
                            isUploading={isSaving && uploadProgress > 0}
                            uploadProgress={uploadProgress}
                            onImageChange={handleImageUpload}
                            title="Company Branding"
                            subtitle="Logo or Storefront (Max 5MB)"
                        />
                    </div>

                    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                        <h2 className="font-black text-slate-800 uppercase tracking-widest text-xs pb-2 border-b border-slate-50">Management</h2>
                        
                        <div className="space-y-4">
                            <FormSelect
                                label="Assigned Owner"
                                name="owner"
                                value={formData.owner}
                                onChange={handleInputChange}
                                options={allUsers.map(u => ({ value: u._id, label: `${u.name} (${u.email})` }))}
                            />

                            <FormSelect
                                label="Profile Status"
                                name="status"
                                value={formData.status}
                                onChange={handleInputChange}
                                options={["Active", "Inactive", "Pending", "Flagged", "Suspended"]}
                            />

                            <FormSelect
                                label="Verification Review"
                                name="verificationStatus"
                                value={formData.verificationStatus}
                                onChange={handleInputChange}
                                options={["Not Verified", "Pending Review", "Verified", "Rejected"]}
                            />
                        </div>

                        <div className="pt-4 space-y-3">
                            <label className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100 cursor-pointer hover:bg-white hover:border-indigo-200 transition-all group">
                                <input 
                                    type="checkbox" 
                                    name="claimed" 
                                    checked={formData.claimed} 
                                    onChange={handleInputChange}
                                    className="w-5 h-5 rounded-lg border-slate-300 text-indigo-600 focus:ring-0" 
                                />
                                <span className="text-sm font-bold text-slate-700 group-hover:text-indigo-600">Claimed Business</span>
                            </label>

                            <label className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100 cursor-pointer hover:bg-white hover:border-indigo-200 transition-all group">
                                <input 
                                    type="checkbox" 
                                    name="verified" 
                                    checked={formData.verified} 
                                    onChange={handleInputChange}
                                    className="w-5 h-5 rounded-lg border-slate-300 text-indigo-600 focus:ring-0" 
                                />
                                <span className="text-sm font-bold text-slate-700 group-hover:text-indigo-600">Verified Badge</span>
                            </label>

                            <label className="flex items-center gap-3 p-3 bg-orange-50/30 rounded-2xl border border-orange-100/50 cursor-pointer hover:bg-white hover:border-orange-200 transition-all group">
                                <input 
                                    type="checkbox" 
                                    name="isFeatured" 
                                    checked={formData.isFeatured} 
                                    onChange={handleInputChange}
                                    className="w-5 h-5 rounded-lg border-orange-300 text-orange-600 focus:ring-0" 
                                />
                                <span className="text-sm font-black text-orange-600 uppercase tracking-widest">Featured Active</span>
                            </label>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                        <h2 className="font-black text-slate-800 uppercase tracking-widest text-xs pb-2 border-b border-slate-50">Ranking</h2>
                        <FormInput 
                            label="Manual Rank Boost"
                            type="number"
                            name="manualRank"
                            value={formData.manualRank}
                            onChange={handleInputChange}
                            placeholder="0"
                        />
                    </div>
                </div>
            </form>
        </div>
    );
}
