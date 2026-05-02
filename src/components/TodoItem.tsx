import { useState, useRef, useEffect } from 'react';
import type { KeyboardEvent } from 'react';
import type { Todo } from '../types';

interface Props {
  todo: Todo;
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
  onEdit: (id: string, updates: Partial<Pick<Todo, 'title' | 'priority' | 'category' | 'dueDate'>>) => void;
}

function isOverdue(dueDate?: string): boolean {
  if (!dueDate) return false;
  return new Date(dueDate) < new Date(new Date().toDateString());
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

export function TodoItem({ todo, onToggle, onRemove, onEdit }: Props) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(todo.title);
  const editRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) editRef.current?.focus();
  }, [editing]);

  const commitEdit = () => {
    if (draft.trim()) onEdit(todo.id, { title: draft.trim() });
    setEditing(false);
  };

  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'Enter') commitEdit();
    if (e.key === 'Escape') { setDraft(todo.title); setEditing(false); }
  };

  const overdue = isOverdue(todo.dueDate) && !todo.completed;

  return (
    <div className={`todo-item priority-border-${todo.priority} ${todo.completed ? 'completed' : ''}`}>
      <button className="checkbox" onClick={() => onToggle(todo.id)} aria-label="완료 토글">
        {todo.completed ? '✓' : ''}
      </button>

      <div className="todo-body">
        {editing ? (
          <input
            ref={editRef}
            className="edit-input"
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onKeyDown={onKey}
            onBlur={commitEdit}
          />
        ) : (
          <span className="todo-title" onDoubleClick={() => { setDraft(todo.title); setEditing(true); }}>
            {todo.title}
          </span>
        )}

        <div className="todo-meta">
          <span className={`badge category`}>{todo.category}</span>
          <span className={`badge priority-badge-${todo.priority}`}>
            {todo.priority === 'high' ? '높음' : todo.priority === 'medium' ? '보통' : '낮음'}
          </span>
          {todo.dueDate && (
            <span className={`badge ${overdue ? 'overdue' : 'duedate'}`}>
              {overdue ? '⚠ ' : ''}{formatDate(todo.dueDate)}
            </span>
          )}
        </div>
      </div>

      <div className="todo-actions">
        <button className="btn-icon" onClick={() => { setDraft(todo.title); setEditing(true); }} title="편집">✏</button>
        <button className="btn-icon btn-delete" onClick={() => onRemove(todo.id)} title="삭제">✕</button>
      </div>
    </div>
  );
}
