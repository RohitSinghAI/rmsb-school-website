'use client'

import React, { useState } from 'react'
import toast from 'react-hot-toast'
import {
  useCreateSchoolHighlightMutation,
  useDeleteSchoolHighlightMutation,
  useGetAllSchoolHighlightsQuery,
  useUpdateSchoolHighlightMutation,
} from '../../../../../redux/features/home/schoolHighlightsApi'

export default function SchoolHighlightsAdmin() {
  const [formData, setFormData] = useState({ title: '', desc: '' })
  const [editId, setEditId] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { data, isLoading, error } = useGetAllSchoolHighlightsQuery()
  const highlights = Array.isArray(data?.data) ? data.data : []

  const [createHighlight] = useCreateSchoolHighlightMutation()
  const [updateHighlight] = useUpdateSchoolHighlightMutation()
  const [deleteHighlight] = useDeleteSchoolHighlightMutation()

  const resetForm = () => {
    setFormData({ title: '', desc: '' })
    setEditId(null)
    setIsModalOpen(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      if (editId) {
        await updateHighlight({ id: editId, data: formData }).unwrap()
        toast.success('Highlight updated')
      } else {
        await createHighlight(formData).unwrap()
        toast.success('Highlight created')
      }
      resetForm()
    } catch {
      toast.error('Something went wrong')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (item) => {
    setFormData({ title: item.title, desc: item.desc })
    setEditId(item._id)
    setIsModalOpen(true)
  }

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this highlight?')) {
      try {
        await deleteHighlight(id).unwrap()
        toast.success('Highlight deleted')
      } catch {
        toast.error('Delete failed')
      }
    }
  }

  return (
    <div className="p-4 sm:p-6 bg-gray-100 min-h-screen text-black">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <h2 className="text-2xl font-semibold">School Highlights</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
        >
          + Add Highlight
        </button>
      </div>

      {/* LOADING / ERROR */}
      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">Failed to load highlights</p>
      ) : highlights.length === 0 ? (
        <p className="text-center text-gray-500 mt-10">
          No highlights added yet.
        </p>
      ) : (
        <>
          {/* DESKTOP / TABLET TABLE */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-[700px] w-full border bg-white rounded shadow">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3">#</th>
                  <th className="p-3">Title</th>
                  <th className="p-3">Description</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {highlights.map((item, index) => (
                  <tr key={item._id} className="border-t hover:bg-gray-50">
                    <td className="p-3">{index + 1}</td>
                    <td className="p-3 font-medium">{item.title}</td>
                    <td className="p-3 text-gray-600 break-words">
                      {item.desc}
                    </td>
                    <td className="p-3 space-x-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
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
            {highlights.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-xl shadow-md p-4"
              >
                <h4 className="font-semibold text-lg">{item.title}</h4>
                <p className="text-sm text-gray-600 mt-1 break-words">
                  {item.desc}
                </p>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleEdit(item)}
                    className="bg-yellow-400 text-white py-2 rounded text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="bg-red-500 text-white py-2 rounded text-sm"
                  >
                    Delete
                  </button>
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
              {editId ? 'Edit Highlight' : 'Add Highlight'}
            </h3>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
              <input
                type="text"
                placeholder="Title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
                className="border px-3 py-2 rounded text-base"
              />

              <textarea
                placeholder="Description"
                value={formData.desc}
                onChange={(e) =>
                  setFormData({ ...formData, desc: e.target.value })
                }
                required
                rows={4}
                className="border px-3 py-2 rounded text-base"
              />

              <div className="flex flex-col sm:flex-row justify-end gap-3 pt-2">
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
                  {isSubmitting
                    ? 'Saving...'
                    : editId
                      ? 'Update'
                      : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
