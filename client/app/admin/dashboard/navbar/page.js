"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
    useGetNavbarQuery,
    useCreateNavbarMutation,
    useUpdateNavbarMutation,
} from "@/redux/features/navbar/page";

export default function NavbarDashboard() {
    const { data, isLoading } = useGetNavbarQuery();
    const navbar = data?.navbar;

    const [createNavbar, { isLoading: creating }] =
        useCreateNavbarMutation();
    const [updateNavbar, { isLoading: updating }] =
        useUpdateNavbarMutation();

    const loadingSubmit = creating || updating;

    const [title, setTitle] = useState("");
    const [subtitle, setSubtitle] = useState("");
    const [logoText, setLogoText] = useState("");
    const [href, setHref] = useState("/");
    const [logoImage, setLogoImage] = useState(null);
    const [logoPreview, setLogoPreview] = useState("");
    const [marqueeItems, setMarqueeItems] = useState([
        { text: "", isActive: true },
    ]);

    // ================= PREFILL =================
    useEffect(() => {
        if (navbar) {
            setTitle(navbar.brand.title || "");
            setSubtitle(navbar.brand.subtitle || "");
            setLogoText(navbar.brand.logoText || "");
            setHref(navbar.brand.href || "/");
            setMarqueeItems(
                navbar.marqueeItems?.length
                    ? navbar.marqueeItems
                    : [{ text: "", isActive: true }]
            );
            setLogoPreview(navbar.brand.logoImage?.url || "");
        }
    }, [navbar]);

    // ================= MARQUEE HANDLERS (IMMUTABLE FIX) =================
    const addMarquee = () => {
        setMarqueeItems(prev => [...prev, { text: "", isActive: true }]);
    };

    const updateMarqueeText = (index, value) => {
        setMarqueeItems(prev =>
            prev.map((item, i) =>
                i === index ? { ...item, text: value } : item
            )
        );
    };

    const toggleMarquee = (index) => {
        setMarqueeItems(prev =>
            prev.map((item, i) =>
                i === index ? { ...item, isActive: !item.isActive } : item
            )
        );
    };

    const removeMarquee = (index) => {
        setMarqueeItems(prev => prev.filter((_, i) => i !== index));
    };

    // ================= IMAGE HANDLER =================
    const handleImageChange = (file) => {
        if (!file) return;
        setLogoImage(file);
        setLogoPreview(URL.createObjectURL(file));
    };

    // ================= CLEAN MARQUEE =================
    const cleanMarqueeItems = (items) =>
        items.filter(item => item.text.trim() !== "");

    // ================= SUBMIT =================
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title || !subtitle) {
            toast.error("Title & Subtitle required");
            return;
        }

        const cleanedMarquee = cleanMarqueeItems(marqueeItems);

        if (!cleanedMarquee.length) {
            toast.error("At least one marquee text is required");
            return;
        }

        const formData = new FormData();
        formData.append("title", title);
        formData.append("subtitle", subtitle);
        formData.append("logoText", logoText);
        formData.append("href", href);
        formData.append(
            "marqueeItems",
            JSON.stringify(cleanedMarquee)
        );

        if (logoImage) {
            formData.append("logoImage", logoImage);
        }

        try {
            if (navbar?._id) {
                await updateNavbar({ id: navbar._id, formData }).unwrap();
                toast.success("Navbar updated successfully 🎉");
            } else {
                await createNavbar(formData).unwrap();
                toast.success("Navbar created successfully 🎉");
            }
        } catch (error) {
            toast.error("Something went wrong ❌");
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-lg font-medium">isLoading...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-8 px-3 sm:px-4">
            <div className="max-w-5xl mx-auto p-6 sm:p-8 rounded-xl shadow">
                <h1 className="text-2xl sm:text-3xl font-bold mb-8 text-indigo-600">
                    - Admin Navbar
                </h1>
                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* ================= BRAND ================= */}
                    <div>
                        <h2 className="text-xl font-semibold mb-4">Navbar Details</h2>

                        <div className="grid sm:grid-cols-2 gap-4">
                            <input
                                className="border p-3 rounded w-full"
                                placeholder="School Title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />

                            <input
                                className="border p-3 rounded w-full"
                                placeholder="Subtitle"
                                value={subtitle}
                                onChange={(e) => setSubtitle(e.target.value)}
                                required
                            />

                            <input
                                className="border p-3 rounded w-full"
                                placeholder="Logo Text (fallback)"
                                value={logoText}
                                onChange={(e) => setLogoText(e.target.value)}
                            />

                            <input
                                className="border p-3 rounded w-full"
                                placeholder="Homepage URL"
                                value={href}
                                onChange={(e) => setHref(e.target.value)}
                            />
                        </div>

                        {/* Logo */}
                        <div className="mt-5">
                            <label className="font-medium block mb-2">
                                Logo Image
                            </label>

                            {logoPreview && (
                                <img
                                    src={logoPreview}
                                    alt="Logo Preview"
                                    className="w-24 h-24 rounded-full object-contain mb-3 border"
                                />
                            )}

                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) =>
                                    handleImageChange(e.target.files[0])
                                }
                            />
                        </div>
                    </div>

                    {/* ================= MARQUEE ================= */}
                    <div>
                        <h2 className="text-xl font-semibold mb-4">Marquee Text</h2>

                        <div className="space-y-4">
                            {marqueeItems.map((item, index) => (
                                <div
                                    key={index}
                                    className="flex flex-col sm:flex-row gap-3 items-center border p-3 rounded"
                                >
                                    <input
                                        className="border p-2 rounded w-full"
                                        placeholder={`Marquee Text ${index + 1}`}
                                        value={item.text}
                                        onChange={(e) =>
                                            updateMarqueeText(index, e.target.value)
                                        }
                                    />

                                    <label className="flex items-center gap-2 text-sm">
                                        <input
                                            type="checkbox"
                                            checked={item.isActive}
                                            onChange={() => toggleMarquee(index)}
                                        />
                                        Active
                                    </label>

                                    <button
                                        type="button"
                                        onClick={() => removeMarquee(index)}
                                        className="text-red-500 text-sm font-medium"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                        </div>

                        <button
                            type="button"
                            onClick={addMarquee}
                            className="mt-3 text-indigo-600 font-medium"
                        >
                            + Add More Marquee
                        </button>
                    </div>

                    {/* ================= SUBMIT ================= */}
                    <button
                        type="submit"
                        disabled={loadingSubmit}
                        className={`w-full py-3 rounded-lg font-semibold transition
              ${loadingSubmit
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-indigo-600 hover:bg-indigo-700 text-white"
                            }`}
                    >
                        {loadingSubmit ? "Saving..." : "Save Navbar Settings"}
                    </button>
                </form>
            </div>
        </div>
    );
}
