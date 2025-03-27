import React, { useState, useEffect } from 'react';
import { PlusCircle, Trash2, Edit, Save, X, Sun, Moon } from 'lucide-react';

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

function App() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  });

  useEffect(() => {
    const savedNotes = localStorage.getItem('notes');
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    if (editingId) {
      setNotes(notes.map(note =>
        note.id === editingId ? { ...note, title, content } : note
      ));
      setEditingId(null);
    } else {
      const newNote: Note = {
        id: crypto.randomUUID(),
        title,
        content,
        createdAt: new Date().toISOString(),
      };
      setNotes([newNote, ...notes]);
    }
    setTitle('');
    setContent('');
  };

  const handleEdit = (note: Note) => {
    setTitle(note.title);
    setContent(note.content);
    setEditingId(note.id);
  };

  const handleDelete = (id: string) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  const handleCancel = () => {
    setTitle('');
    setContent('');
    setEditingId(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-[#131314] text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Notes App</h1>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2 rounded-full ${darkMode ? 'bg-[#131314]' : 'bg-gray-50 '}`}
          >
            {darkMode ? <Sun size={30} className='bg-[#131314]'/> : <Moon size={30} className='bg-white'/>}
          </button>
        </div>

        <form onSubmit={handleSubmit} className={`border ${darkMode ? 'bg-[#202020] text-white border-black' : 'bg-[#f6f6f6] border-gray-300 text-gray-900'} rounded-lg p-6 mb-8`}>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && e.preventDefault() || e.key === 'Enter' && (document.getElementById('content') as HTMLTextAreaElement)?.focus()}
            placeholder="Note Title"
            className={`w-full mb-4 px-4 py-2 border ${darkMode ? 'bg-[#131314] text-white border-black' : 'bg-gray-50 border-gray-300 text-gray-900'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Note Content"
            rows={4}
            className={`w-full mb-4 px-4 py-2 border ${darkMode ? 'bg-[#131314] text-white border-black' : 'bg-gray-50 border-gray-300 text-gray-900'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          <div className="flex justify-end gap-2">
            {editingId && (
              <button
                type="button"
                onClick={handleCancel}
                className="flex items-center gap-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-white rounded-md hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                <X size={18} />Cancel
              </button>
            )}
            <button
              type="submit"
              className="flex items-center gap-1 px-4 py-2 bg-[#171616] text-white rounded-md hover:bg-black"
            >
              {editingId ? <Save size={18} /> : <PlusCircle size={18} />} {editingId ? 'Save Note' : 'Add Note'}
            </button>
          </div>
        </form>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {notes.map(note => (
            <div key={note.id} className={`${darkMode ? 'bg-[#202020] text-white border-black' : 'bg-gray-50 border-gray-300 text-gray-900'} rounded-lg shadow-md p-6`}>
              <h3 className="text-xl font-semibold mb-2">{note.title}</h3>
              <p className="mb-4 whitespace-pre-wrap">{note.content}</p>
              <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                <span>{new Date(note.createdAt).toLocaleDateString()}</span>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(note)} className="p-1 hover:text-blue-600">
                    <Edit size={18} />
                  </button>
                  <button onClick={() => handleDelete(note.id)} className="p-1 hover:text-red-600">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
