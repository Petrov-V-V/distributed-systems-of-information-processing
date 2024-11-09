import axios from "axios";

export const sendNote = (note) =>
  axios.post(
    "http://localhost:8000/notes/add",
    {
        title: note.title,
        text: note.text,
        body: note.body,
        json: note.json,
    }
  );

export const getAllNotes = async () =>{
  try {
    return (await axios.get('http://localhost:8000/notes/all')).data;
} catch (error) {
    console.error('Ошибка при получении заметок:', error);
    return [];
}}

export const deleteNote = (id) =>
  axios.delete(`http://localhost:8000/notes/remove/${id}`);

export const updateNote = (id, note) =>
  axios.patch(
    `http://localhost:8000/notes/update/${id}`,
    {
      title: note.title,
      text: note.text,
      body: note.body,
      json: note.json,
    }
  );