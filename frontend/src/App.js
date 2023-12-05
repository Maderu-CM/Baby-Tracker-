import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

const baseUrl = "http://localhost:5000";

function App() {
  const [description, setDescription] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [eventsList, setEventsList] = useState([]);
  const [editedEventId, setEditedEventId] = useState(null);

  const fetchEvents = async () => {
    try {
      const data = await axios.get(`${baseUrl}/events`);
      setEventsList(data.data.events);
    } catch (error) {
      console.error("Error fetching events: ", error);
    }
  }

  const handleInputChange = (e, field) => {
    if (field === 'edit') {
      setEditDescription(e.target.value);
    } else {
      setDescription(e.target.value);
    }
  }

  const toggleEdit = (event) => {
    setEditedEventId(event.id);
    setEditDescription(event.description);
  }

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${baseUrl}/event/${id}`);
      const updatedList = eventsList.filter(event => event.id !== id);
      setEventsList(updatedList);
    } catch (err) {
      console.error(err.message);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editDescription && editedEventId) {
        await axios.put(`${baseUrl}/event/${editedEventId}`, { description: editDescription });
        // Fetch events again to update the events list with the latest changes
        await fetchEvents();
      } else {
        const data = await axios.post(`${baseUrl}/event`, { description });
        setEventsList([...eventsList, data.data]);
      }
      setDescription('');
      setEditDescription('');
      setEditedEventId(null);
    } catch (error) {
      console.error("Error creating/updating event: ", error);
    }
  }

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <div className="App">
      <section>
        <form onSubmit={handleSubmit}>
          <label htmlFor='description'>Description</label>
          <input
            onChange={(e) => handleInputChange(e, 'description')}
            type='text'
            name='description'
            id='description'
            placeholder='Describe the Event'
            value={description}
          />
          <button type='submit'>Submit</button>
        </form>
      </section>

      <section>
        <ul>
          {eventsList.map(event => (
            <React.Fragment key={event.id}>
              {editedEventId === event.id ? (
                <form onSubmit={handleSubmit}>
                  <input
                    onChange={(e) => handleInputChange(e, 'edit')}
                    type='text'
                    name='editDescription'
                    id='editDescription'
                    value={editDescription}
                  />
                  <button type='submit'>Update</button>
                </form>
              ) : (
                <li style={{ display: "flex" }} key={event.id}>
                  {event.description}
                  <button onClick={() => toggleEdit(event)}>Edit</button>
                  <button onClick={() => handleDelete(event.id)}>X</button>
                </li>
              )}
            </React.Fragment>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default App;
