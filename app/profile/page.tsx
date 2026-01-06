"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  User,
  Mail,
  Calendar,
  MessageCircle,
  Settings,
  Shield,
  Camera,
  Save,
  X,
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale/fr";
import Link from "next/link";

interface UserProfile {
  id: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  profilePic?: string | null;
  phone?: string | null;
  dateOfBirth?: string | null;
  role: string;
  createdAt: string;
  lastLogin?: string | null;
}

interface Booking {
  id: string;
  bookedAt: string;
  class: {
    id: string;
    title: string;
    type: string;
    date: string;
    startTime: string;
    endTime: string;
    instructor: string;
  };
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    dateOfBirth: "",
    profilePic: "",
  });
  const [profilePicPreview, setProfilePicPreview] = useState<string | null>(
    null
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    // Attendre que le statut de la session soit déterminé
    if (status === "loading") {
      return;
    }

    // Si pas de session après le chargement, rediriger
    if (status === "unauthenticated" || !session) {
      console.log("[Profile] No session, redirecting to signin", { status, hasSession: !!session });
      router.push("/auth/signin");
      return;
    }

    // Si on a une session, charger le profil
    if (session && status === "authenticated") {
      console.log("[Profile] Session found, loading profile", { email: session.user?.email });
      fetchProfile();
      // Ne charger les réservations que pour les admins
      if ((session.user as any)?.role === "admin") {
        fetchBookings();
      }
    }
  }, [session, status, router]);

  const fetchProfile = async () => {
    try {
      const response = await fetch("/api/profile", {
        credentials: "include",
      });

      if (response.status === 401) {
        // Non authentifié en production : rediriger vers la page de connexion
        router.push("/auth/signin");
        return;
      }

      if (!response.ok) {
        throw new Error("Erreur lors du chargement du profil");
      }

      const data = await response.json();
      setUser(data);
      setFormData({
        firstName: data.firstName || "",
        lastName: data.lastName || "",
        phone: data.phone || "",
        dateOfBirth: data.dateOfBirth
          ? format(new Date(data.dateOfBirth), "yyyy-MM-dd")
          : "",
        profilePic: data.profilePic || "",
      });
      setProfilePicPreview(data.profilePic || null);
    } catch (err) {
      console.error(err);
      setError(
        "Impossible de charger votre profil. Veuillez réessayer plus tard."
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchBookings = async () => {
    try {
      const response = await fetch("/api/bookings", {
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        // Vérifier que c'est bien un tableau
        if (Array.isArray(data)) {
          setBookings(data);
        } else {
          setBookings([]);
        }
      }
    } catch (err) {
      console.error(err);
      setBookings([]);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Erreur lors de la sauvegarde");
      }

      const updatedUser = await response.json();
      setUser(updatedUser);
      setProfilePicPreview(updatedUser.profilePic || null);
      setIsEditing(false);
      setSuccess("Profil mis à jour avec succès");

      // Mettre à jour la session
      window.location.reload();
    } catch (err: any) {
      setError(err.message || "Erreur lors de la sauvegarde");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        phone: user.phone || "",
        dateOfBirth: user.dateOfBirth
          ? format(new Date(user.dateOfBirth), "yyyy-MM-dd")
          : "",
        profilePic: user.profilePic || "",
      });
      setProfilePicPreview(user.profilePic || null);
    }
    setIsEditing(false);
    setError("");
    setSuccess("");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Vérifier la taille du fichier (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("L'image est trop grande. Taille maximale : 5MB");
        return;
      }

      // Vérifier le type de fichier
      if (!file.type.startsWith("image/")) {
        setError("Veuillez sélectionner un fichier image");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setFormData({ ...formData, profilePic: base64String });
        setProfilePicPreview(base64String);
        setError("");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setFormData({ ...formData, profilePic: url });
    setProfilePicPreview(url || null);
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-accent">
        <p className="text-text-dark/60">Chargement...</p>
      </div>
    );
  }

  if (!session || !user) {
    return null;
  }

  const isAdmin = (session.user as any).role === "admin";
  const displayName =
    user.firstName && user.lastName
      ? `${user.firstName} ${user.lastName}`
      : user.firstName || user.email.split("@")[0];

  return (
    <div className="min-h-screen bg-accent py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-serif font-bold text-text-dark mb-2">
            Mon Profil
          </h1>
          <p className="text-text-dark/60">
            Gérez vos informations personnelles
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Colonne principale - Informations */}
          <div className="lg:col-span-2 space-y-6">
            {/* Carte Profil */}
            <div className="bg-white rounded-card shadow-lg p-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  {isEditing && profilePicPreview ? (
                    <img
                      src={profilePicPreview}
                      alt={displayName}
                      className="w-20 h-20 rounded-full object-cover border-4 border-accent"
                    />
                  ) : user.profilePic ? (
                    <img
                      src={user.profilePic}
                      alt={displayName}
                      className="w-20 h-20 rounded-full object-cover border-4 border-accent"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center text-white text-2xl font-bold border-4 border-accent">
                      {displayName.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <h2 className="text-2xl font-serif font-bold text-text-dark">
                      {displayName}
                    </h2>
                    <p className="text-text-dark/60">{user.email}</p>
                    {isAdmin && (
                      <span className="inline-block mt-2 px-3 py-1 bg-primary text-white rounded-full text-sm font-medium">
                        <Shield className="w-4 h-4 inline mr-1" />
                        Administrateur
                      </span>
                    )}
                  </div>
                </div>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-primary text-white rounded-button hover:bg-primary-light transition-colors flex items-center gap-2"
                  >
                    <Settings className="w-4 h-4" />
                    Modifier
                  </button>
                )}
              </div>

              {error && (
                <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-button">
                  {error}
                </div>
              )}

              {success && (
                <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-button">
                  {success}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-dark mb-2">
                    <Mail className="w-4 h-4 inline mr-2" />
                    Email
                  </label>
                  <input
                    type="email"
                    value={user.email}
                    disabled
                    className="w-full px-4 py-3 border border-gray rounded-button bg-gray/50 text-text-dark/60 cursor-not-allowed"
                  />
                  <p className="text-xs text-text-dark/60 mt-1">
                    L&apos;email ne peut pas être modifié
                  </p>
                </div>

                {isEditing && (
                  <div>
                    <label className="block text-sm font-medium text-text-dark mb-2">
                      <Camera className="w-4 h-4 inline mr-2" />
                      Photo de profil
                    </label>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs text-text-dark/60 mb-1">
                          Uploader une image (max 5MB)
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="w-full px-4 py-3 border border-gray rounded-button focus:outline-none focus:border-primary text-sm"
                        />
                      </div>
                      <div className="text-center text-text-dark/60 text-sm">
                        ou
                      </div>
                      <div>
                        <label className="block text-xs text-text-dark/60 mb-1">
                          Entrer une URL d&apos;image
                        </label>
                        <input
                          type="url"
                          value={formData.profilePic}
                          onChange={handleUrlChange}
                          placeholder="https://exemple.com/image.jpg"
                          className="w-full px-4 py-3 border border-gray rounded-button focus:outline-none focus:border-primary"
                        />
                      </div>
                      {profilePicPreview && (
                        <div className="mt-3">
                          <p className="text-xs text-text-dark/60 mb-2">
                            Aperçu :
                          </p>
                          <img
                            src={profilePicPreview}
                            alt="Aperçu"
                            className="w-24 h-24 rounded-full object-cover border-2 border-gray"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-dark mb-2">
                      Prénom
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            firstName: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 border border-gray rounded-button focus:outline-none focus:border-primary"
                      />
                    ) : (
                      <p className="px-4 py-3 bg-accent rounded-button text-text-dark">
                        {user.firstName || "Non renseigné"}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-dark mb-2">
                      Nom
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) =>
                          setFormData({ ...formData, lastName: e.target.value })
                        }
                        className="w-full px-4 py-3 border border-gray rounded-button focus:outline-none focus:border-primary"
                      />
                    ) : (
                      <p className="px-4 py-3 bg-accent rounded-button text-text-dark">
                        {user.lastName || "Non renseigné"}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-dark mb-2">
                    Téléphone
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      placeholder="+33 6 12 34 56 78"
                      className="w-full px-4 py-3 border border-gray rounded-button focus:outline-none focus:border-primary"
                    />
                  ) : (
                    <p className="px-4 py-3 bg-accent rounded-button text-text-dark">
                      {user.phone || "Non renseigné"}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-dark mb-2">
                    Date de naissance
                  </label>
                  {isEditing ? (
                    <input
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          dateOfBirth: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 border border-gray rounded-button focus:outline-none focus:border-primary"
                    />
                  ) : (
                    <p className="px-4 py-3 bg-accent rounded-button text-text-dark">
                      {user.dateOfBirth
                        ? format(new Date(user.dateOfBirth), "d MMMM yyyy", {
                            locale: fr,
                          })
                        : "Non renseigné"}
                    </p>
                  )}
                </div>

                {isEditing && (
                  <div className="flex gap-4 pt-4">
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="flex-1 px-6 py-3 bg-primary text-white rounded-button hover:bg-primary-light transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      {saving ? "Enregistrement..." : "Enregistrer"}
                    </button>
                    <button
                      onClick={handleCancel}
                      className="px-6 py-3 bg-gray text-text-dark rounded-button hover:bg-gray/80 transition-colors flex items-center gap-2"
                    >
                      <X className="w-4 h-4" />
                      Annuler
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Historique des réservations - Admin uniquement */}
            {isAdmin && (
              <div className="bg-white rounded-card shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-serif font-bold text-text-dark flex items-center gap-2">
                    <Calendar className="w-6 h-6 text-primary" />
                    Mes Réservations
                  </h3>
                  <span className="text-text-dark/60">
                    {bookings.length} réservation
                    {bookings.length > 1 ? "s" : ""}
                  </span>
                </div>

                {bookings.length === 0 ? (
                  <div className="text-center py-12">
                    <Calendar className="w-16 h-16 text-text-dark/20 mx-auto mb-4" />
                    <p className="text-text-dark/60 mb-4">
                      Aucune réservation pour le moment
                    </p>
                    <Link
                      href="/#agenda"
                      className="inline-block px-6 py-3 bg-primary text-white rounded-button hover:bg-primary-light transition-colors"
                    >
                      Voir l&apos;agenda
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {bookings.map((booking) => (
                      <div
                        key={booking.id}
                        className="border border-gray rounded-card p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold text-lg text-text-dark mb-2">
                              {booking.class.title}
                            </h4>
                            <div className="space-y-1 text-sm text-text-dark/60">
                              <p>
                                <Calendar className="w-4 h-4 inline mr-1" />
                                {format(
                                  new Date(booking.class.date),
                                  "EEEE d MMMM yyyy",
                                  { locale: fr }
                                )}
                              </p>
                              <p>
                                {format(
                                  new Date(booking.class.startTime),
                                  "HH:mm"
                                )}{" "}
                                -{" "}
                                {format(
                                  new Date(booking.class.endTime),
                                  "HH:mm"
                                )}
                              </p>
                              <p>Professeur: {booking.class.instructor}</p>
                              <p className="text-xs text-text-dark/40">
                                Réservé le{" "}
                                {format(
                                  new Date(booking.bookedAt),
                                  "d MMM yyyy à HH:mm",
                                  { locale: fr }
                                )}
                              </p>
                            </div>
                          </div>
                          <span
                            className="px-3 py-1 rounded-full text-sm font-medium text-white"
                            style={{
                              backgroundColor: "#264E36",
                            }}
                          >
                            {booking.class.type}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Colonne latérale */}
          <div className="space-y-6">
            {/* Informations de compte */}
            <div className="bg-white rounded-card shadow-lg p-6">
              <h3 className="text-xl font-serif font-bold text-text-dark mb-4">
                Informations de compte
              </h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-text-dark/60">Membre depuis</p>
                  <p className="font-semibold text-text-dark">
                    {format(new Date(user.createdAt), "MMMM yyyy", {
                      locale: fr,
                    })}
                  </p>
                </div>
                {user.lastLogin && (
                  <div>
                    <p className="text-text-dark/60">Dernière connexion</p>
                    <p className="font-semibold text-text-dark">
                      {format(new Date(user.lastLogin), "d MMM yyyy à HH:mm", {
                        locale: fr,
                      })}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-text-dark/60">
                    Méthode d&apos;authentification
                  </p>
                  <p className="font-semibold text-text-dark capitalize">
                    {user.role === "admin" ? "Admin" : "Utilisateur"}
                  </p>
                </div>
              </div>
            </div>

            {/* Actions rapides - Admin uniquement */}
            {isAdmin && (
              <div className="bg-white rounded-card shadow-lg p-6">
                <h3 className="text-xl font-serif font-bold text-text-dark mb-4">
                  Actions rapides
                </h3>
                <div className="space-y-2">
                  <Link
                    href="/#agenda"
                    className="block w-full px-4 py-3 bg-accent hover:bg-accent/80 rounded-button text-text-dark transition-colors text-center"
                  >
                    Voir l&apos;agenda
                  </Link>
                  <Link
                    href="/#actualites"
                    className="block w-full px-4 py-3 bg-accent hover:bg-accent/80 rounded-button text-text-dark transition-colors text-center"
                  >
                    Voir les actualités
                  </Link>
                  <Link
                    href="/admin"
                    className="block w-full px-4 py-3 bg-primary text-white hover:bg-primary-light rounded-button transition-colors text-center"
                  >
                    <Shield className="w-4 h-4 inline mr-2" />
                    Panel Admin
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
