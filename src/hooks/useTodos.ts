import { useState, useCallback } from 'react';
import type { Todo, Priority, FilterView } from '../types';
import { loadTodos, saveTodos } from '../store';

function uuid(): string {
  return crypto.randomUUID();
}

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>(loadTodos);
  const [filter, setFilter] = useState<FilterView>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [search, setSearch] = useState('');

  const persist = useCallback((next: Todo[]) => {
    setTodos(next);
    saveTodos(next);
  }, []);

  const add = useCallback((title: string, priority: Priority, category: string, dueDate?: string) => {
    const todo: Todo = {
      id: uuid(),
      title: title.trim(),
      completed: false,
      priority,
      category: category.trim() || '일반',
      dueDate,
      createdAt: new Date().toISOString(),
    };
    persist([todo, ...todos]);
  }, [todos, persist]);

  const toggle = useCallback((id: string) => {
    persist(todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  }, [todos, persist]);

  const remove = useCallback((id: string) => {
    persist(todos.filter(t => t.id !== id));
  }, [todos, persist]);

  const edit = useCallback((id: string, updates: Partial<Pick<Todo, 'title' | 'priority' | 'category' | 'dueDate'>>) => {
    persist(todos.map(t => t.id === id ? { ...t, ...updates } : t));
  }, [todos, persist]);

  const clearCompleted = useCallback(() => {
    persist(todos.filter(t => !t.completed));
  }, [todos, persist]);

  const categories = [...new Set(todos.map(t => t.category))].filter(Boolean);

  const visible = todos.filter(t => {
    if (filter === 'active' && t.completed) return false;
    if (filter === 'completed' && !t.completed) return false;
    if (categoryFilter && t.category !== categoryFilter) return false;
    if (search && !t.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return {
    todos,
    visible,
    filter,
    setFilter,
    categoryFilter,
    setCategoryFilter,
    search,
    setSearch,
    categories,
    add,
    toggle,
    remove,
    edit,
    clearCompleted,
    counts: {
      all: todos.length,
      active: todos.filter(t => !t.completed).length,
      completed: todos.filter(t => t.completed).length,
    },
  };
}
