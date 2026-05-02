import type { FilterView } from '../types';

interface Props {
  filter: FilterView;
  setFilter: (f: FilterView) => void;
  categoryFilter: string;
  setCategoryFilter: (c: string) => void;
  search: string;
  setSearch: (s: string) => void;
  categories: string[];
  counts: { all: number; active: number; completed: number };
  onClearCompleted: () => void;
}

export function FilterBar({
  filter, setFilter, categoryFilter, setCategoryFilter,
  search, setSearch, categories, counts, onClearCompleted,
}: Props) {
  return (
    <div className="filter-bar">
      <input
        className="search-input"
        placeholder="검색..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      <div className="filter-tabs">
        {(['all', 'active', 'completed'] as FilterView[]).map(f => (
          <button
            key={f}
            className={`filter-tab ${filter === f ? 'active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f === 'all' ? `전체 ${counts.all}` : f === 'active' ? `진행중 ${counts.active}` : `완료 ${counts.completed}`}
          </button>
        ))}
      </div>

      {categories.length > 0 && (
        <div className="category-filter">
          <button
            className={`cat-btn ${categoryFilter === '' ? 'active' : ''}`}
            onClick={() => setCategoryFilter('')}
          >
            전체
          </button>
          {categories.map(c => (
            <button
              key={c}
              className={`cat-btn ${categoryFilter === c ? 'active' : ''}`}
              onClick={() => setCategoryFilter(c)}
            >
              {c}
            </button>
          ))}
        </div>
      )}

      {counts.completed > 0 && (
        <button className="btn-clear" onClick={onClearCompleted}>
          완료 항목 삭제
        </button>
      )}
    </div>
  );
}
