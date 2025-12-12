import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Home,
  DollarSign,
  MapPin,
  Building2,
  BedDouble,
  Bath,
  Square,
  Layers,
  Calendar,
  Car,
  TreePine,
  Shield,
  Waves,
  Wifi,
  Tv,
  AirVent,
  UtensilsCrossed,
  Dumbbell,
  Plus,
  X,
  Upload,
  Image as ImageIcon,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Navigation,
} from 'lucide-react';
import Button from '../../components/UI/Button.js';
import Input from '../../components/UI/Input.js';
import LocationPickerModal, { type LocationInfo } from '../../components/LocationPickerModal.js';
import { useToast } from '../../contexts/index.js';
import { useAppDispatch, useAppSelector } from '../../store/hooks.js';
import { fetchPropertyTypes } from '../../store/thunks/propertiesThunks.js';
import propertiesService from '../../api/properties.service.js';
import type { CreatePropertyDto, RealEstateProperty } from '../../api/types.js';
import type { RootState } from '../../store/index.js';

// Default property types (fallback if API fails)
const DEFAULT_PROPERTY_TYPES = [
  'House',
  'Apartment',
  'Land',
  'Commercial',
  'Office',
  'Villa',
  'Townhouse',
  'Studio',
  'Plot',
  'Warehouse',
  'Shop',
  'Hotel',
];

const LISTING_TYPES = ['Sale', 'Rent'];

const CURRENCIES = ['TZS', 'USD', 'EUR'];

// Image type for managing existing and new images
type ImageItem = {
  id?: string; // Media ID for existing images
  file?: File; // New file upload
  preview: string; // Preview URL
  isExisting?: boolean; // Whether it's an existing image from DB
};

