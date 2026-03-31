import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
    ArrowLeft, Save, Building2, MapPin, 
    AlertTriangle, CheckCircle, Shield, 
    Star, Clock, Trash2, ExternalLink 
} from "lucide-react";
import { API_BASE_URL, fetchWithAuth } from "../../config/api";
import ImageUploadBox from "../../components/ui/ImageUploadBox";
import LocationSelector from "../../components/location/LocationSelector";
import FormSelect from "../../components/ui/FormSelect";
import FormInput from "../../components/ui/FormInput";
import { FormTextarea } from "../../components/ui/FormTextarea";
import { Button } from "../../components/ui/button";

export default function EditCompany() {
    const { id } = useParams();
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

    // Fetch initial data
    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                
                // Fetch Categories, Users, and Company data in parallel
                const [catsRes, usersRes, companyRes] = await Promise.all([
                    fetchWithAuth(`${API_BASE_URL}/categories`),
                    fetchWithAuth(`${API_BASE_URL}/users`),
                    fetchWithAuth(`${API_BASE_URL}/companies/${id}`)
                ]);

                if (catsRes.ok) setCategories(await catsRes.json());
                if (usersRes.ok) setAllUsers(await usersRes.json());
                
                if (companyRes.ok) {
                    const company = await companyRes.json();
                    
                    setFormData({
                        name: company.name || "",
                        category: company.category || "",
                        description: company.description || "",
                        country_id: company.country_id?._id || company.country_id || "",
                        state_id: company.state_id?._id || company.state_id || "",
                        city_id: company.city_id?._id || company.city_id || "",
                        area_id: company.area_id?._id || company.area_id || "",
                        address: company.address || "",
                        latitude: company.latitude || null,
                        longitude: company.longitude || null,
                        status: company.status || "Pending",
                        claimed: company.claimed || false,
                        verified: company.verified || false,
                        verificationStatus: company.verificationStatus || "Not Verified",
                        isFeatured: company.isFeatured || false,
                        manualRank: company.manualRank || 0,
                        image: company.image || null,
                        owner: company.owner?._id || company.owner || ""
                    });
                    setImagePreview(company.image || null);
                } else {
                    const errData = await companyRes.json();
                    setError(errData.msg || "Failed to fetch company details.");
                }
            } catch (err) {
                console.error("Fetch Edit Data Error:", err);
                setError("Network error. Please try again.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [id]);

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
                
                // Simulate progress
                const progressInterval = setInterval(() => {
                    setUploadProgress(prev => prev < 90 ? prev + 5 : prev);
                }, 200);

                const uploadRes = await fetchWithAuth(`${API_BASE_URL}/upload`, {
                    method: 'POST',
                    body: uploadData
                });
                
                clearInterval(progressInterval);
                setUploadProgress(100);
                
                const uploadResult = await uploadRes.json();
                if (!uploadRes.ok) {
                    setError(uploadResult.msg || "Image upload failed.");
                    setIsSaving(false);
                    return;
                }
                imageUrl = uploadResult.url;
            }

            const payload = { ...formData, image: imageUrl };
            const res = await fetchWithAuth(`${API_BASE_URL}/companies/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                setSuccess("Company updated successfully!");
                setTimeout(() => setSuccess(null), 3000);
            } else {
                const data = await res.json();
                setError(data.msg || "Failed to update company.");
            }
        } catch (err) {
            setError("Network error. Please try again.");
        } finally {
            setIsSaving(false);
            setUploadProgress(0);
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-slate-500 font-medium animate-pulse text-lg">Loading listing data...</p>
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
                            Edit Listing
                        </h1>
                        <p className="text-sm text-slate-500 font-medium mt-1">
                            Modify business information, location and verification status
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <Button 
                        variant="outline" 
                        onClick={() => navigate(-1)}
                        className="flex-1 sm:flex-none"
                    >
                        Discard Changes
                    </Button>
                    <Button 
                        onClick={handleSubmit} 
                        isLoading={isSaving}
                        className="flex-1 sm:flex-none min-w-[140px]"
                    >
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                    </Button>
                </div>
            </div>

            {/* Notifications */}
            {error && (
                <div className="px-5 py-4 bg-rose-50 border border-rose-100 text-rose-700 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                    <AlertTriangle className="w-5 h-5 shrink-0" />
                    <span className="font-semibold">{error}</span>
                </div>
            )}
            {success && (
                <div className="px-5 py-4 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                    <CheckCircle className="w-5 h-5 shrink-0" />
                    <span className="font-semibold">{success}</span>
                </div>
            )}

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
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider px-1">
                            Higher values prioritize this listing in search results.
                        </p>
                    </div>
                </div>
            </form>
        </div>
    );
}
