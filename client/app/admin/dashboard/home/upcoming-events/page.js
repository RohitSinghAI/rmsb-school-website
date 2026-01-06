'use client'

import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { useCreateUpcomingEventMutation, useDeleteUpcomingEventMutation, useGetAllUpcomingEventsQuery, useUpdateUpcomingEventMutation } from '../../../../../redux/features/home/upcomingEventApi'


export default function UpcomingEventsAdmin() {
  const [formData, setFormData] = useState({
    date: '',
    title: '',
    description: '',
  })
  const [editId, setEditId] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { data, isLoading, error } = useGetAllUpcomingEventsQuery()
  const events = Array.isArray(data?.data) ? data.data : []

  const [createEvent] = useCreateUpcomingEventMutation()
  const [updateEvent] = useUpdateUpcomingEventMutation()
  const [deleteEvent] = useDeleteUpcomingEventMutation()

  const resetForm = () => {
    setFormData({ date: '', title: '', description: '' })
    setEditId(null)
    setIsModalOpen(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      if (editId) {
        await updateEvent({ id: editId, data: formData }).unwrap()
        toast.success('Event updated')
      } else {
        await createEvent(formData).unwrap()
        toast.success('Event created')
      }
      resetForm()
    } catch {
      toast.error('Action failed')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (event) => {
    setFormData({
      date: event.date,
      title: event.title,
      description: event.description,
    })
    setEditId(event._id)
    setIsModalOpen(true)
  }

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this event?')) {
      try {
        await deleteEvent(id).unwrap()
        toast.success('Event deleted')
      } catch {
        toast.error('Delete failed')
      }
    }
  }

  return (
    <div className="p-4 sm:p-6 bg-gray-100 min-h-screen text-black">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <h2 className="text-2xl font-semibold">Upcoming Events</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
        >
          + Add Event
        </button>
      </div>

      {/* LOADING / ERROR / EMPTY */}
      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">Failed to load events</p>
      ) : events.length === 0 ? (
        <p className="text-center text-gray-500 mt-10">
          No upcoming events added yet.
        </p>
      ) : (
        <>
          {/* DESKTOP / TABLET TABLE */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-[750px] w-full border bg-white rounded shadow">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3">#</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Title</th>
                  <th className="p-3">Description</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event, index) => (
                  <tr key={event._id} className="border-t hover:bg-gray-50">
                    <td className="p-3">{index + 1}</td>
                    <td className="p-3 font-medium">{event.date}</td>
                    <td className="p-3">{event.title}</td>
                    <td className="p-3 text-gray-600 break-words">
                      {event.description}
                    </td>
                    <td className="p-3 space-x-2">
                      <button
                        onClick={() => handleEdit(event)}
                        className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(event._id)}
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
            {events.map((event) => (
              <div
                key={event._id}
                className="bg-white rounded-xl shadow-md p-4"
              >
                <h4 className="font-semibold text-lg">{event.title}</h4>
                <p className="text-sm text-gray-500">{event.date}</p>
                <p className="text-sm text-gray-600 mt-2 break-words">
                  {event.description}
                </p>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleEdit(event)}
                    className="bg-yellow-400 text-white py-2 rounded text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(event._id)}
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
          <div className="bg-white w-full max-w-md max-h-[90vh] overflow-y-auto rounded-lg p-4 sm:p-6 relative mx-2">

            <button
              onClick={resetForm}
              className="absolute top-3 right-3 text-gray-500 hover:text-black"
            >
              ✕
            </button>

            <h3 className="text-xl font-semibold mb-4">
              {editId ? 'Edit Event' : 'Add Event'}
            </h3>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
              <input
                type="text"
                placeholder="Date (e.g. 01/11/2026)"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                required
                className="border px-3 py-2 rounded text-base"
              />

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
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
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
