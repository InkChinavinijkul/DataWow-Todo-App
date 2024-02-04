import { useEffect, useMemo, useState } from "react"
import TodoListItem, { ITodoItem } from "../component/TodoListItem"
import ProgressBar from "../component/ProgressBar"
import Filter, { FilterOption } from "../component/Filter"
import "./css/todo.css"
import { checkFilter } from "../utilities/utilities"

const PORT = 3001

const Todo = () => {
  const [todoList, setTodoList] = useState<ITodoItem[]>([])
  const [newTodo, setNewTodo] = useState<string>("")
  const [filterOption, setFilterOption] = useState<FilterOption>("all")

  // fetch data on load
  useEffect(() => {
    fetch(`http://localhost:${PORT}/todos`)
      .then((response) => response.json())
      .then((data) => setTodoList(data))
      .catch((error) => console.error("Error:", error))
  }, [])

  const handleAddTodoKeyboardInput = (
    e: React.KeyboardEvent<Element>,
    newTitle: string
  ) => {
    if (e.key === "Enter") {
      addNewTodo(newTitle)
    }
  }

  const addNewTodo = (newTitle: string) => {
    const newData = { title: newTitle, completed: false }
    fetch(`http://localhost:3001/todos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newData)
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok")
        }
        // empty field if response is ok
        setNewTodo("")
        return response.json()
      })
      .then((data) => {
        setTodoList((prevData) => [...prevData, data])
      })
      .catch((error) => console.error("Error updating data:", error))
  }

  const handleEditTodo = ({ id, completed, title }: ITodoItem) => {
    const newData: ITodoItem = {
      id,
      completed,
      title
    }
    fetch(`http://localhost:3001/todos/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newData)
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok")
        }
        return response.json()
      })
      .then(() => {
        setTodoList((prevData) =>
          prevData.map((item) =>
            item.id === id ? { ...item, ...newData } : item
          )
        )
      })
      .catch((error) => console.error("Error updating data:", error))
  }

  const handleDeleteTodo = (id: string) => {
    fetch(`http://localhost:3001/todos/${id}`, {
      method: "DELETE"
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok")
        }
      })
      .then(() => {
        setTodoList((prevData) => prevData.filter((item) => item.id !== id))
      })
      .catch((error) => console.error("Error updating data:", error))
  }

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value as FilterOption
    setFilterOption(selectedValue)
  }

  // memoized completed todos
  const totalCompleted = useMemo(() => {
    let count = 0
    for (const item of todoList) {
      if (item.completed) count++
    }
    return count
  }, [todoList])

  // decided to filter the list here so we don't need another
  // state managing a filtered version of the list
  const filteredTodoList = useMemo(() => {
    return todoList.reduce((acc: JSX.Element[], listItem: ITodoItem) => {
      if (!checkFilter(filterOption, listItem.completed)) {
        return acc
      }

      return [
        ...acc,
        <TodoListItem
          todoItem={listItem}
          handleEditTodo={handleEditTodo}
          handleDeleteTodo={handleDeleteTodo}
          key={listItem.id}
        />
      ]
    }, [])
  }, [filterOption, todoList])

  return (
    <div style={{ width: "500px" }}>
      <ProgressBar
        progress={totalCompleted}
        total={todoList.length}
      ></ProgressBar>
      <div
        style={{
          display: "flex",
          flexGrow: 1,
          marginTop: "20px",
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >
        <div style={{ fontSize: "24px" }}>Tasks</div>
        <Filter
          selectedOption={filterOption}
          handleSelectChange={handleSelectChange}
        />
      </div>
      {filteredTodoList && filteredTodoList.length > 0 ? (
        filteredTodoList
      ) : (
        <div>No Items Found...</div>
      )}
      <div
        className="add-todo"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <input
          type="text"
          placeholder="Add your todo..."
          value={newTodo}
          onKeyDown={(e) =>
            handleAddTodoKeyboardInput(
              e as React.KeyboardEvent<Element>,
              newTodo
            )
          }
          onChange={(e) => setNewTodo(e.target.value)}
          style={{
            width: "100%",
            height: "46px",
            border: "none",
            borderRadius: "9999px"
          }}
        />
        <button
          style={{
            borderRadius: "50px",
            backgroundColor: "#21A2E5",
            padding: "0 20px",
            height: "46px",
            color: "black",
            border: "none",
            justifySelf: "flex-end"
          }}
          onClick={() => addNewTodo(newTodo)}
        >
          Add
        </button>
      </div>
    </div>
  )
}

export default Todo
