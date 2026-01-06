'use client'
import React, { useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import {
  useGetAllFacultyQuery,
  useCreateFacultyMutation,
  useUpdateFacultyMutation,
  useDeleteFacultyMutation,
} from '@/redux/features/teacher/page'

/* ================= CONSTANT ================= */
const EMPTY_FORM = {
  name: '',
  department: '',
  subject: '',
  experience: '',
  email: '',
  courses: '',
  bio: '',
}

/* ================= DATE FORMAT ================= */
const formatDate = (date) =>
  date
    ? new Date(date).toLocaleString('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short',
    })
    : '—'

export default function FacultyPage() {
  const { data, isLoading } = useGetAllFacultyQuery()
  const [createFaculty] = useCreateFacultyMutation()
  const [updateFaculty] = useUpdateFacultyMutation()
  const [deleteFaculty] = useDeleteFacultyMutation()

  const facultyList = data?.data || []

  const [active, setActive] = useState(null)
  const [edit, setEdit] = useState(false)
  const [showCreate, setShowCreate] = useState(false)
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState(EMPTY_FORM)
  const [image, setImage] = useState(null)
  const [preview, setPreview] = useState(null)

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    )
  }

  /* ================= HELPERS ================= */
  const openProfile = (f) => {
    setActive(f)
    setEdit(false)
    setPreview(null)
    setImage(null)
    setForm({
      name: f.name || '',
      department: f.department || '',
      subject: f.subject || '',
      experience: f.experience || '',
      email: f.email || '',
      courses: Array.isArray(f.courses) ? f.courses.join(', ') : f.courses || '',
      bio: f.bio || '',
    })
  }

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value })

  const handleImage = (file) => {
    if (!file || !file.type.startsWith('image/')) {
      toast.error('Please select a valid image')
      return
    }
    setImage(file)
    setPreview(URL.createObjectURL(file))
  }

  /* ================= CREATE ================= */
  const createNew = async () => {
    try {
      setLoading(true)
      const fd = new FormData()
      Object.entries(form).forEach(([k, v]) => fd.append(k, v))
      if (image) fd.append('image', image)

      await createFaculty(fd).unwrap()
      toast.success('Faculty created')

      setShowCreate(false)
      setForm(EMPTY_FORM)
      setImage(null)
      setPreview(null)
    } catch {
      toast.error('Create failed')
    } finally {
      setLoading(false)
    }
  }

  /* ================= UPDATE ================= */
  const saveUpdate = async () => {
    try {
      setLoading(true)
      const fd = new FormData()
      Object.entries(form).forEach(([k, v]) => fd.append(k, v))
      if (image) fd.append('image', image)

      await updateFaculty({ id: active._id, formData: fd }).unwrap()
      toast.success('Profile updated')
      setActive(null)
    } catch {
      toast.error('Update failed')
    } finally {
      setLoading(false)
    }
  }

  /* ================= DELETE ================= */
  const remove = async (id) => {
    if (window.confirm('Delete this faculty permanently?')) {
      await deleteFaculty(id)
      setActive(null)
    }
  }

  /* ================= LIST VIEW ================= */
  if (!active) {
    return (
      <div className="min-h-screen bg-[#f6f7fb] px-4 sm:px-6 lg:px-14 py-6">
        <Toaster position="top-right" />

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
          <h1 className="text-2xl sm:text-4xl font-bold">
            Faculty Profiles
          </h1>
          <SmallButton text="+ Add Faculty" onClick={() => setShowCreate(true)} />
        </div>

        {/* ===== PREMIUM PORTFOLIO GRID ===== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {facultyList.map((f) => (
            <div
              key={f._id}
              onClick={() => openProfile(f)}
              className="
                cursor-pointer
                bg-white/80 backdrop-blur
                rounded-3xl
                ring-1 ring-black/5
                shadow hover:shadow-xl
                transition
                overflow-hidden
              "
            >
              <div className="relative group overflow-hidden">
                <img
                  src={f.image?.url || 'https://via.placeholder.com/600'}
                  className="
                    w-full h-48 sm:h-56 lg:h-60 object-cover
                    transition-transform duration-700
                    group-hover:scale-110
                  "
                />

                <div className="
                  absolute inset-0
                  bg-gradient-to-t from-black/60 via-black/20 to-transparent
                  opacity-0 group-hover:opacity-100
                  transition
                " />

                <div className="
                  absolute bottom-4 left-4 right-4
                  text-white
                  translate-y-4 group-hover:translate-y-0
                  opacity-0 group-hover:opacity-100
                  transition duration-500
                ">
                  <h3 className="font-semibold text-lg">{f.name}</h3>
                  <p className="text-sm opacity-90">{f.department}</p>
                </div>
              </div>

              <div className="p-5">
                <p className="text-sm text-gray-500">{f.subject}</p>
              </div>
            </div>
          ))}
        </div>

        {showCreate && (
          <Drawer
            title="Add Faculty"
            onClose={() => {
              setShowCreate(false)
              setForm(EMPTY_FORM)
              setImage(null)
              setPreview(null)
            }}
          >
            <ImagePicker preview={preview} onPick={handleImage} />
            <FormFields form={form} onChange={handleChange} />
            <SmallPrimaryButton
              text={loading ? 'Creating...' : 'Create'}
              onClick={createNew}
              disabled={loading}
            />
          </Drawer>

        )}
      </div>
    )
  }

  /* ================= PROFILE VIEW ================= */
  return (
    <div className="min-h-screen bg-[#f6f7fb] px-4 sm:px-8 lg:px-16 py-8">
      <button
        onClick={() => setActive(null)}
        className="mb-6 text-sm text-gray-500"
      >
        ← Back
      </button>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10">
        <ImageSection
          image={preview || active.image?.url}
          name={active.name}
          department={active.department}
          editable={edit}
          onPick={handleImage}
        />

        <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8">
          {!edit ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Info label="Subject" value={active.subject} />
                <Info label="Experience" value={active.experience} />
                <Info label="Email" value={active.email} />
                <Info label="Courses" value={active.courses} />
                <Info label="Created At" value={formatDate(active.createdAt)} />
                <Info label="Last Updated" value={formatDate(active.updatedAt)} />
              </div>

              <div className="mt-6">
                <p className="text-sm text-gray-400">Bio</p>
                <p className="text-sm text-gray-700">{active.bio}</p>
              </div>

              <div className="flex flex-wrap gap-3 mt-8">
                <SmallPrimaryButton text="Edit" onClick={() => setEdit(true)} />
                <SmallDangerButton text="Delete" onClick={() => remove(active._id)} />
              </div>
            </>
          ) : (
            <>
              <FormFields form={form} onChange={handleChange} />
              <SmallPrimaryButton
                text={loading ? 'Saving...' : 'Save Changes'}
                onClick={saveUpdate}
                disabled={loading}
              />
            </>
          )}
        </div>
      </div>
    </div>
  )
}

/* ================= UI COMPONENTS ================= */

const SmallButton = ({ text, onClick }) => (
  <button
    onClick={onClick}
    className="px-4 py-2 rounded-full bg-black text-white"
  >
    {text}
  </button>
)

const SmallPrimaryButton = ({ text, onClick, disabled }) => (
  <button
    disabled={disabled}
    onClick={onClick}
    className={`
      px-5 py-2 rounded-full text-white transition
      ${disabled ? 'bg-gray-400' : 'bg-black hover:scale-105'}
    `}
  >
    {text}
  </button>
)

const SmallDangerButton = ({ text, onClick }) => (
  <button
    onClick={onClick}
    className="px-5 py-2 rounded-full border border-red-500 text-red-600"
  >
    {text}
  </button>
)

const Drawer = ({ title, children, onClose }) => (
  <div className="fixed inset-0 bg-black/40 flex justify-end z-50">
    <div className="w-full sm:w-[420px] bg-white p-6">
      <div className="flex justify-between mb-4">
        <h2 className="font-semibold">{title}</h2>
        <button onClick={onClose}>✕</button>
      </div>
      {children}
    </div>
  </div>
)

const ImagePicker = ({ preview, onPick }) => (
  <div className="mb-6">
    <div className="relative group rounded-2xl overflow-hidden shadow-lg">
      <img
        src={preview || 'https://via.placeholder.com/600'}
        className="
          w-full h-40 sm:h-48 object-cover
          transition-transform duration-700
          group-hover:scale-105
        "
      />
      <label className="
        absolute inset-0
        bg-black/60
        text-white
        flex items-center justify-center
        text-sm font-medium
        opacity-0 group-hover:opacity-100
        cursor-pointer
        transition
      ">
        Upload Photo
        <input
          hidden
          type="file"
          accept="image/*"
          onChange={(e) => onPick(e.target.files[0])}
        />
      </label>
    </div>
  </div>
)

const ImageSection = ({ image, name, department, editable, onPick }) => (
  <div className="
    relative group
    rounded-[2rem]
    overflow-hidden
    shadow-[0_30px_80px_rgba(0,0,0,0.25)]
  ">
    <img
      src={image || 'https://via.placeholder.com/900'}
      className="
        w-full h-64 sm:h-80 lg:h-[440px]
        object-cover
        transition-transform duration-700
        group-hover:scale-105
      "
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
    <div className="absolute bottom-6 left-6 text-white">
      <h2 className="text-2xl font-semibold">{name}</h2>
      <p className="text-sm opacity-90">{department}</p>
    </div>
    {editable && (
      <label className="
        absolute inset-0
        bg-black/60
        flex items-center justify-center
        text-white text-sm font-medium
        opacity-0 group-hover:opacity-100
        cursor-pointer
        transition
      ">
        Change Photo
        <input
          hidden
          type="file"
          accept="image/*"
          onChange={(e) => onPick(e.target.files[0])}
        />
      </label>
    )}
  </div>
)

const FormFields = ({ form, onChange }) => (
  <div className="space-y-4 mb-6">
    {Object.keys(form).map((k) => (
      <input
        key={k}
        name={k}
        value={form[k]}
        onChange={onChange}
        placeholder={k}
        className="w-full px-4 py-2 border rounded-xl"
      />
    ))}
  </div>
)

const Info = ({ label, value }) => (
  <div>
    <p className="text-xs text-gray-400">{label}</p>
    <p className="text-sm font-medium">{value}</p>
  </div>
)
