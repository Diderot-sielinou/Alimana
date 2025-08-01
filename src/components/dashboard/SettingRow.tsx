'use client';

import { useState } from 'react';
import { api } from '@/lib/api';
import { StoreSetting } from '@/types/store-setting.interface';
import { Pencil, Save, X } from 'lucide-react';

interface Props {
  setting: StoreSetting;
  storeId: string;
  onUpdate: () => void;
}

export default function SettingRow({ setting, storeId, onUpdate }: Props) {
  const [editMode, setEditMode] = useState(false);
  const [value, setValue] = useState(setting.value);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      await api.patch(`/store/${storeId}/settings/${setting.key}`, { value });
      setEditMode(false);
      onUpdate();
    } catch (err) {
      console.error('Update failed:', err);
      alert('Update failed. Check your input.');
    } finally {
      setLoading(false);
    }
  };

  const inputType = setting.type === 'BOOLEAN' ? 'checkbox' : 'text';

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="p-4 font-bold text-gray-900 whitespace-nowrap">
        {
          setting.key
            .replace(/[._]/g, ' ') // Replace all dots and underscores with spaces
            .replace(/\b\w/g, (char) => char.toUpperCase()) // Capitalize first letter of each word
        }
      </td>

      <td className="p-4">
        {editMode && setting.isEditable ? (
          setting.type === 'BOOLEAN' ? (
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={value === 'true'}
                onChange={(e) => setValue(e.target.checked.toString())}
                disabled={loading}
                className="sr-only peer"
              />
              <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          ) : (
            <input
              type={inputType}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100"
              disabled={loading}
            />
          )
        ) : (
          <span
            className={
              value === 'true' ? 'text-green-600' : value === 'false' ? 'text-red-600' : ''
            }
          >
            {value}
          </span>
        )}
      </td>
      {/*   
  <td className="p-4">
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
      {setting.type}
    </span>
  </td> */}

      <td className="p-4 text-center">
        {setting.isEditable ? (
          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-100 text-green-600">
            ✓
          </span>
        ) : (
          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-100 text-red-600">
            ✕
          </span>
        )}
      </td>

      <td className="p-4">
        {setting.isEditable && (
          <div className="flex items-center space-x-2">
            {editMode ? (
              <>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="p-1.5 text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setEditMode(false)}
                  disabled={loading}
                  className="p-1.5 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50"
                >
                  <X className="w-4 h-4" />
                </button>
              </>
            ) : (
              <button
                onClick={() => setEditMode(true)}
                className="p-1.5 text-indigo-600 bg-indigo-50 rounded-md hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                <Pencil className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </td>
    </tr>
  );
}
