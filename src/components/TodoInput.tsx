import { useState, useRef } from 'react';
import type { KeyboardEvent } from 'react';
import type { Priority } from '../types';

interface Props {
  onAdd: (title: string, priority: Priority, category: string, dueDate?: string) => void;
  categories: string[];
}

export function TodoInput({ onAdd, categories }: Props) {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [category, setCategory] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [expanded, setExpanded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const submit = () => {
    if (!title.trim()) return;
    onAdd(title, priority, category, dueDate || undefined);
    setTitle('');
    setPriority('medium');
    setCategory('');
    setDueDate('');
    setExpanded(false);
    inputRef.current?.focus();
  };

  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'Enter') submit();
    if (e.key === 'Escape') {
      setExpanded(false);
      setTitle('');
    }
  };

  return (
    <div className="input-card">
      <div className="input-row">
        <input
          ref={inputRef}
          className="title-input"
          placeholder="할 일 추가... (Enter로 저장)"
          value={title}
          onChange={e => setTitle(e.target.value)}
          onKeyDown={onKey}
          onFocus={() => setExpanded(true)}
          autoFocus
        />
        <button className="btn-add" onClick={submit} disabled={!title.trim()}>
          추가
        </button>
      </div>

      {expanded && (
        <div className="input-extra">
          <div className="input-group">
            <label>우선순위</label>
            <div className="priority-buttons">
              {(['high', 'medium', 'low'] as Priority[]).map(p => (
                <button
                  key={p}
                  className={`priority-btn priority-${p} ${priority === p ? 'active' : ''}`}
                  onClick={() => setPriority(p)}
                >
                  {p === 'high' ? '높음' : p === 'medium' ? '보통' : '낮음'}
                </button>
              ))}
            </div>
          </div>

          <div className="input-group">
            <label>카테고리</label>
            <input
              className="meta-input"
              list="categories"
              placeholder="카테고리 (예: 업무, 개인)"
              value={category}
              onChange={e => setCategory(e.target.value)}
            />
            <datalist id="categories">
              {categories.map(c => <option key={c} value={c} />)}
            </datalist>
          </div>

          <div className="input-group">
            <label>마감일</label>
            <input
              className="meta-input"
              type="date"
              value={dueDate}
              onChange={e => setDueDate(e.target.value)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
