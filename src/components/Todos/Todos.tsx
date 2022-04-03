import { useEffect, useRef, useState } from "react";
import localstorage from "../../hooks/localstorage";
import "./Todos.css";

interface Todo {
  id: number;
  text: string;
  done: boolean;
  dueDate: string;
}

const Todos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [warning, setWarning] = useState(false);
  const newTodoRef = useRef<HTMLInputElement>(null);
  const dueDateRef = useRef<HTMLInputElement>(null);

  const { addToLS, removeFromLS, getTodos, markAsCompleted } = localstorage();

  useEffect(() => {
    setTodos(getTodos());
  }, []);

  const handleAddTodo = () => {
    if (!dueDateRef.current) {
      setWarning(true);
      return;
    }
    if (newTodoRef.current && dueDateRef.current) {
      const newTodo: Todo = {
        id: Date.now(),
        text: newTodoRef.current.value,
        done: false,
        dueDate: dueDateRef.current.value,
      };
      setTodos([...todos, newTodo]);
      addToLS(newTodo);

      newTodoRef.current.value = "";
      setWarning(false);
    }
  };

  const handleRemove = (id: number) => {
    const proceed: boolean = window.confirm("Are you sure, want to Remove?");

    if (proceed) {
      const remaining: Todo[] = todos.filter((todo) => id !== todo.id);
      setTodos(remaining);
      removeFromLS(id);
    }
  };

  const handleComplete = (id: number) => {
    markAsCompleted(id);
    setTodos(getTodos());
  };

  return (
    <div className="container m-5 p-2 rounded mx-auto bg-light shadow">
      <div className="row m-1 p-4">
        <div className="col">
          <div className="p-1 h1 text-primary text-center mx-auto display-inline-block">
            <i className="fa fa-check bg-primary text-white rounded p-2"></i>
            <u>My Todo-s</u>
          </div>
        </div>
      </div>

      <div className="row m-1 p-3">
        <div className="col col-11 mx-auto">
          <div className="row bg-white rounded shadow-sm p-2 add-todo-wrapper align-items-center justify-content-center">
            <div className="col">
              <input
                className="form-control form-control-lg border-0 add-todo-input bg-transparent rounded"
                type="text"
                placeholder="Add new .."
                ref={newTodoRef}
              />
            </div>
            <div className="col-auto m-0 px-2 d-flex align-items-center calendar-icon">
              <label className="text-secondary my-2 p-0 px-1 view-opt-label due-date-label d-none">
                Due date not set
              </label>

              <i
                className="fa fa-calendar my-2 px-1 text-primary btn due-date-button custom-class"
                data-toggle="tooltip"
                data-placement="bottom"
                title="Set a Due date"
                onClick={() => setCalendarVisible(!calendarVisible)}
              ></i>

              <i
                className="fa fa-calendar-times-o my-2 px-1 text-danger btn clear-due-date-button d-none"
                data-toggle="tooltip"
                data-placement="bottom"
                title="Clear Due date"
              ></i>

              {calendarVisible && (
                <div className="due-date">
                  <input
                    type="date"
                    ref={dueDateRef}
                    className="form-control due-date-input"
                    required
                  />
                </div>
              )}
            </div>
            <div className="col-auto px-0 mx-0 mr-2">
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleAddTodo}
              >
                Add
              </button>
            </div>
          </div>
          {warning && (
            <span className="text-danger mt-2 d-block">
              Please add a due date by clicking on the Calendar icon jsut before
              the Add button
            </span>
          )}
        </div>
      </div>
      <div className="p-2 mx-4 border-black-25 border-bottom"></div>

      <div className="row mx-1 px-5 pb-3 w-80">
        <div className="col mx-auto">
          {/* todo item */}

          {todos.map((todo) => (
            <div
              key={todo.id}
              className="row px-3 align-items-center todo-item rounded"
            >
              <div className="col-auto m-1 p-0 d-flex align-items-center">
                <h2 className="m-0 p-0">
                  {/* <i
                    className="fa fa-square-o text-primary btn m-0 p-0"
                    data-toggle="tooltip"
                    data-placement="bottom"
                    title="Mark as complete"
                  ></i>
                  <i
                    className="fa fa-check-square-o text-primary btn m-0 p-0"
                    data-toggle="tooltip"
                    data-placement="bottom"
                    title="Mark as todo"
                  ></i> */}

                  {todo.done ? (
                    <i
                      className="fa fa-check-square-o text-primary btn m-0 p-0"
                      data-toggle="tooltip"
                      data-placement="bottom"
                      title="Mark as todo"
                      style={{ fontSize: "30px" }}
                    ></i>
                  ) : (
                    <i
                      className="fa fa-square-o text-primary btn m-0 p-0"
                      data-toggle="tooltip"
                      data-placement="bottom"
                      title="Mark as complete"
                      onClick={() => handleComplete(todo.id)}
                      style={{ fontSize: "30px" }}
                    ></i>
                  )}
                </h2>
              </div>
              <div className="col px-1 m-1 d-flex align-items-center">
                <input
                  type="text"
                  className="form-control form-control-lg border-0 edit-todo-input bg-transparent rounded px-3"
                  readOnly
                  value={todo.text}
                  title={todo.text}
                />
                <input
                  type="text"
                  className="form-control form-control-lg border-0 edit-todo-input rounded px-3 d-none"
                  value={todo.text}
                  readOnly
                />
              </div>

              {/* ============================================= */}
              {!todo.done && (
                <div className="col-auto m-1 p-0 px-3">
                  <div className="row">
                    <div className="col-auto d-flex align-items-center rounded bg-white border border-warning">
                      <i
                        className="fa fa-hourglass-2 my-2 px-2 text-warning btn"
                        data-toggle="tooltip"
                        data-placement="bottom"
                        title=""
                        data-original-title="Due on date"
                      ></i>
                      <h6 className="text my-2 pr-2">{todo.dueDate}</h6>
                    </div>
                  </div>
                </div>
              )}

              {/* ============================================== */}

              <div className="col-auto m-1 p-0 px-3 d-none"></div>
              <div className="col-auto m-1 p-0 todo-actions">
                <div className="row d-flex align-items-center justify-content-end">
                  <h5 className="m-0 p-0 px-2">
                    <i
                      className="fa fa-pencil text-info btn m-0 p-0"
                      data-toggle="tooltip"
                      data-placement="bottom"
                      title="Edit todo"
                    ></i>
                  </h5>
                  <h5 className="m-0 p-0 px-2">
                    <i
                      className="fa fa-trash-o text-danger btn m-0 p-0"
                      data-toggle="tooltip"
                      data-placement="bottom"
                      title="Delete todo"
                      onClick={() => handleRemove(todo.id)}
                    ></i>
                  </h5>
                </div>
                <div className="row todo-created-info">
                  <div className="col-auto d-flex align-items-center pr-2">
                    <i
                      className="fa fa-info-circle my-2 px-2 text-black-50 btn"
                      data-toggle="tooltip"
                      data-placement="bottom"
                      title=""
                      data-original-title="Created date"
                    ></i>
                    <label className="date-label my-2 text-black-50">
                      {todo.dueDate}
                    </label>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* =============================================================================== */}
    </div>
  );
};

export default Todos;

/* 

 {!todo.done && (
                    <button onClick={() => handleComplete(todo.id)}>
                      Mark as Completed
                    </button>
                  )}

*/
