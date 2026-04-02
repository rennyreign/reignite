import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Button, TextField } from '@mui/material';
import { studentService } from '../services/supabaseService';
import { calculateAge, getAgeBracket, getAgeBracketLabel } from '../services/v2Service';
import { useAuth } from '../contexts/AuthContext';
import { Camera } from 'lucide-react';

const fieldLabel = {
  fontFamily: 'Outfit, sans-serif',
  fontSize: '0.78rem',
  fontWeight: 600,
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  color: '#78716C',
  mb: 0.8,
  display: 'block',
};

const inputSx = {
  '& .MuiOutlinedInput-root': {
    fontFamily: 'Outfit, sans-serif',
    fontSize: '0.95rem',
    borderRadius: '10px',
    background: '#FFFFFF',
    '& fieldset': { borderColor: '#E7E5E4', borderWidth: '1.5px' },
    '&:hover fieldset': { borderColor: '#78716C' },
    '&.Mui-focused fieldset': { borderColor: '#3D7A5F', boxShadow: '0 0 0 3px rgba(61,122,95,0.12)' },
  },
  '& .MuiFormHelperText-root': { fontFamily: 'Outfit, sans-serif', fontSize: '0.78rem' },
};

const AddEditStudent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isEditing = !!id;

  const [formData, setFormData] = useState({ name: '', date_of_birth: '', profile_image_url: null });
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isEditing) {
      studentService.getById(id).then((student) => {
        if (!student) { setError('Student not found'); return; }
        setFormData({
          name: student.name,
          date_of_birth: student.date_of_birth ? student.date_of_birth.split('T')[0] : '',
          profile_image_url: student.profile_image_url,
        });
        if (student.profile_image_url) setImagePreview(student.profile_image_url);
      }).catch((err) => setError(err.message));
    }
  }, [id, isEditing]);

  const compressImage = (file) => new Promise((resolve) => {
    const fallback = () => resolve({ file, url: URL.createObjectURL(file) });
    const reader = new FileReader();
    reader.onerror = fallback;
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = fallback;
      img.onload = () => {
        const MAX = 800;
        let w = img.width;
        let h = img.height;
        if (w > MAX || h > MAX) {
          if (w > h) { h = Math.round(h * MAX / w); w = MAX; }
          else { w = Math.round(w * MAX / h); h = MAX; }
        }
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        canvas.getContext('2d').drawImage(img, 0, 0, w, h);
        canvas.toBlob((blob) => {
          if (!blob) { fallback(); return; }
          resolve({
            file: new File([blob], file.name, { type: 'image/jpeg' }),
            url: URL.createObjectURL(blob),
          });
        }, 'image/jpeg', 0.82);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });

  const compressRequestRef = React.useRef(0);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const requestId = ++compressRequestRef.current;
    if (imagePreview && imagePreview.startsWith('blob:')) URL.revokeObjectURL(imagePreview);
    setImageLoading(true);
    const { file: compressed, url } = await compressImage(file);
    if (requestId !== compressRequestRef.current) {
      URL.revokeObjectURL(url);
      return;
    }
    setImageFile(compressed);
    setImagePreview(url);
    setImageLoading(false);
  };

  React.useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith('blob:')) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      if (isEditing) {
        await studentService.update(id, { ...formData, imageFile });
      } else {
        await studentService.create({ ...formData, imageFile, user_id: user.id });
      }
      window.location.href = '/dashboard';
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  };

  const card = {
    background: '#FFFFFF',
    borderRadius: '16px',
    border: '1px solid #E7E5E4',
    boxShadow: '0 1px 4px rgba(28,25,23,0.06)',
    p: 3,
  };

  return (
    <Box sx={{ maxWidth: 520, mx: 'auto', px: 3, pt: 4, pb: 8 }}>
      <Typography sx={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '1.75rem', color: '#1C1917', letterSpacing: '-0.025em', mb: 0.5 }}>
        {isEditing ? 'Edit Profile' : 'Add Child'}
      </Typography>
      <Typography sx={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.875rem', color: '#78716C', mb: 4 }}>
        {isEditing ? 'Update the profile details.' : 'Fill in the details to create a new child profile.'}
      </Typography>

      {error && (
        <Box sx={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '10px', p: 2, mb: 3 }}>
          <Typography sx={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.875rem', color: '#DC2626' }}>{error}</Typography>
        </Box>
      )}

      <Box component="form" onSubmit={handleSubmit} sx={card}>
        {/* Name */}
        <Box sx={{ mb: 3 }}>
          <Typography component="label" sx={fieldLabel}>Name</Typography>
          <TextField
            fullWidth
            required
            placeholder="e.g. Reign"
            value={formData.name}
            onChange={e => setFormData(f => ({ ...f, name: e.target.value }))}
            sx={inputSx}
          />
        </Box>

        {/* Date of Birth */}
        <Box sx={{ mb: 3 }}>
          <Typography component="label" sx={fieldLabel}>Date of Birth</Typography>
          <TextField
            fullWidth
            required
            type="date"
            value={formData.date_of_birth}
            onChange={e => setFormData(f => ({ ...f, date_of_birth: e.target.value }))}
            InputLabelProps={{ shrink: true }}
            sx={inputSx}
            helperText="Required for age-contextual benchmarks"
          />
          {formData.date_of_birth && (() => {
            const age = calculateAge(formData.date_of_birth);
            const bracket = getAgeBracket(age);
            const bracketLabel = getAgeBracketLabel(bracket);
            return age !== null && bracket ? (
              <Box sx={{ mt: 1.5, px: 2, py: 1, background: '#EBF3EE', borderRadius: '8px', border: '1px solid #3D7A5F22' }}>
                <Typography sx={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.8rem', color: '#3D7A5F', fontWeight: 600 }}>
                  Age: {age} years old · {bracketLabel}
                </Typography>
              </Box>
            ) : null;
          })()}
        </Box>

        {/* Profile Image */}
        <Box sx={{ mb: 4 }}>
          <Typography component="label" sx={fieldLabel}>Profile Photo <Box component="span" sx={{ textTransform: 'none', fontWeight: 400, letterSpacing: 0 }}>(optional)</Box></Typography>
          <Box
            component="label"
            sx={{
              display: 'flex', alignItems: 'center', gap: 2,
              border: '1.5px dashed #E7E5E4', borderRadius: '12px',
              p: 2, cursor: 'pointer', background: '#FAFAF8',
              transition: 'border-color 0.15s',
              '&:hover': { borderColor: '#3D7A5F' },
            }}
          >
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: 'none' }}
            />
            {imageLoading ? (
              <Box sx={{
                width: 52, height: 52, borderRadius: '50%', flexShrink: 0,
                background: '#EBF3EE', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Typography sx={{ fontSize: '0.7rem', color: '#3D7A5F', fontFamily: 'Outfit' }}>...</Typography>
              </Box>
            ) : imagePreview ? (
              <Box
                component="img"
                src={imagePreview}
                alt="Preview"
                sx={{ width: 52, height: 52, borderRadius: '50%', objectFit: 'cover', flexShrink: 0, border: '2px solid #E7E5E4' }}
              />
            ) : (
              <Box sx={{
                width: 52, height: 52, borderRadius: '50%', flexShrink: 0,
                background: '#EBF3EE', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Camera size={22} strokeWidth={1.5} color="#3D7A5F" />
              </Box>
            )}
            <Box>
              <Typography sx={{ fontFamily: 'Outfit, sans-serif', fontWeight: 600, fontSize: '0.85rem', color: '#1C1917' }}>
                {imagePreview ? 'Change photo' : 'Choose photo'}
              </Typography>
              <Typography sx={{ fontFamily: 'Outfit, sans-serif', fontSize: '0.75rem', color: '#A8A29E' }}>
                {imageLoading ? 'Processing…' : 'JPG, PNG or HEIC · auto-compressed'}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Actions */}
        <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'flex-end' }}>
          <Button
            type="button"
            onClick={() => navigate(-1)}
            sx={{ fontFamily: 'Outfit, sans-serif', fontWeight: 600, fontSize: '0.875rem', textTransform: 'none', border: '1.5px solid #E7E5E4', color: '#78716C', borderRadius: '10px', px: 2.5, py: 1, '&:hover': { background: '#F5F3EF', borderColor: '#1C1917', color: '#1C1917' } }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            sx={{ fontFamily: 'Outfit, sans-serif', fontWeight: 600, fontSize: '0.875rem', textTransform: 'none', background: '#3D7A5F', color: '#fff', borderRadius: '10px', px: 3, py: 1, '&:hover': { background: '#2d5f49' }, '&:active': { transform: 'translateY(1px)' } }}
          >
            {saving ? 'Saving…' : isEditing ? 'Save Changes' : 'Create Profile'}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default AddEditStudent;
