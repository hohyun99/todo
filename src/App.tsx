import { useTodos } from './hooks/useTodos';
import { TodoInput } from './components/TodoInput';
import { TodoItem } from './components/TodoItem';
import { FilterBar } from './components/FilterBar';
import './App.css';

export default function App() {
  const {
    visible, filter, setFilter,
    categoryFilter, setCategoryFilter,
    search, setSearch,
    categories, counts,
    add, toggle, remove, edit, clearCompleted,
  } = useTodos();

  return (
    <div className="app">
      <header className="app-header">
        <h1>TODO</h1>
        <p className="subtitle">오늘도 하나씩</p>
      </header>

      <main className="app-main">
        <TodoInput onAdd={add} categories={categories} />

        <FilterBar
          filter={filter}
          setFilter={setFilter}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
          search={search}
          setSearch={setSearch}
          categories={categories}
          counts={counts}
          onClearCompleted={clearCompleted}
        />

        <div className="todo-list">
          {visible.length === 0 ? (
            <div className="empty-state">
              {search
                ? '검색 결과가 없습니다'
                : filter === 'completed'
                  ? '완료된 항목이 없습니다'
                  : '할 일을 추가해보세요 ✓'}
            </div>
          ) : (
            visible.map(todo => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={toggle}
                onRemove={remove}
                onEdit={edit}
              />
            ))
          )}
        </div>
      </main>
    </div>
  );
}
