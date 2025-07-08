import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { 
  Upload, 
  Image as ImageIcon, 
  Video, 
  FileText, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  Settings,
  BarChart3,
  Users,
  Calendar,
  LogOut,
  Shield,
  X,
  Check,
  AlertCircle
} from 'lucide-react';

interface MediaItem {
  id: string;
  title: string;
  description: string;
  media_type: 'photo' | 'video' | 'poster' | 'document';
  media_url: string;
  thumbnail_url?: string;
  department_id: string;
  event_id?: string;
  is_featured: boolean;
  is_public: boolean;
  tags: string[];
  created_at: string;
}

interface Event {
  id: string;
  title: string;
  date: string;
  department_id: string;
}

interface Department {
  id: string;
  name: string;
  description: string;
  icon: string;
}

const DepartmentAdmin = () => {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userDepartment, setUserDepartment] = useState<Department | null>(null);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [editingMedia, setEditingMedia] = useState<MediaItem | null>(null);
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });

  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (isAuthenticated && userDepartment) {
      fetchData();
    }
  }, [isAuthenticated, userDepartment]);

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        setCurrentUser(session.user);
        await fetchUserDepartment(session.user.id);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Auth check error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserDepartment = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('department_admins')
        .select(`
          department_id,
          departments (
            id,
            name,
            description,
            icon
          )
        `)
        .eq('user_id', userId)
        .eq('is_active', true)
        .single();

      if (error) throw error;
      
      if (data?.departments) {
        setUserDepartment(data.departments as Department);
      }
    } catch (error) {
      console.error('Error fetching user department:', error);
    }
  };

  const fetchData = async () => {
    if (!userDepartment) return;

    try {
      const [mediaData, eventsData] = await Promise.all([
        supabase
          .from('event_media')
          .select('*')
          .eq('department_id', userDepartment.id)
          .order('created_at', { ascending: false }),
        supabase
          .from('events')
          .select('id, title, date, department_id')
          .eq('department_id', userDepartment.id)
          .order('date', { ascending: false })
      ]);

      setMediaItems(mediaData.data || []);
      setEvents(eventsData.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginForm.email,
        password: loginForm.password
      });

      if (error) throw error;

      if (data.user) {
        setCurrentUser(data.user);
        await fetchUserDepartment(data.user.id);
        setIsAuthenticated(true);
        toast.success('Login successful!');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || 'Login failed');
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setCurrentUser(null);
      setUserDepartment(null);
      setIsAuthenticated(false);
      setMediaItems([]);
      setEvents([]);
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleMediaUpload = async (data: any) => {
    if (!userDepartment || !currentUser) return;

    try {
      const mediaData = {
        title: data.title,
        description: data.description,
        media_type: data.media_type,
        media_url: data.media_url,
        thumbnail_url: data.thumbnail_url,
        department_id: userDepartment.id,
        event_id: data.event_id || null,
        uploaded_by: currentUser.id,
        is_featured: data.is_featured || false,
        is_public: data.is_public !== false,
        tags: data.tags ? data.tags.split(',').map((tag: string) => tag.trim()) : []
      };

      if (editingMedia) {
        const { error } = await supabase
          .from('event_media')
          .update(mediaData)
          .eq('id', editingMedia.id);
        
        if (error) throw error;
        toast.success('Media updated successfully!');
      } else {
        const { error } = await supabase
          .from('event_media')
          .insert([mediaData]);
        
        if (error) throw error;
        toast.success('Media uploaded successfully!');
      }

      setShowUploadForm(false);
      setEditingMedia(null);
      reset();
      fetchData();
    } catch (error: any) {
      console.error('Error uploading media:', error);
      toast.error(error.message || 'Failed to upload media');
    }
  };

  const handleDeleteMedia = async (id: string) => {
    if (!confirm('Are you sure you want to delete this media item?')) return;

    try {
      const { error } = await supabase
        .from('event_media')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Media deleted successfully!');
      fetchData();
    } catch (error: any) {
      console.error('Error deleting media:', error);
      toast.error(error.message || 'Failed to delete media');
    }
  };

  const getMediaIcon = (type: string) => {
    switch (type) {
      case 'photo': return ImageIcon;
      case 'video': return Video;
      case 'poster': return FileText;
      case 'document': return FileText;
      default: return ImageIcon;
    }
  };

  const stats = {
    totalMedia: mediaItems.length,
    photos: mediaItems.filter(m => m.media_type === 'photo').length,
    videos: mediaItems.filter(m => m.media_type === 'video').length,
    featuredMedia: mediaItems.filter(m => m.is_featured).length
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md"
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Department Admin</h1>
            <p className="text-gray-600">Sign in to manage your department's content</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={loginForm.email}
                onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                type="password"
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your password"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
            >
              Sign In
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  if (!userDepartment) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-4">You don't have admin access to any department.</p>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200"
          >
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  const TabButton = ({ id, label, icon: Icon }: { id: string; label: string; icon: any }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
        activeTab === id
          ? 'bg-blue-600 text-white shadow-md'
          : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      <Icon className="h-4 w-4" />
      <span>{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-2xl">{userDepartment.icon}</div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{userDepartment.name}</h1>
                <p className="text-gray-600">Department Admin Panel</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {currentUser?.email}</span>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors duration-200"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 space-y-2">
              <TabButton id="dashboard" label="Dashboard" icon={BarChart3} />
              <TabButton id="media" label="Media Gallery" icon={ImageIcon} />
              <TabButton id="events" label="Events" icon={Calendar} />
              <TabButton id="settings" label="Settings" icon={Settings} />
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-2xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-blue-100">Total Media</p>
                        <p className="text-3xl font-bold">{stats.totalMedia}</p>
                      </div>
                      <ImageIcon className="h-8 w-8 text-blue-200" />
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white p-6 rounded-2xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-green-100">Photos</p>
                        <p className="text-3xl font-bold">{stats.photos}</p>
                      </div>
                      <ImageIcon className="h-8 w-8 text-green-200" />
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white p-6 rounded-2xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-orange-100">Videos</p>
                        <p className="text-3xl font-bold">{stats.videos}</p>
                      </div>
                      <Video className="h-8 w-8 text-orange-200" />
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-2xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-purple-100">Featured</p>
                        <p className="text-3xl font-bold">{stats.featuredMedia}</p>
                      </div>
                      <Eye className="h-8 w-8 text-purple-200" />
                    </div>
                  </div>
                </div>

                {/* Recent Media */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Media Uploads</h3>
                  <div className="space-y-4">
                    {mediaItems.slice(0, 5).map((media) => (
                      <div key={media.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            {React.createElement(getMediaIcon(media.media_type), { className: "h-6 w-6 text-blue-600" })}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{media.title}</p>
                            <p className="text-sm text-gray-600">{media.media_type}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {media.is_featured && (
                            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">Featured</span>
                          )}
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            media.is_public ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {media.is_public ? 'Public' : 'Private'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'media' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-900">Media Gallery</h2>
                  <button
                    onClick={() => setShowUploadForm(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Upload Media</span>
                  </button>
                </div>

                {/* Media Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {mediaItems.map((media) => (
                    <div key={media.id} className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group">
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={media.media_url}
                          alt={media.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-3 left-3">
                          <div className="bg-black/70 text-white p-2 rounded-lg">
                            {React.createElement(getMediaIcon(media.media_type), { className: "h-4 w-4" })}
                          </div>
                        </div>
                        <div className="absolute top-3 right-3 flex space-x-2">
                          {media.is_featured && (
                            <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">Featured</span>
                          )}
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            media.is_public ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'
                          }`}>
                            {media.is_public ? 'Public' : 'Private'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">{media.title}</h3>
                        <p className="text-gray-600 text-sm line-clamp-2 mb-3">{media.description}</p>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-500">
                            {new Date(media.created_at).toLocaleDateString()}
                          </span>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => setSelectedMedia(media)}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => {
                                setEditingMedia(media);
                                setShowUploadForm(true);
                              }}
                              className="text-green-600 hover:text-green-800"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteMedia(media.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Upload Form Modal */}
                {showUploadForm && (
                  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                      <div className="p-6">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-xl font-bold text-gray-900">
                            {editingMedia ? 'Edit Media' : 'Upload New Media'}
                          </h3>
                          <button
                            onClick={() => {
                              setShowUploadForm(false);
                              setEditingMedia(null);
                              reset();
                            }}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            <X className="h-6 w-6" />
                          </button>
                        </div>
                        
                        <form onSubmit={handleSubmit(handleMediaUpload)} className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                              <input
                                type="text"
                                {...register('title', { required: 'Title is required' })}
                                defaultValue={editingMedia?.title}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message as string}</p>}
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Media Type *</label>
                              <select
                                {...register('media_type', { required: 'Media type is required' })}
                                defaultValue={editingMedia?.media_type}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              >
                                <option value="">Select type</option>
                                <option value="photo">Photo</option>
                                <option value="video">Video</option>
                                <option value="poster">Poster</option>
                                <option value="document">Document</option>
                              </select>
                              {errors.media_type && <p className="text-red-500 text-sm mt-1">{errors.media_type.message as string}</p>}
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Media URL *</label>
                            <input
                              type="url"
                              {...register('media_url', { required: 'Media URL is required' })}
                              defaultValue={editingMedia?.media_url}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="https://example.com/image.jpg"
                            />
                            {errors.media_url && <p className="text-red-500 text-sm mt-1">{errors.media_url.message as string}</p>}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea
                              {...register('description')}
                              defaultValue={editingMedia?.description}
                              rows={3}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Associated Event</label>
                              <select
                                {...register('event_id')}
                                defaultValue={editingMedia?.event_id}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              >
                                <option value="">No associated event</option>
                                {events.map((event) => (
                                  <option key={event.id} value={event.id}>
                                    {event.title}
                                  </option>
                                ))}
                              </select>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                              <input
                                type="text"
                                {...register('tags')}
                                defaultValue={editingMedia?.tags?.join(', ')}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="tag1, tag2, tag3"
                              />
                            </div>
                          </div>

                          <div className="flex items-center space-x-6">
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                {...register('is_featured')}
                                defaultChecked={editingMedia?.is_featured}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              />
                              <label className="ml-2 text-sm text-gray-700">Featured Media</label>
                            </div>
                            
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                {...register('is_public')}
                                defaultChecked={editingMedia?.is_public !== false}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              />
                              <label className="ml-2 text-sm text-gray-700">Public Visibility</label>
                            </div>
                          </div>

                          <div className="flex justify-end space-x-3 pt-4">
                            <button
                              type="button"
                              onClick={() => {
                                setShowUploadForm(false);
                                setEditingMedia(null);
                                reset();
                              }}
                              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors duration-200"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
                            >
                              <Upload className="h-4 w-4" />
                              <span>{editingMedia ? 'Update' : 'Upload'}</span>
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
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
                        />
                        <button
                          onClick={() => setSelectedMedia(null)}
                          className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors duration-200"
                        >
                          <X className="h-5 w-5" />
                        </button>
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
                        
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium text-gray-700">Created:</span>
                            <span className="ml-2 text-gray-600">{new Date(selectedMedia.created_at).toLocaleDateString()}</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Visibility:</span>
                            <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                              selectedMedia.is_public ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {selectedMedia.is_public ? 'Public' : 'Private'}
                            </span>
                          </div>
                          {selectedMedia.tags && selectedMedia.tags.length > 0 && (
                            <div className="col-span-2">
                              <span className="font-medium text-gray-700">Tags:</span>
                              <div className="mt-1 flex flex-wrap gap-2">
                                {selectedMedia.tags.map((tag, index) => (
                                  <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'events' && (
              <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
                <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Events Management</h3>
                <p className="text-gray-600">
                  Event management features will be available here. You can associate media with specific events.
                </p>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
                <Settings className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Department Settings</h3>
                <p className="text-gray-600">
                  Department configuration and admin management settings will be available here.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepartmentAdmin;