import { useEffect, useState } from "react";
import { playClick } from "../utils/sound";

export default function Tasks({ isFocus, activeSession }) {
  const focusActive = isFocus ?? activeSession;

  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : [];
  });

  const [input, setInput] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [collapsed, setCollapsed] = useState(false);
  const [activeId, setActiveId] = useState(null);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  function addTask() {
    if (!input.trim()) return;

    playClick();

    const task = {
      id: crypto.randomUUID(),
      title: input.trim(),
      completed: false
    };

    setTasks(prev => [...prev, task]);
    if (!activeId) setActiveId(task.id);
    setInput("");
  }

  function toggleTask(id) {
    setTasks(tasks =>
      tasks.map(t =>
        t.id === id ? { ...t, completed: !t.completed } : t
      )
    );
  }

  function deleteTask(id) {
    setTasks(tasks => tasks.filter(t => t.id !== id));
    if (activeId === id) setActiveId(null);
  }

  function moveTask(index, dir) {
    const copy = [...tasks];
    const target = index + dir;
    if (target < 0 || target >= tasks.length) return;
    [copy[index], copy[target]] = [copy[target], copy[index]];
    setTasks(copy);
  }

  function startEdit(task) {
    setEditingId(task.id);
    setEditValue(task.title);
  }

  function saveEdit(id) {
    setTasks(tasks =>
      tasks.map(t =>
        t.id === id ? { ...t, title: editValue } : t
      )
    );
    setEditingId(null);
    setEditValue("");
  }

  return (
    <div
      className="
        w-[320px]
        rounded-2xl
        backdrop-blur-xl
        bg-white/8
        border border-white/15
        shadow-[0_10px_40px_rgba(0,0,0,0.35)]
        font-light
        tracking-wide
        overflow-hidden
      "
    >
      {/* HEADER */}
      <div className="flex items-center justify-between px-4 py-3">
        <h3
          className="
            text-xs uppercase tracking-widest
            font-semibold
            text-[var(--task-text)]
          "
        >
          Tasks
        </h3>

        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          className="opacity-60 hover:opacity-100 transition"
        >
          <svg
            className={`
              w-4 h-4
              transition-transform duration-300
              ${collapsed ? "-rotate-90" : "rotate-0"}
            `}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
      </div>

      {/* BODY */}
      {!collapsed && (
        <>
          {/* TASK LIST */}
          <div className="max-h-[280px] overflow-y-auto overflow-x-hidden px-2 text-sm">
            {tasks.map((task, i) => {
              const isActive =
                focusActive &&
                task.id === activeId &&
                !task.completed;

              return (
                <div
                  key={task.id}
                  onClick={() => setActiveId(task.id)}
                  className={`
                    group flex items-start gap-2
                    px-2 py-1.5
                    rounded-lg
                    cursor-pointer
                    transition-all
                    ${
                      isActive
                        ? "bg-white/12 shadow-[0_0_18px_rgba(120,140,255,0.45)]"
                        : "hover:bg-white/5"
                    }
                  `}
                >
                  {editingId === task.id ? (
                    <input
                      value={editValue}
                      onChange={e => setEditValue(e.target.value)}
                      onBlur={() => saveEdit(task.id)}
                      onKeyDown={e =>
                        e.key === "Enter" && saveEdit(task.id)
                      }
                      autoFocus
                      className="
                        flex-1 min-w-0
                        bg-transparent outline-none
                        break-all whitespace-pre-wrap
                        text-[var(--task-text)]
                        font-medium
                      "
                    />
                  ) : (
                    <span
                      onClick={e => {
                        e.stopPropagation();
                        toggleTask(task.id);
                      }}
                      className={`
                        flex-1 min-w-0
                        break-all whitespace-pre-wrap
                        leading-relaxed
                        text-[var(--task-text)]
                        ${
                          task.completed
                            ? "line-through opacity-40"
                            : ""
                        }
                      `}
                    >
                      {task.title}
                    </span>
                  )}

                  <div
                    onClick={e => e.stopPropagation()}
                    className="
                      flex items-center gap-1
                      opacity-0 group-hover:opacity-100
                      transition
                      shrink-0
                    "
                  >
                    <button type="button" onClick={() => moveTask(i, -1)}>▲</button>
                    <button type="button" onClick={() => moveTask(i, 1)}>▼</button>
                    <button type="button" onClick={() => startEdit(task)}>✎</button>
                    <button
                      type="button"
                      onClick={() => deleteTask(task.id)}
                      className="hover:text-red-400"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* INPUT */}
          <div
            className="px-3 py-3 flex gap-2"
            onClick={e => e.stopPropagation()}
          >
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && addTask()}
              placeholder="Add a task…"
              className="
                flex-1 px-4 py-2 rounded-full text-sm
                bg-white/10 border border-white/15
                backdrop-blur-md outline-none
                focus:bg-white/15
                text-[var(--task-text)]
                font-medium
                placeholder:text-black/40
              "
            />
            <button
              type="button"
              onClick={addTask}
              className="glass-btn w-9 h-9 rounded-full font-semibold"
            >
              +
            </button>
          </div>
        </>
      )}
    </div>
  );
}
