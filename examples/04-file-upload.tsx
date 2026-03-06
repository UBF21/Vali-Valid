/**
 * Example 04 — File upload with image validation
 *
 * Demonstrates:
 * - FileType, FileSize (sync)
 * - ImageAspectRatio, ImageMinDimensions (async)
 * - FileDimensions for exact size
 * - Multiple file fields in one form
 */

import React, { useState } from 'react';
import { useValiValid, ValidationType, TypeFile, FileSize } from 'vali-valid';

type MediaForm = {
  avatar: File | null;        // square profile picture
  banner: File | null;        // 16:9 banner
  document: File | null;      // PDF document
};

export function FileUploadForm() {
  const [previews, setPreviews] = useState<Record<string, string>>({});

  const { form, errors, isValidating, handleChange, validate } =
    useValiValid<MediaForm>({
      initial: { avatar: null, banner: null, document: null },
      validations: [
        {
          field: 'avatar',
          validations: [
            { type: ValidationType.Required },
            {
              type: ValidationType.FileType,
              value: [TypeFile.JPG, TypeFile.PNG],
              message: 'Only JPG or PNG images are allowed.',
            },
            { type: ValidationType.FileSize, value: FileSize['2MB'] },
            {
              type: ValidationType.ImageAspectRatio,
              value: { width: 1, height: 1 },
              tolerance: 0.02,
              message: 'Avatar must be square (1:1 ratio).',
            },
            {
              type: ValidationType.ImageMinDimensions,
              value: { width: 200, height: 200 },
              message: 'Avatar must be at least 200×200 px.',
            },
            {
              type: ValidationType.ImageMaxDimensions,
              value: { width: 2000, height: 2000 },
              message: 'Avatar cannot exceed 2000×2000 px.',
            },
          ],
        },
        {
          field: 'banner',
          validations: [
            { type: ValidationType.Required },
            {
              type: ValidationType.FileType,
              value: [TypeFile.JPG, TypeFile.PNG],
            },
            { type: ValidationType.FileSize, value: FileSize['5MB'] },
            {
              type: ValidationType.ImageAspectRatio,
              value: { width: 16, height: 9 },
              tolerance: 0.02,
              message: 'Banner must have a 16:9 aspect ratio.',
            },
            {
              type: ValidationType.ImageMinDimensions,
              value: { width: 1280 },
              message: 'Banner must be at least 1280px wide.',
            },
          ],
        },
        {
          field: 'document',
          validations: [
            {
              type: ValidationType.FileType,
              value: [TypeFile.PDF],
              message: 'Only PDF files are allowed.',
            },
            {
              type: ValidationType.FileSize,
              value: FileSize['10MB'],
              message: 'Document cannot exceed 10 MB.',
            },
          ],
        },
      ],
    });

  const handleFileChange = (field: keyof MediaForm, file: File | null) => {
    handleChange(field, file);

    if (file && file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setPreviews((prev) => ({ ...prev, [field]: url }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = await validate();
    if (!Object.values(errs).some(Boolean)) {
      console.log('Upload files:', form);
    }
  };

  const FileField = ({
    name,
    label,
    accept,
    hint,
  }: {
    name: keyof MediaForm;
    label: string;
    accept: string;
    hint: string;
  }) => (
    <div style={{ marginBottom: 20 }}>
      <label style={{ display: 'block', fontWeight: 600, marginBottom: 4 }}>{label}</label>
      <p style={{ color: '#888', fontSize: 13, margin: '0 0 6px' }}>{hint}</p>

      <input
        type="file"
        accept={accept}
        onChange={(e) => handleFileChange(name, e.target.files?.[0] ?? null)}
      />

      {/* Image preview */}
      {previews[name] && (
        <img
          src={previews[name]}
          alt={`${name} preview`}
          style={{ display: 'block', marginTop: 8, maxWidth: 200, maxHeight: 120, objectFit: 'cover', border: '1px solid #ddd' }}
        />
      )}

      {errors[name] && (
        <p style={{ color: 'red', margin: '4px 0 0', fontSize: 13 }}>{errors[name]}</p>
      )}
      {isValidating && form[name] && (
        <p style={{ color: '#888', margin: '4px 0 0', fontSize: 13 }}>Checking dimensions…</p>
      )}
    </div>
  );

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 480 }}>
      <h2>Upload media</h2>

      <FileField
        name="avatar"
        label="Profile picture *"
        accept="image/jpeg,image/png"
        hint="JPG or PNG, square, 200–2000 px, max 2 MB"
      />

      <FileField
        name="banner"
        label="Profile banner *"
        accept="image/jpeg,image/png"
        hint="JPG or PNG, 16:9 ratio, min 1280 px wide, max 5 MB"
      />

      <FileField
        name="document"
        label="CV / Resume (optional)"
        accept="application/pdf"
        hint="PDF only, max 10 MB"
      />

      <button
        type="submit"
        disabled={isValidating}
        style={{ padding: '10px 20px', marginTop: 8 }}
      >
        {isValidating ? 'Validating files…' : 'Upload'}
      </button>
    </form>
  );
}
