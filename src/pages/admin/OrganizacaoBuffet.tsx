import { useEffect, useState } from 'react';
import { ArrowDown, ArrowUp, GripVertical } from 'lucide-react';
import { getConfiguredRestaurantId } from '@/services/api';
import { getBuffetOrganization, updateBuffetOrganization, type BuffetOrganizationItem } from '@/services/dishes/buffetOrganization.service';
import { resolveImageUrl } from '@/utils/resolveImageUrl';
import '@/styles/tokens.css';
import { PrimaryButton } from '@/components/PrimaryButton';
import { showError, showSuccess } from '@/components/ToastProvider';

const restaurantId = getConfiguredRestaurantId();

type BuffetCategory = 'ENTRADA' | 'PRATO_PRINCIPAL' | 'SOBREMESA';

type BuffetItem = {
  id: string;
  name: string;
  image: string;
  available: boolean;
  buffetPosition: number;
};

type BuffetGroup = {
  id: BuffetCategory;
  name: string;
  color: string;
  items: BuffetItem[];
};

const CATEGORY_ORDER: BuffetCategory[] = ['ENTRADA', 'PRATO_PRINCIPAL', 'SOBREMESA'];

const EMPTY_GROUPS: BuffetGroup[] = [
  {
    id: 'ENTRADA',
    name: 'Entradas',
    color: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    items: [],
  },
  {
    id: 'PRATO_PRINCIPAL',
    name: 'Pratos Principais',
    color: 'bg-orange-100 text-orange-800 border-orange-200',
    items: [],
  },
  {
    id: 'SOBREMESA',
    name: 'Sobremesas',
    color: 'bg-pink-100 text-pink-800 border-pink-200',
    items: [],
  },
];

const createEmptyGroups = (): BuffetGroup[] =>
  EMPTY_GROUPS.map(group => ({ ...group, items: [] }));

const recalculatePositions = (items: BuffetItem[]) =>
  items.map((item, index) => ({ ...item, buffetPosition: index + 1 }));

const isBuffetCategory = (category: string): category is BuffetCategory =>
  CATEGORY_ORDER.includes(category.trim() as BuffetCategory);

const toBuffetGroups = (items: BuffetOrganizationItem[]): BuffetGroup[] => {
  const groups = createEmptyGroups();

  items
    .filter(item => isBuffetCategory(item.category))
    .sort((a, b) => Number(a.buffetPosition) - Number(b.buffetPosition))
    .forEach(item => {
      const category = item.category.trim() as BuffetCategory;
      const group = groups.find(currentGroup => currentGroup.id === category);

      if (!group) {
        return;
      }

      group.items.push({
        id: item.id,
        name: item.name,
        image: item.imageUrl,
        available: true,
        buffetPosition: group.items.length + 1,
      });
    });

  return groups;
};

