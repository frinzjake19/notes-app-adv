"use client";

import { useState, useEffect } from "react";
import NoteForm from "../components/NoteForm";
import NoteItem from "../components/NoteItem";

const STORAGE_KEY = "notes-app:v1";
const TONE_COUNT = 5;

export default function Home() {
  const [notes, setNotes] = useState([]);
  const [loaded, setLoaded] = useState(false);

  // Load saved notes once, after the first render in the browser
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setNotes(JSON.parse(saved));
    } catch (error) {
      console.error("Could not read saved notes:", error);
    }
    setLoaded(true);
  }, []);

  // Save notes every time they change (but only after the first load)
  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    } catch (error) {
      console.error("Could not save notes:", error);
    }
  }, [notes, loaded]);

  // 1. Add
  function addNote({ title, description }) {
    const newNote = {
      id: Date.now().toString(),
      title,
      description,
      tone: notes.length % TONE_COUNT,
      createdAt: new Date().toISOString(),
    };
    setNotes((prev) => [newNote, ...prev]);
  }

  // 4. Update
  function updateNote(id, { title, description }) {
    setNotes((prev) =>
      prev.map((note) =>
        note.id === id ? { ...note, title, description } : note
      )
    );
  }

  // 3. Delete
  function deleteNote(id) {
    setNotes((prev) => prev.filter((note) => note.id !== id));
  }

  return (
    <main className="page">
      <header className="masthead">
        <h1>Notes</h1>
        <p className="count">
          {notes.length === 0
            ? "Nothing saved yet"
            : `${notes.length} ${notes.length === 1 ? "note" : "notes"} saved`}
        </p>
      </header>

      <div className="layout">
        <aside className="composer">
          <h2>New note</h2>
          <NoteForm notes={notes} onSubmit={addNote} submitLabel="Add note" />
        </aside>

        {/* 2. View all notes */}
        <section className="notes" aria-label="All notes">
          {loaded && notes.length === 0 ? (
            <div className="empty">
              <p className="empty-title">No notes yet</p>
              <p>Write a title and a description, then choose Add note.</p>
            </div>
          ) : (
            <ul className="grid">
              {notes.map((note) => (
                <NoteItem
                  key={note.id}
                  note={note}
                  notes={notes}
                  onUpdate={updateNote}
                  onDelete={deleteNote}
                />
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}
