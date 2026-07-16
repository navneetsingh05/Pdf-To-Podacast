import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function Profile() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    bio: "",
    phone: "",
  });

  const [avatarPreview, setAvatarPreview] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("currentUser");
    if (!stored) {
      navigate("/login");
      return;
    }
    const u = JSON.parse(stored);
    setUser(u);
    setForm({
      name: u.name || "",
      email: u.email || "",
      bio: u.bio || "",
      phone: u.phone || "",
    });
    setAvatarPreview(u.avatar || null);
  }, [navigate]);

  function handleAvatarChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setAvatarPreview(ev.target.result);
    reader.readAsDataURL(file);
  }

  async function handleSave() {
    setSaving(true);
    // Simulate small save delay for UX
    await new Promise((r) => setTimeout(r, 600));

    const updatedUser = {
      ...user,
      name: form.name,
      bio: form.bio,
      phone: form.phone,
      avatar: avatarPreview,
    };

    localStorage.setItem("currentUser", JSON.stringify(updatedUser));

    // Also update in users array
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const idx = users.findIndex((u) => u.email === updatedUser.email);
    if (idx !== -1) users[idx] = updatedUser;
    else users.push(updatedUser);
    localStorage.setItem("users", JSON.stringify(users));

    setUser(updatedUser);
    setSaving(false);
    setEditMode(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  function handleCancel() {
    setForm({
      name: user.name || "",
      email: user.email || "",
      bio: user.bio || "",
      phone: user.phone || "",
    });
    setAvatarPreview(user.avatar || null);
    setEditMode(false);
  }

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  const podcasts = JSON.parse(localStorage.getItem("podcasts")) || [];

  if (!user) return null;

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      {/* Background glows */}
      <div className="fixed top-0 left-0 w-96 h-96 bg-blue-600 opacity-10 blur-[150px] pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-96 h-96 bg-purple-600 opacity-10 blur-[150px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 py-12 relative z-10">

        {/* Success toast */}
        {saved && (
          <div className="fixed top-24 right-6 bg-green-600 text-white px-6 py-3 rounded-2xl shadow-2xl z-50 flex items-center gap-2 animate-pulse">
            ✅ Profile saved successfully!
          </div>
        )}

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">My Profile</h1>
          <p className="text-gray-400 mt-1">Manage your account information</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">

          {/* LEFT — Avatar card */}
          <div className="lg:col-span-1">
            <div className="bg-white/5 border border-gray-800 rounded-3xl p-6 text-center">

              {/* Avatar */}
              <div className="relative inline-block mb-4">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt={user.name}
                    className="w-28 h-28 rounded-full object-cover ring-4 ring-blue-500/30"
                  />
                ) : (
                  <div className="w-28 h-28 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-4xl font-bold ring-4 ring-blue-500/30">
                    {initials}
                  </div>
                )}
                {editMode && (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 w-9 h-9 bg-blue-600 hover:bg-blue-500 rounded-full flex items-center justify-center text-lg shadow-lg duration-200"
                    title="Change photo"
                  >
                    📷
                  </button>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </div>

              <h2 className="text-xl font-bold">{user.name}</h2>
              <p className="text-gray-400 text-sm mt-1">{user.email}</p>

              {user.provider === "google" && (
                <span className="inline-flex items-center gap-1 mt-2 text-xs text-blue-400 bg-blue-400/10 px-3 py-1 rounded-full border border-blue-400/20">
                  <svg width="12" height="12" viewBox="0 0 48 48">
                    <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.2l6.7-6.7C35.8 2.3 30.2 0 24 0 14.7 0 6.7 5.5 2.8 13.5l7.8 6C12.4 13.6 17.8 9.5 24 9.5z"/>
                    <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8C43.8 37.5 46.5 31.4 46.5 24.5z"/>
                    <path fill="#FBBC05" d="M10.6 28.5c-.5-1.5-.8-3-.8-4.5s.3-3 .8-4.5l-7.8-6C1 16.3 0 20 0 24s1 7.7 2.8 10.5l7.8-6z"/>
                    <path fill="#34A853" d="M24 48c6.2 0 11.4-2 15.2-5.5l-7.5-5.8c-2 1.4-4.6 2.3-7.7 2.3-6.2 0-11.5-4.2-13.4-9.8l-7.8 6C6.7 42.5 14.7 48 24 48z"/>
                  </svg>
                  Connected via Google
                </span>
              )}

              {user.bio && !editMode && (
                <p className="text-gray-400 text-sm mt-4 leading-relaxed">{user.bio}</p>
              )}

              {/* Stats */}
              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="bg-black/40 border border-gray-800 rounded-2xl p-3">
                  <p className="text-2xl font-bold text-blue-400">{podcasts.length}</p>
                  <p className="text-gray-500 text-xs mt-1">Podcasts</p>
                </div>
                <div className="bg-black/40 border border-gray-800 rounded-2xl p-3">
                  <p className="text-2xl font-bold text-purple-400">
                    {[...new Set(podcasts.map((p) => p.lang).filter(Boolean))].length || 1}
                  </p>
                  <p className="text-gray-500 text-xs mt-1">Languages</p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT — Edit form */}
          <div className="lg:col-span-2">
            <div className="bg-white/5 border border-gray-800 rounded-3xl p-6">

              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Account Details</h2>
                {!editMode && (
                  <button
                    onClick={() => setEditMode(true)}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-xl text-sm font-semibold duration-200"
                  >
                    ✏️ Edit Profile
                  </button>
                )}
              </div>

              <div className="space-y-5">
                {/* Name */}
                <div>
                  <label className="text-xs text-gray-400 mb-1.5 block uppercase tracking-wider">Full Name</label>
                  {editMode ? (
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full bg-black/50 border border-gray-700 focus:border-blue-500 rounded-xl px-4 py-3 outline-none transition-colors text-white"
                      placeholder="Your full name"
                    />
                  ) : (
                    <p className="bg-black/30 border border-gray-800 rounded-xl px-4 py-3 text-white">{user.name || "—"}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="text-xs text-gray-400 mb-1.5 block uppercase tracking-wider">Email Address</label>
                  <p className="bg-black/30 border border-gray-800 rounded-xl px-4 py-3 text-gray-400">
                    {user.email}
                    <span className="ml-2 text-xs text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full">Verified</span>
                  </p>
                  <p className="text-xs text-gray-600 mt-1">Email cannot be changed</p>
                </div>

                {/* Phone */}
                <div>
                  <label className="text-xs text-gray-400 mb-1.5 block uppercase tracking-wider">Phone Number</label>
                  {editMode ? (
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full bg-black/50 border border-gray-700 focus:border-blue-500 rounded-xl px-4 py-3 outline-none transition-colors text-white"
                      placeholder="+91 9999999999"
                    />
                  ) : (
                    <p className="bg-black/30 border border-gray-800 rounded-xl px-4 py-3 text-white">{user.phone || "—"}</p>
                  )}
                </div>

                {/* Bio */}
                <div>
                  <label className="text-xs text-gray-400 mb-1.5 block uppercase tracking-wider">Bio</label>
                  {editMode ? (
                    <textarea
                      value={form.bio}
                      onChange={(e) => setForm({ ...form, bio: e.target.value })}
                      rows={3}
                      className="w-full bg-black/50 border border-gray-700 focus:border-blue-500 rounded-xl px-4 py-3 outline-none transition-colors text-white resize-none"
                      placeholder="Tell us a little about yourself..."
                    />
                  ) : (
                    <p className="bg-black/30 border border-gray-800 rounded-xl px-4 py-3 text-white min-h-[80px]">{user.bio || "—"}</p>
                  )}
                </div>

                {/* Account type */}
                <div>
                  <label className="text-xs text-gray-400 mb-1.5 block uppercase tracking-wider">Account Type</label>
                  <p className="bg-black/30 border border-gray-800 rounded-xl px-4 py-3 text-white capitalize">
                    {user.provider === "google" ? "🌐 Google Account" : "📧 Email Account"}
                  </p>
                </div>

                {/* Edit mode buttons */}
                {editMode && (
                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 py-3 rounded-xl font-semibold duration-200 disabled:opacity-60 flex items-center justify-center gap-2"
                    >
                      {saving ? (
                        <>
                          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                          </svg>
                          Saving...
                        </>
                      ) : "💾 Save Changes"}
                    </button>
                    <button
                      onClick={handleCancel}
                      className="flex-1 border border-gray-700 hover:border-gray-500 py-3 rounded-xl font-semibold duration-200 text-gray-300"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Recent podcasts */}
            {podcasts.length > 0 && (
              <div className="bg-white/5 border border-gray-800 rounded-3xl p-6 mt-6">
                <h2 className="text-xl font-bold mb-4">Recent Podcasts</h2>
                <div className="space-y-3">
                  {podcasts.slice(0, 4).map((p, i) => (
                    <div key={i} className="flex items-center justify-between bg-black/30 border border-gray-800 rounded-xl px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-sm">
                          🎙️
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white truncate max-w-[200px]">{p.title}</p>
                          <p className="text-xs text-gray-500">{p.time}</p>
                        </div>
                      </div>
                      <span className="text-xs text-blue-400 bg-blue-400/10 px-2 py-1 rounded-full border border-blue-400/20">
                        {p.langLabel || "English"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
