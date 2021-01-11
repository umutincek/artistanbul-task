import './App.css';
import React, { useRef, useState, useEffect } from 'react';

function App() {

  const title = useRef(null);
  const date = useRef(null);
  const editedTitle = useRef(null);
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const [todos, setTodos] = useState(
    localStorage.getItem('todos') ?
      JSON.parse(localStorage.getItem('todos')) : []
  );
  const [dates, setDates] = useState([]);
  const [editedId, setEditedId] = useState(null);
  const [showPop, setShowPop] = useState(false);

  useEffect(() => {
    todos.map(todo => {
      if(dates.findIndex(d => d.date === todo.date) === -1) {
        setDates([...dates, {date: todo.date}]);
      }
    });
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos, dates]);

  useEffect(() => {
    if(editedId !== null) {
      let index = todos.findIndex(todo => todo.id === editedId);
      editedTitle.current.value = todos[index].title;
    }
  }, [editedId]);

  const handleSubmit = () => {
    setTodos([...todos, {id: todos.length + 1, title: title.current.value, date: date.current.value, completed: false,}]);
    togglePopup();
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(todo => (todo.id === id) ? {...todo, completed: !todo.completed} : todo));
  };

  const updateTodo = () => {
    setTodos(todos.map(todo => (todo.id === editedId) ? {...todo, title: editedTitle.current.value} : todo));
    setEditedId(null);
    editedTitle.current.value = null;
  };

  const formatDate = (date) => {
    let day = date.substr(date.length - 2);
    let month = date.substr(5,2);
    let year = date.substr(0,4);
    
    month = month.substr(0,1) === 0 ? month.substr(1,1) : month;

    return `${day} ${months[month-1]} ${year}`; 
  };

  const togglePopup = () => {
    setShowPop(!showPop);
  };

  return (
    <div className="App">
      <div className="header">
        <div className="header_title">
          <h1>To do</h1>
        </div>
        <div className="header_btn">
          <button onClick={togglePopup}>Add New Task</button>
        </div>
      </div>
      {
        showPop &&
          <div className="modal">
            <div className="modal_content">
              <span>Title</span>
              <input ref={title} type="text" />
            </div>
            <div className="modal_content">
              <span>Date</span>
              <input ref={date} type="date" />
            </div>
            <div className="modal_button">
              <button onClick={togglePopup}>CANCEL</button>
              <button onClick={handleSubmit}>SAVE</button>
            </div>
          </div>
      }
        {dates.map(d => {
          return(
            <div>
            {
              todos.find(t => t.date === d.date) &&
                <h2 key={d}><i className="far fa-calendar"></i> {formatDate(d.date)} </h2>
            }
            <table>
              {todos.map(todo => {
                return(
                  todo.date === d.date &&
                  <tr key={todo.id}>
                    <td onClick={() => toggleTodo(todo.id)}>
                      {
                        todo.completed && 
                          <span className={todo.completed ? 'completed' : 'no-completed'}>
                            <i className="fa fa-check"></i>
                          </span>
                      }
                    </td>
                    <td className={todo.completed ? 'completed' : null}>
                      {
                        editedId !== todo.id ?
                          <span> {todo.title} </span> :
                          <input type="text" ref={editedTitle} />
                      }
                    </td>
                    <td>
                      {
                        editedId !== todo.id ?
                          <i className="far fa-edit" onClick={() => setEditedId(todo.id)}></i> :
                          <i className="fa fa-check" onClick={updateTodo}></i>
                      }
                    </td>
                    <td>
                      <i className="far fa-trash-alt" onClick={() => setTodos(todos.filter(t => t.title !== todo.title))}></i>
                    </td>
                  </tr>
                )
              })}
            </table>
            </div>
          )
        })}
    </div>
  );
}

export default App;
