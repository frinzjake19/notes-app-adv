"use client";

import { useState } from "react";
import NoteForm from "./NoteForm";

// Bonus: a separate component for a single note
export default function NoteItem({ note, notes, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const date = new Date(note.createdAt).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  if (isEditing) {
    return (
      <li className="note editing" data-tone={note.tone}>
        <NoteForm
          notes={notes}
          note={note}
          submitLabel="Save changes"
          onSubmit={(updated) => {
            onUpdate(note.id, updated);
            setIsEditing(false);
          }}
          onCancel={() => setIsEditing(false)}
        />
      </li>
    );
  }

  return (
    <li className="note" data-tone={note.tone}>
      <h3>{note.title}</h3>
      <p className="note-body">{note.description}</p>

      <div className="note-footer">
        <time dateTime={note.createdAt}>{date}</time>

        <div className="note-actions">
          {confirmingDelete ? (
            <>
              <button
                className="link danger"
                onClick={() => onDelete(note.id)}
              >
                Delete note
              </button>
              <button
                className="link"
                onClick={() => setConfirmingDelete(false)}
              >
                Keep
              </button>
            </>
          ) : (
            <>
              <button className="link" onClick={() => setIsEditing(true)}>
                Edit
              </button>
              <button
                className="link"
                onClick={() => setConfirmingDelete(true)}
              >
                Delete
              </button>
            </>
          )}
        </div>
      </div>
    </li>
  );
}
