"use client";

import { useState, useEffect } from "react";

/**
 * Used for both adding a new note and editing an existing one.
 * - `note` is only passed when editing.
 * - useEffect checks whether another note already has the same title.
 */
export default function NoteForm({
  notes,
  note,
  onSubmit,
  onCancel,
  submitLabel = "Save note",
}) {
  const [title, setTitle] = useState(note?.title ?? "");
  const [description, setDescription] = useState(note?.description ?? "");
  const [isDuplicate, setIsDuplicate] = useState(false);

  const isEditing = Boolean(note);

  // Bonus: check if the note already exists (same title, ignoring case/spaces)
  useEffect(() => {
    const typed = title.trim().toLowerCase();
    const exists =
      typed !== "" &&
      notes.some(
        (n) => n.id !== note?.id && n.title.trim().toLowerCase() === typed
      );
    setIsDuplicate(exists);
  }, [title, notes, note]);

  const canSubmit = title.trim() && description.trim() && !isDuplicate;

  function handleSubmit(event) {
    event.preventDefault();
    if (!canSubmit) return;

    onSubmit({ title: title.trim(), description: description.trim() });

    if (!isEditing) {
      setTitle("");
      setDescription("");
    }
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <label className="field">
        <span>Title</span>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Groceries for Saturday"
          maxLength={60}
          aria-invalid={isDuplicate}
          autoFocus={isEditing}
        />
      </label>

      {isDuplicate && (
        <p className="warning" role="alert">
          A note with this title already exists. Choose a different title.
        </p>
      )}

      <label className="field">
        <span>Description</span>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Rice, eggs, onions, and coffee"
          rows={isEditing ? 4 : 6}
        />
      </label>

      <div className="actions">
        <button type="submit" className="btn primary" disabled={!canSubmit}>
          {submitLabel}
        </button>
        {isEditing && (
          <button type="button" className="btn ghost" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