export default function EditProperty() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const toast = useToast();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [loadingProperty, setLoadingProperty] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [property, setProperty] = useState<RealEstateProperty | null>(null);

  // Get property types from Redux state
  const propertyTypes = useAppSelector((state: RootState) => state.properties.propertyTypes);

  const [formData, setFormData] = useState<CreatePropertyDto>({
    title: '',
    description: '',
    propertyType: '',
    listingType: '',
    rentalType: '',
    price: 0,
    currency: 'TZS',
    bedrooms: undefined,
    bathrooms: undefined,
    size: undefined,
    landSize: undefined,
    floor: undefined,
    totalFloors: undefined,
    yearBuilt: undefined,
    address: '',
    district: '',
    region: '',
    ward: '',
    latitude: undefined,
    longitude: undefined,
    features: undefined,
    ownerType: 'Owner',
    contactName: '',
    contactPhone: '',
    contactEmail: '',
    expiresAt: undefined,
  });

  const [showCustomFeatureForm, setShowCustomFeatureForm] = useState<boolean>(false);
  const [customFeatureKey, setCustomFeatureKey] = useState<string>('');
  const [customFeatureValue, setCustomFeatureValue] = useState<string>('');
  const [images, setImages] = useState<ImageItem[]>([]);
  const [removedImageIds, setRemovedImageIds] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [showPropertyTypeOptions, setShowPropertyTypeOptions] = useState<boolean>(false);
  const [filteredPropertyTypes, setFilteredPropertyTypes] = useState<string[]>(
    propertyTypes.length > 0 ? propertyTypes : DEFAULT_PROPERTY_TYPES
  );
  const [isLocationPickerOpen, setIsLocationPickerOpen] = useState<boolean>(false);

  // Fetch property types from API on component mount
  useEffect(() => {
    dispatch(fetchPropertyTypes());
  }, [dispatch]);

  // Update filtered property types when propertyTypes from Redux changes
  useEffect(() => {
    if (propertyTypes.length > 0) {
      setFilteredPropertyTypes(propertyTypes);
    }
  }, [propertyTypes]);

  // Common features with icons
  const commonFeatures = [
    { key: 'parking', label: 'Parking', icon: Car, color: 'blue' },
    { key: 'garden', label: 'Garden', icon: TreePine, color: 'green' },
    { key: 'security', label: 'Security', icon: Shield, color: 'red' },
    { key: 'swimmingPool', label: 'Swimming Pool', icon: Waves, color: 'cyan' },
    { key: 'wifi', label: 'WiFi', icon: Wifi, color: 'purple' },
    { key: 'tv', label: 'TV', icon: Tv, color: 'indigo' },
    { key: 'airConditioning', label: 'Air Conditioning', icon: AirVent, color: 'sky' },
    { key: 'kitchen', label: 'Kitchen', icon: UtensilsCrossed, color: 'orange' },
    { key: 'gym', label: 'Gym', icon: Dumbbell, color: 'pink' },
  ];

  // Load property data
  useEffect(() => {
    const loadProperty = async () => {
      if (!id) {
        setError('Property ID is required');
        setLoadingProperty(false);
        return;
      }

      try {
        setLoadingProperty(true);
        const propertyData = await propertiesService.getPropertyById(id);
        setProperty(propertyData);

        // Helper function to convert Decimal (string) or number to number
        const toNumber = (value: string | number | undefined | null): number | undefined => {
          if (value === undefined || value === null) return undefined;
          if (typeof value === 'number') return value;
          if (typeof value === 'string') {
            const num = parseFloat(value);
            return isNaN(num) ? undefined : num;
          }
          return undefined;
        };

        // Populate form data
        setFormData({
          title: propertyData.title || '',
          description: propertyData.description || '',
          propertyType: propertyData.propertyType || '',
          listingType: propertyData.listingType || '',
          rentalType: propertyData.rentalType || '',
          price: toNumber(propertyData.price) ?? 0,
          currency: propertyData.currency || 'TZS',
          bedrooms: propertyData.bedrooms ?? undefined,
          bathrooms: propertyData.bathrooms ?? undefined,
          size: toNumber(propertyData.size),
          landSize: toNumber(propertyData.landSize),
          floor: propertyData.floor ?? undefined,
          totalFloors: propertyData.totalFloors ?? undefined,
          yearBuilt: propertyData.yearBuilt ?? undefined,
          address: propertyData.address || '',
          district: propertyData.district || '',
          region: propertyData.region || '',
          ward: propertyData.ward || '',
          latitude: toNumber(propertyData.latitude),
          longitude: toNumber(propertyData.longitude),
          features: propertyData.features as Record<string, unknown> | undefined,
          ownerType: propertyData.ownerType || 'Owner',
          contactName: propertyData.contactName || '',
          contactPhone: propertyData.contactPhone || '',
          contactEmail: propertyData.contactEmail || '',
          expiresAt: propertyData.expiresAt ? new Date(propertyData.expiresAt).toISOString().slice(0, 16) : undefined,
        });

        // Load existing images
        if (propertyData.media && propertyData.media.length > 0) {
          const existingImages: ImageItem[] = propertyData.media.map((media) => ({
            id: media.id,
            preview: media.url,
            isExisting: true,
          }));
          setImages(existingImages);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load property');
      } finally {
        setLoadingProperty(false);
      }
    };

    loadProperty();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = {
      ...prev,
      [name]:
        name === 'price' ||
        name === 'size' ||
        name === 'landSize' ||
        name === 'bedrooms' ||
        name === 'bathrooms' ||
        name === 'floor' ||
        name === 'totalFloors' ||
        name === 'yearBuilt' ||
        name === 'latitude' ||
        name === 'longitude'
          ? value === '' ? undefined : Number(value)
          : value,
      };
      // Clear rentalType when listingType changes from rent to sale
      if (name === 'listingType' && value !== 'rent') {
        updated.rentalType = '';
      }
      return updated;
    });
    setError(null);
    
    // Filter property types when typing in propertyType field
    if (name === 'propertyType') {
      const searchValue = value.toLowerCase().trim();
      const typesToFilter = propertyTypes.length > 0 ? propertyTypes : DEFAULT_PROPERTY_TYPES;
      if (searchValue) {
        const filtered = typesToFilter.filter((type) =>
          type.toLowerCase().includes(searchValue)
        );
        setFilteredPropertyTypes(filtered.length > 0 ? filtered : typesToFilter);
      } else {
        setFilteredPropertyTypes(typesToFilter);
      }
      setShowPropertyTypeOptions(true);
    }
  };

  const toggleFeature = (key: string) => {
    setFormData((prev) => {
      const currentFeatures = prev.features || {};
      const newFeatures = { ...currentFeatures };
      
      if (newFeatures[key]) {
        delete newFeatures[key];
      } else {
        newFeatures[key] = true;
      }

      return {
        ...prev,
        features: Object.keys(newFeatures).length > 0 ? newFeatures : undefined,
      };
    });
  };

  const addCustomFeature = () => {
    if (!customFeatureKey.trim()) return;

    setFormData((prev) => {
      const currentFeatures = prev.features || {};
      const key = customFeatureKey.trim();
      let value: unknown = true;

      // Try to parse as boolean or number
      if (customFeatureValue.trim().toLowerCase() === 'true') {
        value = true;
      } else if (customFeatureValue.trim().toLowerCase() === 'false') {
        value = false;
      } else if (!isNaN(Number(customFeatureValue.trim())) && customFeatureValue.trim() !== '') {
        value = Number(customFeatureValue.trim());
      } else if (customFeatureValue.trim() !== '') {
        value = customFeatureValue.trim();
      }

      return {
        ...prev,
        features: {
          ...currentFeatures,
          [key]: value,
        },
      };
    });

    setCustomFeatureKey('');
    setCustomFeatureValue('');
    setShowCustomFeatureForm(false);
  };

  const cancelCustomFeature = () => {
    setCustomFeatureKey('');
    setCustomFeatureValue('');
    setShowCustomFeatureForm(false);
  };

  const removeCustomFeature = (key: string) => {
    setFormData((prev) => {
      const currentFeatures = prev.features || {};
      const newFeatures = { ...currentFeatures };
      delete newFeatures[key];

      return {
        ...prev,
        features: Object.keys(newFeatures).length > 0 ? newFeatures : undefined,
      };
    });
  };

  const handleImageSelect = (files: FileList | null) => {
    if (!files) return;

    const newImages = Array.from(files)
      .filter((file) => file.type.startsWith('image/'))
      .slice(0, 10 - images.length) // Limit to 10 images total
      .map((file) => ({
        file,
        preview: URL.createObjectURL(file),
        isExisting: false,
      }));

    setImages((prev) => [...prev, ...newImages]);
  };

  const handleImageRemove = (index: number) => {
    setImages((prev) => {
      const imageToRemove = prev[index];
      
      // If it's an existing image, add its ID to removedImageIds
      if (imageToRemove.id && imageToRemove.isExisting) {
        setRemovedImageIds((prevIds) => [...prevIds, imageToRemove.id!]);
      }

      // Revoke object URL if it's a blob
      if (imageToRemove.preview.startsWith('blob:')) {
        URL.revokeObjectURL(imageToRemove.preview);
      }

      const newImages = [...prev];
      newImages.splice(index, 1);
      return newImages;
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleImageSelect(e.dataTransfer.files);
  };

  // Cleanup image preview URLs on unmount
  useEffect(() => {
    return () => {
      images.forEach((img) => {
        // Only revoke object URLs (blob:), not external URLs (http/https)
        if (img.preview.startsWith('blob:')) {
          URL.revokeObjectURL(img.preview);
        }
      });
    };
  }, [images]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!id) return;

    setError(null);
    setLoading(true);

    try {
      // Validate required fields
      if (
        !formData.title?.trim() ||
        !formData.propertyType ||
        !formData.listingType ||
        !formData.address?.trim() ||
        !formData.price ||
        formData.price <= 0
      ) {
        setError('Please fill in all required fields');
        setLoading(false);
        return;
      }

      // Separate image files and URLs
      const imageFiles: File[] = [];
      const imageUrls: string[] = [];

      images.forEach((img) => {
        // Check if it's a File object (uploaded) or a URL (from scraped property)
        if (img.file && img.file instanceof File) {
          imageFiles.push(img.file);
        } else if (img.preview && !img.preview.startsWith('blob:') && !img.isExisting) {
          // It's an external URL (from scraped property), not an existing image
          imageUrls.push(img.preview);
        }
      });

      await propertiesService.updateProperty(
        id,
        formData,
        imageFiles.length > 0 ? imageFiles : undefined,
        imageUrls.length > 0 ? imageUrls : undefined,
        removedImageIds.length > 0 ? removedImageIds : undefined
      );
      toast.success('Property Updated', 'Your property has been successfully updated.');
      navigate(`/properties/${id}`, { replace: true });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update property';
      setError(errorMessage);
      toast.error('Update Failed', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (loadingProperty) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-sky-50/30">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading property...</p>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-sky-50/30">
        <div className="text-center">
          <p className="text-red-600 mb-4">Property not found</p>
          <Button onClick={() => navigate(-1)}>Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-gray-50 via-white to-sky-50/30">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          {/* Back Button */}
          <div className="mb-6">
            <motion.div
              whileHover={{ x: -2 }}
              whileTap={{ scale: 0.97 }}
              className="inline-block"
            >
              <Button
                variant="ghost"
                size="sm"
                leftIcon={
                  <motion.div
                    animate={{
                      x: [0, -2, 0],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  >
                    <ArrowLeft size={18} />
                  </motion.div>
                }
                onClick={() => navigate(-1)}
                className="group relative px-4 py-2.5 bg-white/70 backdrop-blur-md border border-gray-200/60 rounded-xl shadow-sm hover:shadow-md hover:bg-white/90 hover:border-sky-300/50 transition-all duration-300 overflow-hidden"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-sky-50/0 via-cyan-50/0 to-teal-50/0 group-hover:from-sky-50/50 group-hover:via-cyan-50/50 group-hover:to-teal-50/50 rounded-xl transition-all duration-300"
                  initial={false}
                />
                <span className="relative z-10 text-sm font-semibold text-gray-700 group-hover:text-sky-700 transition-colors duration-300">
                  Back
                </span>
                <motion.div
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0 bg-gradient-to-b from-sky-500 to-cyan-500 rounded-r-full group-hover:h-8 transition-all duration-300"
                  initial={false}
                />
              </Button>
            </motion.div>
          </div>

          {/* Main Header Content */}
          <div className="relative">
            <div className="absolute -top-4 -left-4 w-32 h-32 bg-gradient-to-br from-sky-400/20 via-cyan-400/20 to-teal-400/20 rounded-full blur-3xl -z-10" />
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-gradient-to-tr from-indigo-400/20 via-purple-400/20 to-pink-400/20 rounded-full blur-2xl -z-10" />

            <div className="relative bg-white/60 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-6 sm:p-8 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex-1">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-amber-100 to-orange-100 rounded-full border border-amber-200/50 mb-4">
                    <div className="w-2 h-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full animate-pulse" />
                    <span className="text-xs font-semibold text-amber-700 uppercase tracking-wide">
                      Edit Property
                    </span>
                  </div>

                  <h1 className="text-4xl sm:text-5xl font-bold mb-3">
                    <span className="bg-gradient-to-r from-gray-900 via-sky-800 to-cyan-800 bg-clip-text text-transparent">
                      Edit Property
                    </span>
                  </h1>

                  <p className="text-gray-600 text-base sm:text-lg max-w-2xl">
                    Update your property listing details and information
                  </p>
                </div>

                <div className="hidden sm:flex items-center justify-center">
                  <motion.div
                    animate={{
                      rotate: [0, 5, -5, 0],
                      scale: [1, 1.05, 1],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                    className="relative"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-400/30 to-orange-400/30 rounded-2xl blur-xl" />
                    <div className="relative p-4 bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 rounded-2xl shadow-lg">
                      <Home className="w-8 h-8 text-white" />
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Progress Indicator */}
              <div className="mt-6 pt-6 border-t border-gray-200/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-gray-500">Form Progress</span>
                  <span className="text-xs font-semibold text-sky-600">
                    {(() => {
                      const requiredFields = [
                        formData.title?.trim(),
                        formData.propertyType,
                        formData.listingType,
                        formData.address?.trim(),
                        formData.price > 0,
                      ];
                      const filledCount = requiredFields.filter(Boolean).length;
                      return filledCount === requiredFields.length ? 'Ready to Update' : `${filledCount}/${requiredFields.length} Required`;
                    })()}
                  </span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 rounded-full"
                    initial={{ width: '0%' }}
                    animate={{
                      width: `${
                        (() => {
                          const requiredFields = [
                            formData.title?.trim(),
                            formData.propertyType,
                            formData.listingType,
                            formData.address?.trim(),
                            formData.price > 0,
                          ];
                          const filledCount = requiredFields.filter(Boolean).length;
                          return (filledCount / requiredFields.length) * 100;
                        })()
                      }%`,
                    }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Form - Reuse the same form structure from AddProperty */}
        {/* For brevity, I'll include a note that the form sections are identical to AddProperty */}
        {/* The form structure would be the same as AddProperty.tsx but with "Update Property" button */}
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* Images Upload Section - Same as AddProperty */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-200/50 p-6 sm:p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-pink-100 rounded-lg">
                  <ImageIcon className="w-5 h-5 text-pink-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Property Images</h2>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {images.map((image, index) => (
                  <motion.div
                    key={image.id || index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="group relative aspect-square rounded-xl overflow-hidden border-2 border-gray-200 hover:border-sky-300 transition-all duration-300 shadow-sm hover:shadow-md"
                  >
                    <img
                      src={image.preview}
                      alt={`Property image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <Button
                        type="button"
                        variant="danger"
                        size="sm"
                        onClick={() => handleImageRemove(index)}
                        leftIcon={<Trash2 size={16} />}
                        className="shadow-lg"
                      >
                        Remove
                      </Button>
                    </div>
                    {index === 0 && (
                      <div className="absolute top-2 left-2 px-2 py-1 bg-sky-500 text-white text-xs font-bold rounded-lg shadow-md">
                        Main
                      </div>
                    )}
                    {image.isExisting && (
                      <div className="absolute top-2 right-2 px-2 py-1 bg-green-500 text-white text-xs font-bold rounded-lg shadow-md">
                        Existing
                      </div>
                    )}
                  </motion.div>
                ))}

                {images.length < 10 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`group relative aspect-square rounded-xl overflow-hidden border-2 border-dashed transition-all duration-300 cursor-pointer ${
                      isDragging
                        ? 'border-sky-500 bg-sky-50 scale-[1.02] shadow-lg'
                        : 'border-gray-300 hover:border-sky-400 hover:bg-sky-50/30'
                    }`}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => handleImageSelect(e.target.files)}
                      className="hidden"
                      id="image-upload"
                      disabled={images.length >= 10}
                    />
                    <label
                      htmlFor="image-upload"
                      className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-4 cursor-pointer"
                    >
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-3 bg-gradient-to-br from-sky-100 to-cyan-100 rounded-xl group-hover:from-sky-200 group-hover:to-cyan-200 transition-all duration-300"
                      >
                        <Upload className="w-6 h-6 text-sky-600" />
                      </motion.div>
                      <div className="text-center">
                        <p className="text-xs font-semibold text-gray-700 mb-1">
                          {isDragging ? 'Drop here' : 'Add Image'}
                        </p>
                        <p className="text-[10px] text-gray-500">
                          {10 - images.length} left
                        </p>
                      </div>
                    </label>
                  </motion.div>
                )}
              </div>

              {images.length === 0 && (
                <p className="text-sm text-gray-500 text-center mt-4">
                  Drag and drop images or click the card above to upload
                </p>
              )}
            </motion.div>

            {/* Basic Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-200/50 p-6 sm:p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-sky-100 rounded-lg">
                  <Home className="w-5 h-5 text-sky-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Basic Information</h2>
              </div>

              <div className="space-y-5">
                <Input
                  label="Property Title *"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g., Beautiful 3-bedroom house in Kinondoni"
                  required
                  fullWidth
                />

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe the property in detail..."
                    rows={4}
                    className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 bg-white focus:border-sky-500 focus:ring-4 focus:ring-sky-100 transition-all duration-200 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-1.5 min-w-0">
                    <label className="text-sm font-semibold text-gray-700 px-1 flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-sky-600" />
                      Property Type *
                    </label>
                    <div className="relative flex-1 min-w-0 group">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-10">
                        <Building2 className="w-5 h-5 text-gray-400 group-focus-within:text-sky-500 transition-colors duration-200" />
                      </div>
                      <input
                        type="text"
                        name="propertyType"
                        value={formData.propertyType}
                        onChange={handleChange}
                        onFocus={() => {
                          setShowPropertyTypeOptions(true);
                          const typesToUse = propertyTypes.length > 0 ? propertyTypes : DEFAULT_PROPERTY_TYPES;
                          setFilteredPropertyTypes(typesToUse);
                        }}
                        onBlur={() => {
                          setTimeout(() => setShowPropertyTypeOptions(false), 200);
                        }}
                        placeholder="Select or type property type"
                        autoComplete="off"
                        required
                        className="w-full pl-11 pr-12 py-2.5 rounded-xl border-2 border-gray-200 bg-white hover:border-gray-300 focus:border-sky-500 focus:ring-4 focus:ring-sky-100 transition-all duration-200 focus:outline-none shadow-sm hover:shadow-md focus:shadow-lg"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPropertyTypeOptions(!showPropertyTypeOptions)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                      >
                        <svg
                          className={`w-5 h-5 text-gray-400 group-focus-within:text-sky-500 transition-all duration-200 ${
                            showPropertyTypeOptions ? 'rotate-180' : ''
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </button>
                      
                      {/* Property Type Options Dropdown */}
                      {showPropertyTypeOptions && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl border-2 border-gray-200 shadow-xl z-50 max-h-64 overflow-y-auto"
                        >
                          <div className="p-2">
                            {filteredPropertyTypes.length > 0 ? (
                              <>
                                <p className="text-xs font-semibold text-gray-500 px-3 py-2 mb-1">
                                  {filteredPropertyTypes.length === (propertyTypes.length > 0 ? propertyTypes.length : DEFAULT_PROPERTY_TYPES.length)
                                    ? 'Common Types'
                                    : `Matching Types (${filteredPropertyTypes.length})`}
                                </p>
                                <div className="grid grid-cols-2 gap-2">
                                  {filteredPropertyTypes.map((type) => (
                                    <motion.button
                                      key={type}
                                      type="button"
                                      onClick={() => {
                                        setFormData((prev) => ({ ...prev, propertyType: type }));
                                        setShowPropertyTypeOptions(false);
                                        const typesToUse = propertyTypes.length > 0 ? propertyTypes : DEFAULT_PROPERTY_TYPES;
                                        setFilteredPropertyTypes(typesToUse);
                                      }}
                                      whileHover={{ scale: 1.02 }}
                                      whileTap={{ scale: 0.98 }}
                                      className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 text-left ${
                                        formData.propertyType.toLowerCase() === type.toLowerCase()
                                          ? 'bg-gradient-to-r from-sky-500 to-cyan-500 text-white shadow-md shadow-sky-500/30'
                                          : 'bg-gray-50 hover:bg-sky-50 text-gray-700 hover:text-sky-700 border border-gray-200 hover:border-sky-300'
                                      }`}
                                    >
                                      <div className="flex items-center gap-2">
                                        <Building2
                                          className={`w-4 h-4 ${
                                            formData.propertyType.toLowerCase() === type.toLowerCase()
                                              ? 'text-white'
                                              : 'text-sky-600'
                                          }`}
                                        />
                                        <span>{type}</span>
                                      </div>
                                    </motion.button>
                                  ))}
                                </div>
                              </>
                            ) : (
                              <p className="text-xs text-gray-500 px-3 py-2">
                                No matching types. Type a custom property type above.
                              </p>
                            )}
                            {filteredPropertyTypes.length > 0 && (
                              <div className="mt-3 pt-3 border-t border-gray-200">
                                <p className="text-xs text-gray-500 px-3 mb-2">
                                  Or type a custom property type above
                                </p>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </div>
                    {formData.propertyType && (
                      <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-xs text-gray-500 px-1 flex items-center gap-1"
                      >
                        <span className="w-1.5 h-1.5 bg-sky-500 rounded-full"></span>
                        {(propertyTypes.length > 0 ? propertyTypes : DEFAULT_PROPERTY_TYPES).some(
                          (type) => type.toLowerCase() === formData.propertyType.toLowerCase()
                        )
                          ? 'Common property type'
                          : 'Custom property type'}
                      </motion.p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Listing Type *
                    </label>
                    <select
                      name="listingType"
                      value={formData.listingType}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 bg-white focus:border-sky-500 focus:ring-4 focus:ring-sky-100 transition-all duration-200 focus:outline-none"
                    >
                      <option value="">Select listing type</option>
                      {LISTING_TYPES.map((type) => (
                        <option key={type} value={type.toLowerCase()}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Rental Type - Only show when listingType is rent */}
                {formData.listingType === 'rent' && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Rental Type
                    </label>
                    <select
                      name="rentalType"
                      value={formData.rentalType}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 bg-white focus:border-sky-500 focus:ring-4 focus:ring-sky-100 transition-all duration-200 focus:outline-none"
                    >
                      <option value="">Select rental type</option>
                      <option value="residential">Residential</option>
                      <option value="short-term">Short term</option>
                      <option value="holiday">Holiday</option>
                    </select>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Pricing */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-200/50 p-6 sm:p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <DollarSign className="w-5 h-5 text-emerald-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Pricing</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Input
                  label="Price *"
                  name="price"
                  type="number"
                  value={formData.price || ''}
                  onChange={handleChange}
                  placeholder="0"
                  required
                  fullWidth
                />

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Currency
                  </label>
                  <select
                    name="currency"
                    value={formData.currency}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 bg-white focus:border-sky-500 focus:ring-4 focus:ring-sky-100 transition-all duration-200 focus:outline-none"
                  >
                    {CURRENCIES.map((currency) => (
                      <option key={currency} value={currency}>
                        {currency}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </motion.div>

            {/* Property Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-200/50 p-6 sm:p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Building2 className="w-5 h-5 text-purple-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Property Details</h2>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
                <Input
                  label="Bedrooms"
                  name="bedrooms"
                  type="number"
                  value={formData.bedrooms || ''}
                  onChange={handleChange}
                  placeholder="0"
                  icon={<BedDouble size={18} />}
                  fullWidth
                />

                <Input
                  label="Bathrooms"
                  name="bathrooms"
                  type="number"
                  value={formData.bathrooms || ''}
                  onChange={handleChange}
                  placeholder="0"
                  icon={<Bath size={18} />}
                  fullWidth
                />

                <Input
                  label="Size (m²)"
                  name="size"
                  type="number"
                  value={formData.size || ''}
                  onChange={handleChange}
                  placeholder="0"
                  icon={<Square size={18} />}
                  fullWidth
                />

                <Input
                  label="Land Size (m²)"
                  name="landSize"
                  type="number"
                  value={formData.landSize || ''}
                  onChange={handleChange}
                  placeholder="0"
                  icon={<Square size={18} />}
                  fullWidth
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-5">
                <Input
                  label="Floor"
                  name="floor"
                  type="number"
                  value={formData.floor || ''}
                  onChange={handleChange}
                  placeholder="0"
                  icon={<Layers size={18} />}
                  fullWidth
                />

                <Input
                  label="Total Floors"
                  name="totalFloors"
                  type="number"
                  value={formData.totalFloors || ''}
                  onChange={handleChange}
                  placeholder="0"
                  icon={<Layers size={18} />}
                  fullWidth
                />

                <Input
                  label="Year Built"
                  name="yearBuilt"
                  type="number"
                  value={formData.yearBuilt || ''}
                  onChange={handleChange}
                  placeholder="2024"
                  icon={<Calendar size={18} />}
                  fullWidth
                />
              </div>
            </motion.div>

            {/* Location */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-200/50 p-6 sm:p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <MapPin className="w-5 h-5 text-orange-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Location</h2>
              </div>

              <div className="space-y-6">
                {/* Location Picker - Prominent Call to Action */}
                <div className="relative p-6 bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50 rounded-xl border-2 border-sky-200">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-sky-500 rounded-lg shadow-sm">
                          <Navigation className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">
                            {formData.latitude && formData.longitude
                              ? 'Location Selected ✓'
                              : 'Select Property Location'}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {formData.latitude && formData.longitude
                              ? 'Click below to change the location'
                              : 'Choose your property location on the interactive map'}
                          </p>
                        </div>
                      </div>
                      
                      {/* Status Indicator */}
                      {formData.latitude && formData.longitude ? (
                        <div className="flex items-center gap-2 mt-3 text-sm text-emerald-700">
                          <CheckCircle2 className="w-4 h-4" />
                          <span className="font-medium">Location coordinates set</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 mt-3 text-sm text-amber-700">
                          <AlertCircle className="w-4 h-4" />
                          <span className="font-medium">Location required - Please select on map</span>
                        </div>
                      )}
                    </div>
                    
                    <Button
                      type="button"
                      variant={formData.latitude && formData.longitude ? 'outline' : 'primary'}
                      size="lg"
                      onClick={() => setIsLocationPickerOpen(true)}
                      leftIcon={<MapPin size={20} />}
                      className="whitespace-nowrap shadow-lg hover:shadow-xl transition-all"
                    >
                      {formData.latitude && formData.longitude ? 'Change Location' : 'Select on Map'}
                    </Button>
                  </div>
                </div>

                {/* Coordinates Display */}
                {formData.latitude && formData.longitude && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <MapPin className="w-4 h-4 text-gray-600" />
                      <span className="text-sm font-semibold text-gray-700">Coordinates</span>
                </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1.5">Latitude</label>
                        <div className="px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 font-mono text-sm">
                          {Number(formData.latitude).toFixed(6)}
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1.5">Longitude</label>
                        <div className="px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 font-mono text-sm">
                          {Number(formData.longitude).toFixed(6)}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Address Information - Read-only Display */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <h3 className="text-sm font-semibold text-gray-700">
                      Address Information
                      {formData.address && (
                        <span className="ml-2 text-xs text-emerald-600 font-normal">
                          (Auto-filled from map)
                        </span>
                      )}
                    </h3>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Address <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="px-4 py-3 rounded-xl border-2 border-gray-200 bg-gray-50 text-gray-900 min-h-[48px] flex items-center">
                          {formData.address ? (
                            <span className="text-sm">{formData.address}</span>
                          ) : (
                            <span className="text-sm text-gray-400 italic">
                              Address will appear here after selecting location on map
                            </span>
                          )}
                        </div>
                        {!formData.address && (
                          <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            <AlertCircle className="w-4 h-4 text-amber-500" />
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Region
                        </label>
                        <div className="px-4 py-3 rounded-xl border-2 border-gray-200 bg-gray-50 text-gray-900 min-h-[48px] flex items-center">
                          {formData.region ? (
                            <span className="text-sm">{formData.region}</span>
                          ) : (
                            <span className="text-sm text-gray-400 italic">Not available</span>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          District
                        </label>
                        <div className="px-4 py-3 rounded-xl border-2 border-gray-200 bg-gray-50 text-gray-900 min-h-[48px] flex items-center">
                          {formData.district ? (
                            <span className="text-sm">{formData.district}</span>
                          ) : (
                            <span className="text-sm text-gray-400 italic">Not available</span>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Ward
                        </label>
                        <div className="px-4 py-3 rounded-xl border-2 border-gray-200 bg-gray-50 text-gray-900 min-h-[48px] flex items-center">
                          {formData.ward ? (
                            <span className="text-sm">{formData.ward}</span>
                          ) : (
                            <span className="text-sm text-gray-400 italic">Not available</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Helper Text */}
                  {!formData.address && (
                    <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                      <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-xs text-amber-800 font-medium mb-1">
                          Location selection required
                        </p>
                        <p className="text-xs text-amber-700">
                          Click the "Select on Map" button above to choose your property location. All address fields will be automatically filled from the map.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-200/50 p-6 sm:p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <Building2 className="w-5 h-5 text-indigo-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Features & Amenities</h2>
              </div>

              {/* Common Features */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-4">
                  Common Features
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {commonFeatures.map((feature) => {
                    const Icon = feature.icon;
                    const isSelected = formData.features?.[feature.key] === true;
                    const colorClasses = {
                      blue: isSelected ? 'bg-blue-500 text-white border-blue-500' : 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100',
                      green: isSelected ? 'bg-green-500 text-white border-green-500' : 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100',
                      red: isSelected ? 'bg-red-500 text-white border-red-500' : 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100',
                      cyan: isSelected ? 'bg-cyan-500 text-white border-cyan-500' : 'bg-cyan-50 text-cyan-700 border-cyan-200 hover:bg-cyan-100',
                      purple: isSelected ? 'bg-purple-500 text-white border-purple-500' : 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100',
                      indigo: isSelected ? 'bg-indigo-500 text-white border-indigo-500' : 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100',
                      sky: isSelected ? 'bg-sky-500 text-white border-sky-500' : 'bg-sky-50 text-sky-700 border-sky-200 hover:bg-sky-100',
                      orange: isSelected ? 'bg-orange-500 text-white border-orange-500' : 'bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100',
                      pink: isSelected ? 'bg-pink-500 text-white border-pink-500' : 'bg-pink-50 text-pink-700 border-pink-200 hover:bg-pink-100',
                    };

                    return (
                      <button
                        key={feature.key}
                        type="button"
                        onClick={() => toggleFeature(feature.key)}
                        className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 transition-all duration-200 font-medium text-sm ${
                          colorClasses[feature.color as keyof typeof colorClasses]
                        } ${isSelected ? 'shadow-md scale-105' : 'hover:scale-102'}`}
                      >
                        <Icon size={18} />
                        <span>{feature.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom Features */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-sm font-semibold text-gray-700">
                    Custom Features
                  </label>
                  {!showCustomFeatureForm && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setShowCustomFeatureForm(true)}
                      leftIcon={<Plus size={16} />}
                    >
                      Add Custom Feature
                    </Button>
                  )}
                </div>

                {showCustomFeatureForm && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-4 p-4 bg-gray-50 rounded-xl border-2 border-gray-200"
                  >
                    <div className="space-y-3">
                      <Input
                        label="Feature Name"
                        placeholder="e.g., balcony, elevator, fireplace"
                        value={customFeatureKey}
                        onChange={(e) => setCustomFeatureKey(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && customFeatureKey.trim()) {
                            e.preventDefault();
                            addCustomFeature();
                          }
                        }}
                        fullWidth
                      />
                      <Input
                        label="Value (Optional)"
                        placeholder="true, false, number, or text"
                        value={customFeatureValue}
                        onChange={(e) => setCustomFeatureValue(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && customFeatureKey.trim()) {
                            e.preventDefault();
                            addCustomFeature();
                          }
                        }}
                        helperText="Leave empty for 'true', or enter: true/false, a number, or text"
                        fullWidth
                      />
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="primary"
                          size="sm"
                          onClick={addCustomFeature}
                          disabled={!customFeatureKey.trim()}
                          leftIcon={<Plus size={16} />}
                        >
                          Add Feature
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={cancelCustomFeature}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {formData.features && Object.keys(formData.features).some(
                  (key) => !commonFeatures.find((f) => f.key === key)
                ) && (
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(formData.features)
                      .filter(([key]) => !commonFeatures.find((f) => f.key === key))
                      .map(([key, value]) => (
                        <motion.div
                          key={key}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border-2 border-indigo-200 shadow-sm"
                        >
                          <span className="text-sm font-semibold text-gray-800">
                            {key}
                            {value !== true && (
                              <span className="text-gray-500 font-normal ml-1">
                                : {String(value)}
                              </span>
                            )}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeCustomFeature(key)}
                            className="p-1 hover:bg-red-100 rounded-lg transition-colors group"
                            aria-label={`Remove ${key}`}
                          >
                            <X size={14} className="text-gray-500 group-hover:text-red-600" />
                          </button>
                        </motion.div>
                      ))}
                  </div>
                )}
              </div>

              {formData.features && Object.keys(formData.features).length > 0 && (
                <div className="mt-4 p-4 bg-sky-50 rounded-xl border border-sky-200">
                  <p className="text-sm font-semibold text-sky-900 mb-2">
                    Selected Features ({Object.keys(formData.features).length})
                  </p>
                  <p className="text-xs text-sky-700 font-mono">
                    {JSON.stringify(formData.features, null, 2)}
                  </p>
                </div>
              )}
            </motion.div>


            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border-2 border-red-200 rounded-xl p-4"
              >
                <p className="text-red-700 font-medium">{error}</p>
              </motion.div>
            )}

            {/* Form Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex items-center justify-end gap-4 pt-4"
            >
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(`/properties/${id}`)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary" loading={loading} size="lg">
                Update Property
              </Button>
            </motion.div>
          </div>
        </form>

        {/* Location Picker Modal */}
        <LocationPickerModal
          isOpen={isLocationPickerOpen}
          onClose={() => setIsLocationPickerOpen(false)}
          initialLocation={{
            lat: formData.latitude || -6.7924,
            lng: formData.longitude || 39.2083,
          }}
          onConfirm={(locationInfo: LocationInfo) => {
            setFormData((prev) => ({
              ...prev,
              latitude: locationInfo.lat,
              longitude: locationInfo.lng,
              // Auto-fill address fields from geocoding result
              address: locationInfo.address || locationInfo.formatted_address || prev.address,
              district: locationInfo.district || prev.district,
              region: locationInfo.region || locationInfo.city || prev.region,
              ward: locationInfo.ward || prev.ward,
            }));
            setIsLocationPickerOpen(false);
          }}
        />
      </motion.div>
    </div>
  );
}

