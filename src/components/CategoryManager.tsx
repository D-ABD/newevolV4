import React, { useState } from 'react';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import type { Category } from '../types';

interface CategoryManagerProps {
  categories: Category[];
  onAddCategory: (category: Omit<Category, 'id'>) => void;
  onEditCategory: (id: string, category: Partial<Category>) => void;
  onDeleteCategory: (id: string) => void;
}

export function CategoryManager({ categories, onAddCategory, onEditCategory, onDeleteCategory }: CategoryManagerProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: '', icon: 'circle', color: 'gray' });
  
  const colors = ['gray', 'red', 'yellow', 'green', 'blue', 'purple', 'pink'];
  const icons = ['circle', 'star', 'heart', 'smile', 'sun', 'moon', 'cloud'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddCategory({ ...newCategory, custom: true });
    setNewCategory({ name: '', icon: 'circle', color: 'gray' });
    setIsAdding(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Catégories</h3>
        <button
          onClick={() => setIsAdding(true)}
          className="bg-purple-600 text-white p-2 rounded-full hover:bg-purple-700"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="mb-4 p-4 border rounded-lg">
          <div className="flex justify-between mb-2">
            <h4 className="font-medium">Nouvelle catégorie</h4>
            <button type="button" onClick={() => setIsAdding(false)}>
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <input
            type="text"
            value={newCategory.name}
            onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
            placeholder="Nom de la catégorie"
            className="w-full p-2 border rounded mb-2"
            required
          />
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Couleur</label>
              <div className="flex gap-2">
                {colors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setNewCategory({ ...newCategory, color })}
                    className={`w-6 h-6 rounded-full bg-${color}-500 ${
                      newCategory.color === color ? 'ring-2 ring-offset-2 ring-purple-600' : ''
                    }`}
                  />
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Icône</label>
              <select
                value={newCategory.icon}
                onChange={(e) => setNewCategory({ ...newCategory, icon: e.target.value })}
                className="w-full p-2 border rounded"
              >
                {icons.map((icon) => (
                  <option key={icon} value={icon}>
                    {icon}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <button
            type="submit"
            className="mt-4 w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700"
          >
            Ajouter la catégorie
          </button>
        </form>
      )}

      <div className="space-y-2">
        {categories.map((category) => (
          <div
            key={category.id}
            className="flex items-center justify-between p-3 border rounded hover:bg-gray-50"
          >
            <div className="flex items-center space-x-3">
              <div className={`w-8 h-8 rounded-full bg-${category.color}-500 flex items-center justify-center text-white`}>
                <span className="text-lg">{category.icon}</span>
              </div>
              <span className="font-medium">{category.name}</span>
            </div>
            
            {category.custom && (
              <div className="flex space-x-2">
                <button
                  onClick={() => onEditCategory(category.id, { name: 'Nouveau nom' })}
                  className="p-1 text-gray-500 hover:text-gray-700"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDeleteCategory(category.id)}
                  className="p-1 text-gray-500 hover:text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}