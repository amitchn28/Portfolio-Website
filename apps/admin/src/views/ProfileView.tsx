import React, { useState, useEffect, useRef } from 'react';
import { adminApi } from '../services/api';
import { useToast } from '../context/ToastContext';
import { Save, Loader2, Trash2, Camera, User, Crop } from 'lucide-react';
import { ImageCropperModal } from '../components/ImageCropperModal';
import { getAssetUrl } from '../utils/assetUrl';

export const ProfileView: React.FC = () => {
  const { success, error } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [isCropperOpen, setIsCropperOpen] = useState(false);
  const [cropImageSrc, setCropImageSrc] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: '',
    headline: '',
    tagline: '',
    shortBio: '',
    fullBio: '',
    avatarUrl: '',
    location: '',
    email: '',
    phone: '',
    availability: 'OPEN_TO_WORK',
    currentStatus: '',
    yearsOfExperience: 0,
  });

  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await adminApi.getProfile();
        if (data) {
          setFormData({
            name: data.name || 'Amit Chauhan',
            headline: data.headline || 'Software Engineer & AI Developer',
            tagline: data.tagline || 'Building intelligent systems, scalable full-stack web applications, and hybrid AI solutions.',
            shortBio: (data.shortBio && data.shortBio.length < 80) ? data.shortBio : 'Developer, Programmer, Gamer, Coder',
            fullBio: data.fullBio || '',
            avatarUrl: data.avatarUrl || '',
            location: data.location || 'Mumbai, India',
            email: data.email || 'amitchn28@gmail.com',
            phone: data.phone || '',
            availability: data.availability || 'OPEN_TO_WORK',
            currentStatus: data.currentStatus || 'CS Student • Fourth Year',
            yearsOfExperience: data.yearsOfExperience || 0,
          });
        }
      } catch (err: any) {
        error(err.message || 'Failed to fetch profile');
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, [error]);

  // When user selects a file, read it as Data URL and open the Photo Adjuster Modal
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      error('Please select an image file (PNG, JPG, WebP, etc.)');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setCropImageSrc(reader.result as string);
      setIsCropperOpen(true);
    };
    reader.readAsDataURL(file);

    // Clear file input value to allow re-selecting the same file if needed
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Open cropper with existing photo to re-adjust position/zoom/rotation
  const handleAdjustCurrentPhoto = () => {
    if (!formData.avatarUrl) return;
    setCropImageSrc(getAssetUrl(formData.avatarUrl));
    setIsCropperOpen(true);
  };

  // Called when user clicks "Save & Apply Photo" in the Cropper Modal
  const handleCropComplete = async (croppedFile: File) => {
    setUploadingImage(true);
    try {
      // Read cropped file as Data URL for permanent resilience in Neon PostgreSQL
      const reader = new FileReader();
      const dataUrlPromise = new Promise<string>((resolve) => {
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(croppedFile);
      });
      const dataUrl = await dataUrlPromise;

      // Also upload file to backend disk as backup
      try {
        await adminApi.uploadFile(croppedFile, 'profile');
      } catch {
        // Data URL in PostgreSQL will guarantee it never 404s
      }

      const updated = { ...formData, avatarUrl: dataUrl };
      setFormData(updated);
      await adminApi.updateProfile(updated);
      success('Profile photo saved permanently to database!');
      setIsCropperOpen(false);
    } catch (err: any) {
      error(err.message || 'Failed to upload photo');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleRemovePhoto = () => {
    setFormData((prev) => ({ ...prev, avatarUrl: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...formData,
        yearsOfExperience: Number(formData.yearsOfExperience) || 0,
      };
      const res = await adminApi.updateProfile(payload);
      if (res) {
        setFormData((prev) => ({ ...prev, ...res }));
      }
      success('Profile details successfully updated and saved to PostgreSQL!');
    } catch (err: any) {
      error(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-purple-400 mx-auto" />
        <p className="text-xs font-mono text-slate-400">Loading Profile Data...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-6 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display tracking-tight">
          Profile Management
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Maintain your core personal identity, profile photo, headline, and academic metadata.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Photo Management Card */}
        <div className="p-6 sm:p-8 rounded-2xl bg-space-900/80 border border-slate-800 space-y-5">
          <h2 className="text-sm font-cyber font-bold uppercase tracking-wider text-amber-400">
            Profile Photo
          </h2>

          <div className="flex flex-col sm:flex-row items-center gap-6">
            {/* Avatar Circle Preview with Coastal Sunset Halo */}
            <div className="relative group shrink-0">
              <div className="absolute -inset-1.5 bg-gradient-to-r from-amber-400 via-sky-400 to-amber-300 rounded-full blur-md opacity-85 group-hover:opacity-100 transition duration-300 animate-pulse-slow"></div>
              <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-2 border-amber-400/80 bg-space-950 flex items-center justify-center shadow-xl">
                {formData.avatarUrl ? (
                  <img
                    src={getAssetUrl(formData.avatarUrl)}
                    alt="Profile Avatar Preview"
                    className="w-full h-full object-cover rounded-full"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = '/avatar.webp';
                    }}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-slate-400">
                    <User className="w-10 h-10 text-amber-400" />
                    <span className="text-[10px] font-mono mt-1 text-slate-400">No Photo</span>
                  </div>
                )}
              </div>
            </div>

            {/* Upload Controls */}
            <div className="space-y-3 flex-1 text-center sm:text-left">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageSelect}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingImage}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:brightness-110 text-slate-950 font-cyber font-bold text-xs flex items-center gap-2 shadow-md shadow-amber-500/20 transition-all disabled:opacity-50"
                >
                  {uploadingImage ? (
                    <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                  ) : (
                    <Camera className="w-4 h-4" />
                  )}
                  <span>{uploadingImage ? 'Uploading...' : 'Upload & Adjust Photo'}</span>
                </button>

                {formData.avatarUrl && (
                  <button
                    type="button"
                    onClick={handleAdjustCurrentPhoto}
                    disabled={uploadingImage}
                    className="px-4 py-2 rounded-xl bg-space-950 hover:bg-slate-800 text-amber-300 border border-amber-400/40 text-xs font-medium flex items-center gap-1.5 transition-colors disabled:opacity-50"
                    title="Crop, zoom, or reposition current photo"
                  >
                    <Crop className="w-3.5 h-3.5 text-amber-400" />
                    <span>Adjust Photo</span>
                  </button>
                )}

                {formData.avatarUrl && (
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    className="px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-medium flex items-center gap-1.5 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove Photo</span>
                  </button>
                )}
              </div>

              {/* Photo URL Direct Input Option */}
              <div className="space-y-1">
                <label className="text-[11px] font-mono text-slate-400">
                  Or enter photo URL directly:
                </label>
                <input
                  type="url"
                  placeholder="https://example.com/your-photo.jpg"
                  value={formData.avatarUrl}
                  onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-space-950 border border-slate-800 text-xs text-slate-200 focus:border-purple-500 focus:outline-none"
                />
              </div>

              <p className="text-[11px] text-slate-500">
                Supports JPG, PNG, WebP up to 10MB. Photo will appear in the Glowing Halo circle on the portfolio.
              </p>
            </div>
          </div>
        </div>

        {/* Identity & Content Fields */}
        <div className="p-6 sm:p-8 rounded-2xl bg-space-900/80 border border-slate-800 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-300 font-medium">Full Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-space-950 border border-slate-800 focus:border-purple-500 text-sm text-white focus:outline-none"
              />
            </div>

            {/* Email Address */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-300 font-medium">Primary Contact Email</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-space-950 border border-slate-800 focus:border-purple-500 text-sm text-white focus:outline-none"
              />
            </div>
          </div>

          {/* Headline */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-slate-300 font-medium">
              Professional Headline
            </label>
            <input
              type="text"
              required
              value={formData.headline}
              onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-space-950 border border-slate-800 focus:border-purple-500 text-sm text-white focus:outline-none"
            />
          </div>

          {/* Tagline */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-slate-300 font-medium">Tagline / Subheading</label>
            <input
              type="text"
              value={formData.tagline}
              onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-space-950 border border-slate-800 focus:border-purple-500 text-sm text-white focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Academic Standing */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-300 font-medium">Academic Status</label>
              <input
                type="text"
                value={formData.currentStatus}
                onChange={(e) => setFormData({ ...formData, currentStatus: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-space-950 border border-slate-800 focus:border-purple-500 text-sm text-white focus:outline-none"
              />
            </div>

            {/* Location */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-300 font-medium">Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-space-950 border border-slate-800 focus:border-purple-500 text-sm text-white focus:outline-none"
              />
            </div>

            {/* Availability */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-300 font-medium">Availability Status</label>
              <select
                value={formData.availability}
                onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-space-950 border border-slate-800 focus:border-purple-500 text-sm text-white focus:outline-none"
              >
                <option value="OPEN_TO_WORK">Open to Opportunities</option>
                <option value="AVAILABLE_INTERNSHIPS">Available for Internships</option>
                <option value="BUSY_RESEARCH">Focused on Research</option>
              </select>
            </div>
          </div>

          {/* Rotating Roles / Titles */}
          <div className="space-y-2 p-5 rounded-2xl bg-space-950/90 border border-amber-500/30 shadow-md">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono text-amber-300 font-bold flex items-center gap-2">
                <span>✦ Rotating Roles / Titles (Giant Animated Typography)</span>
              </label>
              <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/25">
                Comma-separated
              </span>
            </div>
            <input
              type="text"
              placeholder="Developer, Programmer, Gamer, Coder"
              value={formData.shortBio}
              onChange={(e) => setFormData({ ...formData, shortBio: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-space-900 border border-slate-700/80 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-sm font-tech text-white focus:outline-none tracking-wide"
            />
            <p className="text-[11px] text-slate-400">
              These cycle continuously in giant, classy display typography at the bottom of the About section (below the 4 highlight cards). Separate each role with a comma.
            </p>
            {/* Live Role Badges Preview */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-[10px] font-mono text-slate-400">Live Preview:</span>
              {(formData.shortBio || 'Developer, Programmer, Gamer, Coder')
                .split(/[,•|/]/)
                .map((r) => r.trim())
                .filter(Boolean)
                .map((role, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-0.5 rounded-full text-[11px] font-tech font-bold uppercase tracking-wider bg-gradient-to-r from-cyan-500/20 to-teal-500/20 text-cyan-300 border border-cyan-500/30"
                  >
                    {role}
                  </span>
                ))}
            </div>
          </div>

          {/* Full Bio */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-slate-300 font-medium">Full Biography</label>
            <textarea
              rows={4}
              value={formData.fullBio}
              onChange={(e) => setFormData({ ...formData, fullBio: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-space-950 border border-slate-800 focus:border-purple-500 text-sm text-white focus:outline-none resize-none"
            />
          </div>
        </div>

        {/* Action Save Button */}
        <div className="flex items-center justify-end gap-3">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-400 to-amber-600 hover:brightness-110 text-slate-950 font-cyber font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-amber-500/25 transition-all disabled:opacity-60"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                <span>Saving to Database...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Profile Changes</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Interactive Photo Crop & Position Modal */}
      <ImageCropperModal
        isOpen={isCropperOpen}
        imageSrc={cropImageSrc}
        onClose={() => setIsCropperOpen(false)}
        onCropComplete={handleCropComplete}
        isUploading={uploadingImage}
      />
    </div>
  );
};
