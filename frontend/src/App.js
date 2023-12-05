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
      await fetchEvents();
    } catch (err) {
      console.error(err.message);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editDescription && editedEventId) {
        await axios.put(`${baseUrl}/event/${editedEventId}`, { description: editDescription });
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
      <nav>
        <span className="event-hub-text">PROJECT TRACKER</span>
      </nav>
      <section>
        <form onSubmit={handleSubmit} className="my-4">
          <div className="form-group">
            <label htmlFor='description'>Description</label>
            <input
              onChange={(e) => handleInputChange(e, 'description')}
              type='text'
              className="form-control"
              name='description'
              id='description'
              placeholder='Describe the Event'
              value={description}
            />
          </div>
          <button type='submit' className="btn btn-primary mt-2">Submit</button>
        </form>

      </section>

      <section>
        <table>
          <thead>
            <tr>
              <th>EVENTS</th>
              <th>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {eventsList.map(event => (
              <tr key={event.id}>
                {editedEventId === event.id ? (
                  <>
                    <td>
                      <input
                        onChange={(e) => handleInputChange(e, 'edit')}
                        type='text'
                        name='editDescription'
                        id='editDescription'
                        value={editDescription}
                      />
                    </td>
                    <td>
                      <button className="btn btn-primary" onClick={handleSubmit}>Update</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td colSpan="1">{event.description}</td>
                    <td colSpan="1">
                      <button className="btn btn-warning" onClick={() => toggleEdit(event)}>Edit</button>
                    </td>
                    <td colSpan="1">
                      <button className="btn btn-danger" onClick={() => handleDelete(event.id)}>X</button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

export default App;
