"use client";

import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  useGetAllContactInfoQuery,
  useCreateContactInfoMutation,
  useUpdateContactInfoMutation,
  useDeleteContactInfoMutation,
} from "@/redux/features/contact/contactInfoApi";

const ContactInfo = () => {
  const { data, isLoading } = useGetAllContactInfoQuery();
  const [createContactInfo] = useCreateContactInfoMutation();
  const [updateContactInfo] = useUpdateContactInfoMutation();
  const [deleteContactInfo] = useDeleteContactInfoMutation();

  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState(null);

  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [mapUrl, setMapUrl] = useState("");
  const [streetViewUrl, setStreetViewUrl] = useState("");

  useEffect(() => {
    if (editData) {
      setAddress(editData.address || "");
      setPhone(editData.phone || "");
      setEmail(editData.email || "");
      setMapUrl(editData.mapUrl || "");
      setStreetViewUrl(editData.streetViewUrl || "");
    } else {
      setAddress("");
      setPhone("");
      setEmail("");
      setMapUrl("");
      setStreetViewUrl("");
    }
  }, [editData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      address,
      phone,
      email,
      mapUrl,
      streetViewUrl,
    };

    try {
      if (editData) {
        await updateContactInfo({ id: editData._id, data: payload }).unwrap();
        toast.success("Contact info updated");
      } else {
        await createContactInfo(payload).unwrap();
        toast.success("Contact info added");
      }

      setShowModal(false);
      setEditData(null);
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this contact info?")) return;
    try {
      await deleteContactInfo(id).unwrap();
      toast.success("Deleted");
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Contact Information</h2>
        <button
          onClick={() => {
            setEditData(null);
            setShowModal(true);
          }}
          className="bg-indigo-600 text-white px-5 py-2 rounded-xl"
        >
          + Add
        </button>
      </div>

      {/* TABLE */}
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="p-4">Address</th>
                <th className="p-4">Phone</th>
                <th className="p-4">Email</th>
                <th className="p-4">Map</th>
                <th className="p-4">Street View</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {data?.data?.length ? (
                data.data.map((item) => (
                  <tr key={item._id} className="border-b">
                    <td className="p-4">{item.address}</td>
                    <td className="p-4">{item.phone}</td>
                    <td className="p-4">{item.email}</td>

                    {/* MAP SAFE */}
                    <td className="p-4">
                      {item.mapUrl ? (
                        <a
                          href={item.mapUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline"
                        >
                          View Map
                        </a>
                      ) : (
                        "-"
                      )}
                    </td>

                    {/* STREET VIEW SAFE */}
                    <td className="p-4">
                      {item.streetViewUrl ? (
                        <a
                          href={item.streetViewUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline"
                        >
                          Street View
                        </a>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>

                    <td className="p-4 space-x-2">
                      <button
                        onClick={() => {
                          setEditData(item);
                          setShowModal(true);
                        }}
                        className="bg-yellow-400 px-3 py-1 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="bg-red-500 text-white px-3 py-1 rounded"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="p-6 text-center text-gray-400">
                    No data found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-md">
            <h3 className="font-semibold mb-4">
              {editData ? "Edit Contact" : "Add Contact"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                placeholder="Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full border px-4 py-2 rounded"
                required
              />
              <input
                placeholder="Phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full border px-4 py-2 rounded"
                required
              />
              <input
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border px-4 py-2 rounded"
                required
              />
              <input
                placeholder="Map Embed URL"
                value={mapUrl}
                onChange={(e) => setMapUrl(e.target.value)}
                className="w-full border px-4 py-2 rounded"
                required
              />
              <input
                placeholder="Street View URL"
                value={streetViewUrl}
                onChange={(e) => setStreetViewUrl(e.target.value)}
                className="w-full border px-4 py-2 rounded"
                required
              />

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 text-white px-4 py-2 rounded"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactInfo;
