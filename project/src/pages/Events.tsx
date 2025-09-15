import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, Image, Video, FileText, Eye, X, Plus, Play, Download, Camera, Film, FolderOpen, Link } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../components/AuthProvider';
import toast from 'react-hot-toast';

interface MediaItem {
  id: string;
  title: string;
  description: string;
  media_type: 'photo' | 'video' | 'poster' | 'document';
  media_url: string;
  thumbnail_url?: string;
  department_id: string;
  is_featured: boolean;
  is_public: boolean;
  tags: string[];
  created_at: string;
}

interface Department {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
  bgImage: string;
}

const Events = () => {
  const { user } = useAuth();
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [activeMediaType, setActiveMediaType] = useState<'all' | 'photo' | 'video'>('all');
  const [uploadType, setUploadType] = useState<'photo' | 'video'>('photo');
  const [uploadMethod, setUploadMethod] = useState<'url' | 'file'>('url');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [uploadForm, setUploadForm] = useState({
    title: '',
    description: '',
    media_type: 'photo' as 'photo' | 'video' | 'poster' | 'document',
    media_url: '',
    tags: ''
  });

  const departments: Department[] = [
    {
      id: 'health-hygiene-wellbeing',
      name: 'Health Hygiene And Well-Being',
      description: 'Health awareness and wellness programs',
      color: 'from-red-500 to-rose-600',
      icon: '🏥',
      bgImage: '/1dd274a2-f49e-4b5e-a6a9-8136433c88f7.jpg'
    },
    {
      id: 'gender-equality',
      name: 'Gender Equality (GE)',
      description: 'Promoting gender equality and women empowerment',
      color: 'from-purple-500 to-pink-600',
      icon: '⚖️',
      bgImage: '/IMG-20250426-WA0016.jpg'
    },
    {
      id: 'environmental',
      name: 'Environmental',
      description: 'Environmental conservation and sustainability programs',
      color: 'from-green-600 to-teal-700',
      icon: '🌱',
      bgImage: '/IMG_20241025_105415.jpg'
    },
    {
      id: 'social-responsibility',
      name: 'Social Responsibility (SR)',
      description: 'Community service and social impact initiatives',
      color: 'from-green-500 to-emerald-600',
      icon: '🤝',
      bgImage: '/IMG_20250331_170101.jpg'
    },
    {
      id: 'sustainable-rural-development',
      name: 'Sustainable Rural Development (SRD)',
      description: 'Rural development and agricultural sustainability',
      color: 'from-amber-500 to-orange-600',
      icon: '🌾',
      bgImage: '/IMG_3779.JPG'
    },
    {
      id: 'education',
      name: 'Education',
      description: 'Educational programs and literacy initiatives',
      color: 'from-blue-500 to-indigo-600',
      icon: '📚',
      bgImage: '/IMG_20241102_141731.jpg'
    }
  ];

  useEffect(() => {
    if (selectedDepartment) {
      fetchDepartmentMedia();
    }
  }, [selectedDepartment]);

  const fetchDepartmentMedia = async () => {
    if (!selectedDepartment) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('event_media')
        .select('*')
        .eq('department_id', selectedDepartment.id)
        .eq('is_public', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMediaItems(data || []);
    } catch (error) {
      console.error('Error fetching media:', error);
      // Fallback to mock data for demonstration
      setMediaItems([
        {
          id: '1',
          title: 'Community Service Initiative',
          description: 'Students working together for community betterment',
          media_type: 'photo',
          media_url: selectedDepartment.bgImage,
          department_id: selectedDepartment.id,
          is_featured: true,
          is_public: true,
          tags: ['community', 'service'],
          created_at: '2024-01-15'
        },
        {
          id: '2',
          title: 'Department Activities Video',
          description: 'Highlights from our recent department activities',
          media_type: 'video',
          media_url: selectedDepartment.bgImage,
          department_id: selectedDepartment.id,
          is_featured: false,
          is_public: true,
          tags: ['activities', 'highlights'],
          created_at: '2024-01-10'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');
    
    if (uploadType === 'photo' && !isImage) {
      toast.error('Please select an image file');
      return;
    }
    
    if (uploadType === 'video' && !isVideo) {
      toast.error('Please select a video file');
      return;
    }

    // Validate file size (max 50MB for videos, 10MB for images)
    const maxSize = uploadType === 'video' ? 50 * 1024 * 1024 : 10 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error(`File size too large. Maximum ${uploadType === 'video' ? '50MB' : '10MB'} allowed.`);
      return;
    }

    setSelectedFile(file);
    
    // Create preview for images
    if (isImage) {
      const reader = new FileReader();
      reader.onload = (e) => setFilePreview(e.target?.result as string);
      reader.readAsDataURL(file);
    } else {
      setFilePreview(null);
    }

    // Auto-fill title if empty
    if (!uploadForm.title) {
      const fileName = file.name.split('.')[0];
      setUploadForm(prev => ({ ...prev, title: fileName }));
    }
  };

  const uploadFileToStorage = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${selectedDepartment?.id}/${uploadType}s/${fileName}`;

    // For demo purposes, we'll create a blob URL
    // In a real implementation, you would upload to Supabase Storage or another service
    const blobUrl = URL.createObjectURL(file);
    
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return blobUrl;
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDepartment) {
      toast.error('Please select a department');
      return;
    }

    setIsUploading(true);

    try {
      let mediaUrl = uploadForm.media_url;

      // Handle file upload
      if (uploadMethod === 'file' && selectedFile) {
        toast.loading('Uploading file...');
        mediaUrl = await uploadFileToStorage(selectedFile);
        toast.dismiss();
      }

      if (!mediaUrl) {
        toast.error('Please provide a media URL or select a file');
        setIsUploading(false);
        return;
      }

      const { error } = await supabase
        .from('event_media')
        .insert([{
          title: uploadForm.title,
          description: uploadForm.description,
          media_type: uploadForm.media_type,
          media_url: mediaUrl,
          department_id: selectedDepartment.id,
          uploaded_by: user?.id,
          is_featured: false,
          is_public: true,
          tags: uploadForm.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
        }]);

      if (error) throw error;

      toast.success(`${uploadType === 'photo' ? 'Photo' : 'Video'} uploaded successfully!`);
      setShowUploadForm(false);
      resetUploadForm();
      fetchDepartmentMedia();
    } catch (error) {
      console.error('Error uploading media:', error);
      toast.error('Failed to upload media');
    } finally {
      setIsUploading(false);
    }
  };

  const resetUploadForm = () => {
    setUploadForm({ title: '', description: '', media_type: 'photo', media_url: '', tags: '' });
    setSelectedFile(null);
    setFilePreview(null);
    setUploadMethod('url');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const openUploadForm = (type: 'photo' | 'video') => {
    setUploadType(type);
    setUploadForm({ ...uploadForm, media_type: type });
    setShowUploadForm(true);
    resetUploadForm();
  };

  const filteredMedia = mediaItems.filter(item => {
    if (activeMediaType === 'all') return true;
    if (activeMediaType === 'photo') return item.media_type === 'photo';
    if (activeMediaType === 'video') return item.media_type === 'video';
    return true;
  });

  const getMediaIcon = (type: string) => {
    switch (type) {
      case 'photo': return Image;
      case 'video': return Video;
      case 'poster': return FileText;
      case 'document': return FileText;
      default: return Image;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white py-20">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center space-y-6"
          >
            <h1 className="text-5xl lg:text-6xl font-bold">Our Departments</h1>
            <p className="text-xl lg:text-2xl text-blue-100 max-w-4xl mx-auto leading-relaxed">
              Explore our diverse social impact departments and their media collections.
            </p>
          </motion.div>
        </div>
      </section>

      {!selectedDepartment ? (
        /* Departments Grid */
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Choose a Department</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Click on any department to view and manage their media collection.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {departments.map((dept, index) => (
                <motion.div
                  key={dept.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group cursor-pointer"
                  onClick={() => setSelectedDepartment(dept)}
                >
                  <div className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform group-hover:scale-105">
                    <div className="absolute inset-0">
                      <img
                        src={dept.bgImage}
                        alt={dept.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Fallback to a default image if the local image fails to load
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://images.pexels.com/photos/6646918/pexels-photo-6646918.jpeg?auto=compress&cs=tinysrgb&w=800';
                        }}
                      />
                      <div className={`absolute inset-0 bg-gradient-to-br ${dept.color} opacity-85`}></div>
                    </div>
                    
                    <div className="relative p-8 text-white min-h-[280px] flex flex-col justify-between">
                      <div>
                        <div className="text-4xl mb-4">{dept.icon}</div>
                        <h3 className="text-xl font-bold mb-2">{dept.name}</h3>
                        <p className="text-white/90 text-sm leading-relaxed">{dept.description}</p>
                      </div>
                      <div className="mt-6 flex items-center text-white/90">
                        <span className="text-sm font-medium">View Media Collection</span>
                        <Eye className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      ) : (
        /* Department Media View */
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Department Header */}
            <div className="mb-8">
              <button
                onClick={() => setSelectedDepartment(null)}
                className="mb-4 text-blue-600 hover:text-blue-800 font-medium flex items-center space-x-2"
              >
                <span>← Back to Departments</span>
              </button>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="text-4xl">{selectedDepartment.icon}</div>
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900">{selectedDepartment.name}</h2>
                    <p className="text-gray-600">{selectedDepartment.description}</p>
                  </div>
                </div>
                
                {/* Upload Options */}
                <div className="flex space-x-3">
                  <button
                    onClick={() => openUploadForm('photo')}
                    className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center space-x-2"
                  >
                    <Camera className="h-5 w-5" />
                    <span>Upload Photo</span>
                  </button>
                  <button
                    onClick={() => openUploadForm('video')}
                    className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors duration-200 flex items-center space-x-2"
                  >
                    <Film className="h-5 w-5" />
                    <span>Upload Video</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Media Type Filter */}
            <div className="flex space-x-4 mb-8">
              <button
                onClick={() => setActiveMediaType('all')}
                className={`px-6 py-2 rounded-full font-medium transition-all duration-200 ${
                  activeMediaType === 'all'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All Media
              </button>
              <button
                onClick={() => setActiveMediaType('photo')}
                className={`px-6 py-2 rounded-full font-medium transition-all duration-200 flex items-center space-x-2 ${
                  activeMediaType === 'photo'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Image className="h-4 w-4" />
                <span>Photos</span>
              </button>
              <button
                onClick={() => setActiveMediaType('video')}
                className={`px-6 py-2 rounded-full font-medium transition-all duration-200 flex items-center space-x-2 ${
                  activeMediaType === 'video'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Video className="h-4 w-4" />
                <span>Videos</span>
              </button>
            </div>

            {/* Media Grid */}
            {loading ? (
              <div className="text-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading media...</p>
              </div>
            ) : filteredMedia.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">{selectedDepartment.icon}</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">No Media Found</h3>
                <p className="text-gray-600 mb-8">
                  No media items found for this department and filter.
                </p>
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={() => openUploadForm('photo')}
                    className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center space-x-2"
                  >
                    <Camera className="h-5 w-5" />
                    <span>Upload First Photo</span>
                  </button>
                  <button
                    onClick={() => openUploadForm('video')}
                    className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors duration-200 flex items-center space-x-2"
                  >
                    <Film className="h-5 w-5" />
                    <span>Upload First Video</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredMedia.map((item, index) => {
                  const MediaIcon = getMediaIcon(item.media_type);
                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.05 }}
                      className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer"
                      onClick={() => setSelectedMedia(item)}
                    >
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={item.media_url}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            // Fallback to department background if media fails to load
                            const target = e.target as HTMLImageElement;
                            target.src = selectedDepartment.bgImage;
                          }}
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="bg-white/90 p-3 rounded-full">
                              {item.media_type === 'video' ? (
                                <Play className="h-6 w-6 text-blue-600" />
                              ) : (
                                <Eye className="h-6 w-6 text-blue-600" />
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="absolute top-3 left-3">
                          <div className="bg-black/70 text-white p-2 rounded-lg">
                            <MediaIcon className="h-4 w-4" />
                          </div>
                        </div>
                        {item.is_featured && (
                          <div className="absolute top-3 right-3">
                            <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">Featured</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">{item.title}</h3>
                        <p className="text-gray-600 text-sm line-clamp-2 mb-2">{item.description}</p>
                        {item.tags && item.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {item.tags.slice(0, 2).map((tag, tagIndex) => (
                              <span key={tagIndex} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Enhanced Upload Form Modal */}
      {showUploadForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-3">
                  {uploadType === 'photo' ? (
                    <Camera className="h-6 w-6 text-green-600" />
                  ) : (
                    <Film className="h-6 w-6 text-purple-600" />
                  )}
                  <h3 className="text-2xl font-bold text-gray-900">
                    Upload {uploadType === 'photo' ? 'Photo' : 'Video'}
                  </h3>
                </div>
                <button
                  onClick={() => {
                    setShowUploadForm(false);
                    resetUploadForm();
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Upload Method Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">Upload Method</label>
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setUploadMethod('file')}
                    className={`flex-1 p-4 border-2 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 ${
                      uploadMethod === 'file'
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <FolderOpen className="h-5 w-5" />
                    <span>Upload from Device</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setUploadMethod('url')}
                    className={`flex-1 p-4 border-2 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 ${
                      uploadMethod === 'url'
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <Link className="h-5 w-5" />
                    <span>Use URL</span>
                  </button>
                </div>
              </div>

              <form onSubmit={handleUpload} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                  <input
                    type="text"
                    value={uploadForm.title}
                    onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={`Enter ${uploadType} title`}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={uploadForm.description}
                    onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={`Enter ${uploadType} description`}
                  />
                </div>

                {/* File Upload Section */}
                {uploadMethod === 'file' ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select {uploadType === 'photo' ? 'Image' : 'Video'} File *
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors duration-200">
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept={uploadType === 'photo' ? 'image/*' : 'video/*'}
                          onChange={handleFileSelect}
                          className="hidden"
                        />
                        {selectedFile ? (
                          <div className="space-y-4">
                            {filePreview && (
                              <img
                                src={filePreview}
                                alt="Preview"
                                className="max-h-32 mx-auto rounded-lg"
                              />
                            )}
                            <div className="text-sm text-gray-600">
                              <p className="font-medium">{selectedFile.name}</p>
                              <p>{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => fileInputRef.current?.click()}
                              className="text-blue-600 hover:text-blue-700 font-medium"
                            >
                              Change File
                            </button>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                              {uploadType === 'photo' ? (
                                <Camera className="h-6 w-6 text-gray-400" />
                              ) : (
                                <Film className="h-6 w-6 text-gray-400" />
                              )}
                            </div>
                            <div>
                              <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="text-blue-600 hover:text-blue-700 font-medium"
                              >
                                Click to select {uploadType === 'photo' ? 'image' : 'video'}
                              </button>
                              <p className="text-gray-500 text-sm mt-1">
                                {uploadType === 'photo' 
                                  ? 'PNG, JPG, GIF up to 10MB' 
                                  : 'MP4, MOV, AVI up to 50MB'
                                }
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  /* URL Upload Section */
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {uploadType === 'photo' ? 'Photo' : 'Video'} URL *
                    </label>
                    <input
                      type="url"
                      value={uploadForm.media_url}
                      onChange={(e) => setUploadForm({ ...uploadForm, media_url: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder={`https://example.com/${uploadType === 'photo' ? 'image.jpg' : 'video.mp4'}`}
                      required
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                  <input
                    type="text"
                    value={uploadForm.tags}
                    onChange={(e) => setUploadForm({ ...uploadForm, tags: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="tag1, tag2, tag3"
                  />
                  <p className="text-sm text-gray-500 mt-1">Separate tags with commas</p>
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowUploadForm(false);
                      resetUploadForm();
                    }}
                    className="px-6 py-3 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isUploading || (uploadMethod === 'file' && !selectedFile) || (uploadMethod === 'url' && !uploadForm.media_url)}
                    className={`px-6 py-3 text-white rounded-lg transition-colors duration-200 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                      uploadType === 'photo' 
                        ? 'bg-green-600 hover:bg-green-700' 
                        : 'bg-purple-600 hover:bg-purple-700'
                    }`}
                  >
                    {isUploading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Uploading...</span>
                      </>
                    ) : (
                      <>
                        {uploadType === 'photo' ? (
                          <Camera className="h-5 w-5" />
                        ) : (
                          <Film className="h-5 w-5" />
                        )}
                        <span>Upload {uploadType === 'photo' ? 'Photo' : 'Video'}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}

      {/* Media Detail Modal */}
      {selectedMedia && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setSelectedMedia(null)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <img
                src={selectedMedia.media_url}
                alt={selectedMedia.title}
                className="w-full h-96 object-cover rounded-t-2xl"
                onError={(e) => {
                  // Fallback to department background if media fails to load
                  const target = e.target as HTMLImageElement;
                  target.src = selectedDepartment?.bgImage || '';
                }}
              />
              <button
                onClick={() => setSelectedMedia(null)}
                className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors duration-200"
              >
                <X className="h-5 w-5" />
              </button>
              {selectedMedia.media_type === 'video' && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-white/90 p-4 rounded-full">
                    <Play className="h-8 w-8 text-blue-600" />
                  </div>
                </div>
              )}
            </div>
            
            <div className="p-8">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-blue-100 p-2 rounded-lg">
                  {React.createElement(getMediaIcon(selectedMedia.media_type), { className: "h-5 w-5 text-blue-600" })}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedMedia.title}</h2>
                  <p className="text-blue-600 font-medium">{selectedMedia.media_type}</p>
                </div>
              </div>
              <p className="text-gray-600 leading-relaxed mb-4">{selectedMedia.description}</p>
              
              <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                <div>
                  <span className="font-medium text-gray-700">Created:</span>
                  <span className="ml-2 text-gray-600">{new Date(selectedMedia.created_at).toLocaleDateString()}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Department:</span>
                  <span className="ml-2 text-gray-600">{selectedDepartment?.name}</span>
                </div>
              </div>
              
              {selectedMedia.tags && selectedMedia.tags.length > 0 && (
                <div>
                  <span className="font-medium text-gray-700">Tags:</span>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {selectedMedia.tags.map((tag, index) => (
                      <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Events;