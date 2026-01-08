"use client";

import { useDeleteContactMutation, useGetAllContactQuery } from "@/redux/features/contact/contactApi";
import { Trash2, Mail, Phone, User } from "lucide-react";
import toast from "react-hot-toast";

export default function ContactListPage() {
    const { data, isLoading, isError } = useGetAllContactQuery();
    const [deleteContact, { isLoading: deleting }] = useDeleteContactMutation();

    const handleDelete = async (id) => {
        if (!confirm("Delete this contact message?")) return;

        try {
            await deleteContact(id).unwrap();
            toast.success("Contact deleted successfully");
        } catch (error) {
            toast.error("Failed to delete contact");
        }
    };

    return (
        <div className="p-4 md:p-10 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-blue-900">
                    📩 Contact Messages
                </h1>
                <p className="text-gray-600 mt-1 text-sm md:text-base">
                    Parent & student contact enquiries
                </p>
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block bg-white rounded-xl shadow border">
                <div className="px-6 py-4 bg-blue-900 text-white rounded-t-xl">
                    <h2 className="font-semibold">All Messages</h2>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-blue-50 text-blue-900">
                            <tr>
                                <th className="px-6 py-3 text-left">Name</th>
                                <th className="px-6 py-3 text-left">Phone</th>
                                <th className="px-6 py-3 text-left">Email</th>
                                <th className="px-6 py-3 text-left">Message</th>
                                <th className="px-6 py-3 text-center">Action</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y">
                            {isLoading && (
                                <tr>
                                    <td colSpan="5" className="py-10 text-center text-gray-500">
                                        Loading...
                                    </td>
                                </tr>
                            )}

                            {!isLoading &&
                                data?.data?.map((item) => (
                                    <tr key={item._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 font-medium">{item.name}</td>
                                        <td className="px-6 py-4">{item.phone}</td>
                                        <td className="px-6 py-4 text-blue-700">{item.email}</td>
                                        <td className="px-6 py-4 truncate max-w-xs">
                                            {item.message || "—"}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <button
                                                onClick={() => handleDelete(item._id)}
                                                disabled={deleting}
                                                className="inline-flex items-center gap-2 text-red-600 hover:bg-red-50 px-3 py-1.5 rounded"
                                            >
                                                <Trash2 size={16} />
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-4">
                {isLoading && (
                    <p className="text-center text-gray-500">Loading...</p>
                )}

                {!isLoading &&
                    data?.data?.map((item) => (
                        <div
                            key={item._id}
                            className="bg-white rounded-xl shadow p-4 border"
                        >
                            <div className="flex items-center gap-2 font-semibold text-blue-900">
                                <User size={16} />
                                {item.name}
                            </div>

                            <div className="mt-2 text-sm text-gray-700 flex items-center gap-2">
                                <Phone size={14} />
                                {item.phone}
                            </div>

                            <div className="mt-1 text-sm text-blue-700 flex items-center gap-2">
                                <Mail size={14} />
                                {item.email}
                            </div>

                            <p className="mt-3 text-sm text-gray-600">
                                {item.message || "No message"}
                            </p>

                            <button
                                onClick={() => handleDelete(item._id)}
                                disabled={deleting}
                                className="mt-4 w-full flex items-center justify-center gap-2 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition"
                            >
                                <Trash2 size={16} />
                                Delete Message
                            </button>
                        </div>
                    ))}
            </div>

            {/* Error */}
            {isError && (
                <p className="text-center text-red-600 mt-6">
                    Failed to load contact messages
                </p>
            )}
        </div>
    );
}
