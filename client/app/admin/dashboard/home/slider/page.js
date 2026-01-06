'use client'

import React, { useState } from 'react'
import toast from 'react-hot-toast'
import {
  useCreateSlideMutation,
  useDeleteSlideMutation,
  useGetAllSlidesQuery,
  useUpdateSlideMutation,
} from '../../../../../redux/features/home/sliderApi'

export default function Slider() {
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    image: null,
  })
  const [preview, setPreview] = useState(null)
  const [editId, setEditId] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { data, isLoading, error } = useGetAllSlidesQuery()
  const slides = Array.isArray(data?.slides) ? data.slides : []

  const [createSlide] = useCreateSlideMutation()
  const [updateSlide] = useUpdateSlideMutation()
  const [deleteSlide] = useDeleteSlideMutation()

  const handleChange = (e) => {
    if (e.target.name === 'image') {
      const file = e.target.files[0]
      setFormData({ ...formData, image: file })
      setPreview(file ? URL.createObjectURL(file) : null)
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value })
    }
  }

  const resetForm = () => {
    setFormData({ title: '', subtitle: '', image: null })
    setPreview(null)
    setEditId(null)
    setIsModalOpen(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    const form = new FormData()
    form.append('title', formData.title)
    form.append('subtitle', formData.subtitle)
    if (formData.image) form.append('image', formData.image)

    try {
      if (editId) {
        await updateSlide({ id: editId, formData: form }).unwrap()
        toast.success('Slide updated')
      } else {
        await createSlide(form).unwrap()
        toast.success('Slide created')
      }
      resetForm()
    } catch {
      toast.error('Something went wrong')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (slide) => {
    setFormData({
      title: slide.title,
      subtitle: slide.subtitle,
      image: null,
    })
    setPreview(slide.image?.url || null)
    setEditId(slide._id)
    setIsModalOpen(true)
  }

  const handleDelete = async (id) => {
    if (confirm('Are you sure?')) {
      try {
        await deleteSlide(id).unwrap()
        toast.success('Slide deleted')
      } catch {
        toast.error('Delete failed')
      }
    }
  }

  return (
    <div className="p-4 sm:p-6 bg-gray-100 min-h-screen text-black">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <h2 className="text-2xl font-semibold">Manage Slides</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
        >
          + Add Slide
        </button>
      </div>

      {/* LOADING / ERROR */}
      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">Failed to load slides</p>
      ) : (
        <>
          {/* DESKTOP TABLE */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full border bg-white rounded shadow">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3">#</th>
                  <th className="p-3">Image</th>
                  <th className="p-3">Title</th>
                  <th className="p-3">Subtitle</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {slides.map((slide, index) => (
                  <tr key={slide._id} className="border-t hover:bg-gray-50">
                    <td className="p-3">{index + 1}</td>
                    <td className="p-3">
                      <img
                        src={slide.image?.url}
                        alt={slide.title}
                        className="w-12 h-12 rounded object-cover"
                      />
                    </td>
                    <td className="p-3">{slide.title}</td>
                    <td className="p-3">{slide.subtitle}</td>
                    <td className="p-3 space-x-2">
                      <button
                        onClick={() => handleEdit(slide)}
                        className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(slide._id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* MOBILE CARDS */}
          <div className="md:hidden space-y-4">
            {slides.map((slide) => (
              <div
                key={slide._id}
                className="bg-white rounded shadow p-4 flex gap-4"
              >
                <img
                  src={slide.image?.url}
                  alt={slide.title}
                  className="w-16 h-16 rounded object-cover"
                />

                <div className="flex-1">
                  <h4 className="font-semibold">{slide.title}</h4>
                  <p className="text-sm text-gray-600">{slide.subtitle}</p>

                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => handleEdit(slide)}
                      className="bg-yellow-400 text-white px-3 py-1 rounded text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(slide._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-white w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-lg p-4 sm:p-6 relative mx-2">

            <button
              onClick={resetForm}
              className="absolute top-3 right-3 text-gray-500 hover:text-black"
            >
              ✕
            </button>

            <h3 className="text-xl font-semibold mb-4">
              {editId ? 'Edit Slide' : 'Add Slide'}
            </h3>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
              <input
                type="text"
                name="title"
                placeholder="Title"
                value={formData.title}
                onChange={handleChange}
                required
                className="border px-3 py-2 rounded"
              />

              <input
                type="text"
                name="subtitle"
                placeholder="Subtitle"
                value={formData.subtitle}
                onChange={handleChange}
                required
                className="border px-3 py-2 rounded"
              />

              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleChange}
              />

              {preview && (
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-40 object-cover rounded border"
                />
              )}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-4 py-2 rounded text-white ${isSubmitting
                      ? 'bg-gray-400'
                      : editId
                        ? 'bg-yellow-500 hover:bg-yellow-600'
                        : 'bg-green-500 hover:bg-green-600'
                    }`}
                >
                  {isSubmitting ? 'Saving...' : editId ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
