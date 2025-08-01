import { StoreSetting } from '@/types/store-setting.interface';
import SettingRow from './SettingRow';

interface Props {
  settings: StoreSetting[];
  storeId: string;
  onUpdate: () => void;
}

export default function SettingsTable({ settings, storeId, onUpdate }: Props) {
  return (
    <div className="overflow-x-auto rounded shadow border">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="p-3">Key</th>
            <th className="p-3">Value</th>
            {/* <th className="p-3">Type</th> */}
            <th className="p-3">Editable</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {settings.map((setting) => (
            <SettingRow key={setting.id} setting={setting} storeId={storeId} onUpdate={onUpdate} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
