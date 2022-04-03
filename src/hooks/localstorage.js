const localstorage = () => {
  const getFromLS = () => {
    return localStorage.getItem("todos");
  };

  // Save to local storage
  const addToLS = (data) => {
    let existingData;
    if (getFromLS() !== null) {
      existingData = JSON.parse(getFromLS());
      existingData.push(data);
      localStorage.setItem("todos", JSON.stringify(existingData));
    } else {
      const newStringifiedData = JSON.stringify([data]);
      localStorage.setItem("todos", newStringifiedData);
    }
  };

  const removeFromLS = (id) => {
    const existingTodos = JSON.parse(getFromLS());
    const remainingTodos = existingTodos.filter((todo) => todo.id !== id);
    localStorage.setItem("todos", JSON.stringify(remainingTodos));
  };

  // const getFromLS = () => {
  //   JSON.parse( localStorage.getItem("todos"))
  // }

  const getTodos = () => {
    if (getFromLS() !== null) {
      return JSON.parse(getFromLS());
    } else {
      return [];
    }
  };

  const markAsCompleted = (id) => {
    const existingTodos = getTodos();
    const index = existingTodos.findIndex((todo) => todo.id === id);
    existingTodos[index].done = true;
    localStorage.setItem("todos", JSON.stringify(existingTodos));
    // console.log(index)
  };

  return {
    addToLS,
    removeFromLS,
    getTodos,
    markAsCompleted
  };
};

export default localstorage;