export function OrganizacaoBuffet() {
  const [groups, setGroups] = useState<BuffetGroup[]>(createEmptyGroups);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');

  useEffect(() => {
    if (!restaurantId) {
      setMessageType('error');
      setMessage('Restaurante não configurado.');
      setIsLoading(false);
      return;
    }

    getBuffetOrganization(restaurantId)
      .then(data => {
        setGroups(toBuffetGroups(data));
        setMessage('');
      })
      .catch(() => {
        setMessageType('error');
        setMessage('Não foi possível carregar a organização do buffet.');
      })
      .finally(() => setIsLoading(false));
  }, []);

  const moveDish = (groupId: BuffetCategory, fromIndex: number, direction: -1 | 1) => {
    setGroups(currentGroups =>
      currentGroups.map(group => {
        if (group.id !== groupId) {
          return group;
        }

        const toIndex = fromIndex + direction;

        if (toIndex < 0 || toIndex >= group.items.length) {
          return group;
        }

        const nextItems = [...group.items];
        [nextItems[fromIndex], nextItems[toIndex]] = [nextItems[toIndex], nextItems[fromIndex]];

        return { ...group, items: recalculatePositions(nextItems) };
      })
    );
  };

  const handleSave = async () => {
    if (!restaurantId) {
      setMessageType('error');
      setMessage('Restaurante não configurado.');
      return;
    }

    const items = CATEGORY_ORDER
      .flatMap(category => groups.find(group => group.id === category)?.items ?? [])
      .filter(item => item.available)
      .map((item, index) => ({
        dishId: item.id,
        buffetPosition: index + 1,
      }));

    setIsSaving(true);
    setMessage('');

    try {
      await updateBuffetOrganization(restaurantId, { items });
      setMessageType('success');
      showSuccess('Ordem do buffet atualizada com sucesso.');
    } catch {
      setMessageType('error');
      setMessage('Não foi possível salvar a ordem.');
      showError('Erro ao atualizar ordem do buffet.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto space-y-6">
          <header className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold serv-text-primary tracking-tight mb-1">Organização do Buffet</h1>
              <p className="text-sm serv-text-secondary">Use as setas para reorganizar a ordem de exibição no buffet</p>
            </div>
            <PrimaryButton
              text={isSaving ? 'Salvando...' : 'Salvar ordem'}
              disabled={isSaving || isLoading}
              loading={isSaving}
              onClick={handleSave}
              className="shadow-sm"
            />
          </header>

          {message && (
            <div className={`px-4 py-3 rounded-lg text-sm ${messageType === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
              {message}
            </div>
          )}

          <div className="space-y-6">
            {isLoading ? (
              <div className="bg-white rounded-xl shadow-sm border serv-border p-6 text-sm serv-text-secondary">
                Carregando organização do buffet...
              </div>
            ) : groups.map(group => (
              <div key={group.id} className="bg-white rounded-xl shadow-sm border serv-border overflow-hidden">
                <div className={`px-4 py-3 border-b border-gray-100 flex items-center gap-2 ${group.color.split(' ')[0]} bg-opacity-20`}>
                  <h2 className={`font-semibold text-sm ${group.color.split(' ')[1]}`}>{group.name}</h2>
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${group.color.split(' ')[2]} ${group.color.split(' ')[1]} bg-white bg-opacity-50`}>
                    {group.items.length} itens
                  </span>
                </div>

                <div className="divide-y divide-gray-100">
                  {group.items.map((item, iIdx) => (
                    <div
                      key={item.id}
                      className={`flex items-center gap-4 p-3 hover:bg-gray-50 transition-colors group ${!item.available ? 'opacity-50 grayscale' : ''}`}
                    >
                      <div className="text-gray-300" aria-hidden="true">
                        <GripVertical size={20} />
                      </div>

                      <div className="w-6 h-6 rounded-md bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500 border border-gray-200">
                        {item.buffetPosition}
                      </div>

                      <img src={resolveImageUrl(item.image)} alt={item.name} className="w-10 h-10 rounded shadow-sm object-cover border border-gray-200" />

                      <div className="flex-1">
                        <span className="font-medium text-sm text-gray-800">{item.name}</span>
                      </div>

                      <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity mr-2">
                        <button
                          type="button"
                          className="text-gray-400 hover:text-gray-700 disabled:text-gray-200 disabled:hover:text-gray-200 disabled:hover:bg-transparent disabled:cursor-not-allowed p-0.5 hover:bg-gray-200 rounded"
                          disabled={iIdx === 0}
                          aria-label={`Mover ${item.name} para cima`}
                          onClick={() => moveDish(group.id, iIdx, -1)}
                        >
                          <ArrowUp size={14} />
                        </button>
                        <button
                          type="button"
                          className="text-gray-400 hover:text-gray-700 disabled:text-gray-200 disabled:hover:text-gray-200 disabled:hover:bg-transparent disabled:cursor-not-allowed p-0.5 hover:bg-gray-200 rounded"
                          disabled={iIdx === group.items.length - 1}
                          aria-label={`Mover ${item.name} para baixo`}
                          onClick={() => moveDish(group.id, iIdx, 1)}
                        >
                          <ArrowDown size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
    </main>
  );
}
