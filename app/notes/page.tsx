"use client";

import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";

export default function Notes() {
  const [notes, setNotes] = useState<any[]>([]);

  const supabase = createClient();

  useEffect(() => {
    const fetchNotes = async () => {
      const { data, error } = await supabase.from("notes").select("*");
      if (error) {
        console.error("Error fetching notes:", error);
      } else {
        setNotes(data);
      }
    };
    fetchNotes();
  }, []);

  useEffect(() => {
    const channel = supabase
      .channel("custom-all-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "notes" },
        (payload) => {
          console.log("Change received!", payload);

          // 데이터가 업데이트될 때마다 상태 업데이트
          if (payload.eventType === "INSERT") {
            setNotes((prevNotes) => [...prevNotes, payload.new]);
          } else if (payload.eventType === "UPDATE") {
            setNotes((prevNotes) =>
              prevNotes.map((note) =>
                note.id === payload.new.id ? payload.new : note,
              ),
            );
          } else if (payload.eventType === "DELETE") {
            setNotes((prevNotes) =>
              prevNotes.filter((note) => note.id !== payload.old.id),
            );
          }
        },
      )
      .subscribe();

    // 컴포넌트가 언마운트될 때 구독 취소
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const createNote = async () => {
    const { data, error } = await supabase
      .from("notes")
      .insert([{ title: "Created Note" }]);
  };

  const updateNote = async () => {
    const { data, error } = await supabase
      .from("notes")
      .update({ title: "Updated Note" })
      .eq("id", notes[notes.length - 1].id);
  };

  const deleteNote = async () => {
    const { data, error } = await supabase
      .from("notes")
      .delete()
      .eq("id", notes[notes.length - 1].id);
  };

  // return <pre>{JSON.stringify(notes, null, 2)}</pre>;
  return (
    <div className="flex flex-col gap-4">
      <h1>CRUD 테스트</h1>

      <div className="flex flex-col gap-2">
        Note 목록
        <ul>{notes?.map((note) => <li key={note.id}>{note.title}</li>)}</ul>
      </div>

      <button onClick={createNote}>Create Note</button>
      <button onClick={updateNote}>Update Note</button>
      <button onClick={deleteNote}>Delete Note</button>
    </div>
  );
}
