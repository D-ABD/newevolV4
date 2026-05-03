import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Settings, Camera, Mail, Moon, Sun, Bell, Shield, LogOut } from 'lucide-react';
import type { User as UserType } from '../types';

interface UserProfileProps {
  user: UserType;
  onUpdateUser: (updates: Partial<UserType>) => void;
  onLogout: () => void;
}

export function UserProfile({ user, onUpdateUser, onLogout }: UserProfileProps) {
  const [activeSection, setActiveSection] = useState<'profile' | 'security' | 'preferences'>('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(user);

  const handleSaveProfile = () => {
    onUpdateUser(editedUser);
    setIsEditing(false);
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditedUser(prev => ({ ...prev, avatar: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-gradient-to-r from-purple-600 to-blue-500 p-6 text-white">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-white/20 overflow-hidden">
              {user.avatar ? (
                <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <User className="w-full h-full p-4" />
              )}
            </div>
            {isEditing && (
              <label className="absolute bottom-0 right-0 p-1 bg-white rounded-full cursor-pointer">
                <Camera className="w-4 h-4 text-gray-600" />
                <input type="file" className="hidden" onChange={handleAvatarUpload} accept="image/*" />
              </label>
            )}
          </div>
          <div>
            <h2 className="text-2xl font-bold">{user.username || 'Utilisateur'}</h2>
            <p className="text-white/80">Membre depuis {new Date(user.joinDate).toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      <div className="flex border-b">
        <button
          onClick={() => setActiveSection('profile')}
          className={`flex-1 py-3 px-4 text-center ${
            activeSection === 'profile' ? 'border-b-2 border-purple-500 text-purple-600' : 'text-gray-500'
          }`}
        >
          Profil
        </button>
        <button
          onClick={() => setActiveSection('security')}
          className={`flex-1 py-3 px-4 text-center ${
            activeSection === 'security' ? 'border-b-2 border-purple-500 text-purple-600' : 'text-gray-500'
          }`}
        >
          Sécurité
        </button>
        <button
          onClick={() => setActiveSection('preferences')}
          className={`flex-1 py-3 px-4 text-center ${
            activeSection === 'preferences' ? 'border-b-2 border-purple-500 text-purple-600' : 'text-gray-500'
          }`}
        >
          Préférences
        </button>
      </div>

      <div className="p-6">
        {activeSection === 'profile' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Informations personnelles</h3>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="text-purple-600 hover:text-purple-700"
              >
                <Settings className="w-5 h-5" />
              </button>
            </div>

            {isEditing ? (
              <>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nom d'utilisateur
                    </label>
                    <input
                      type="text"
                      value={editedUser.username}
                      onChange={(e) => setEditedUser(prev => ({ ...prev, username: e.target.value }))}
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={editedUser.email}
                      onChange={(e) => setEditedUser(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bio
                    </label>
                    <textarea
                      value={editedUser.bio}
                      onChange={(e) => setEditedUser(prev => ({ ...prev, bio: e.target.value }))}
                      className="w-full p-2 border rounded-md"
                      rows={3}
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 border rounded-md hover:bg-gray-50"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={handleSaveProfile}
                      className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                    >
                      Enregistrer
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <span>{user.email}</span>
                </div>
                {user.bio && (
                  <p className="text-gray-600">{user.bio}</p>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="text-sm text-purple-600">Niveau</div>
                    <div className="text-2xl font-bold">{user.level}</div>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="text-sm text-blue-600">Série actuelle</div>
                    <div className="text-2xl font-bold">{user.streakDays} jours</div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {activeSection === 'security' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-lg font-semibold mb-4">Sécurité du compte</h3>
              <div className="space-y-4">
                <button className="w-full flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center space-x-3">
                    <Shield className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="font-medium">Changer le mot de passe</div>
                      <div className="text-sm text-gray-500">Dernière modification il y a 3 mois</div>
                    </div>
                  </div>
                </button>
                <button className="w-full flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center space-x-3">
                    <Bell className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="font-medium">Notifications de sécurité</div>
                      <div className="text-sm text-gray-500">Gérer les alertes de connexion</div>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {activeSection === 'preferences' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-lg font-semibold mb-4">Préférences</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    {user.theme === 'light' ? (
                      <Sun className="w-5 h-5 text-gray-400" />
                    ) : (
                      <Moon className="w-5 h-5 text-gray-400" />
                    )}
                    <div>
                      <div className="font-medium">Thème</div>
                      <div className="text-sm text-gray-500">
                        {user.theme === 'light' ? 'Clair' : 'Sombre'}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => onUpdateUser({ theme: user.theme === 'light' ? 'dark' : 'light' })}
                    className="px-3 py-1 bg-gray-100 rounded-md hover:bg-gray-200"
                  >
                    Changer
                  </button>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Bell className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="font-medium">Notifications</div>
                      <div className="text-sm text-gray-500">
                        {user.notifications ? 'Activées' : 'Désactivées'}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => onUpdateUser({ notifications: !user.notifications })}
                    className="px-3 py-1 bg-gray-100 rounded-md hover:bg-gray-200"
                  >
                    {user.notifications ? 'Désactiver' : 'Activer'}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        <div className="mt-8 pt-6 border-t">
          <button
            onClick={onLogout}
            className="flex items-center space-x-2 text-red-600 hover:text-red-700"
          >
            <LogOut className="w-5 h-5" />
            <span>Se déconnecter</span>
          </button>
        </div>
      </div>
    </div>
  );
}