import { useState } from "react"
import { usePopper } from "react-popper"
import useClickAwayListener from "../utilities/hooks/useClickAwayListener"
import "../page/css/todo.css"
import CustomBurgerIcon from "./CustomBurgerIcon"

export interface ITodoItem {
  id: string
  title: string
  completed: boolean
}

export interface ITodoListItemProps {
  todoItem: ITodoItem
  handleEditTodo: (todoItem: ITodoItem) => void
  handleDeleteTodo: (id: string) => void
}

const TodoListItem = (props: ITodoListItemProps): JSX.Element => {
  const { todoItem, handleEditTodo, handleDeleteTodo } = props
  const { completed, id, title } = todoItem

  const [editMode, setEditMode] = useState<boolean>(false)
  const [deleteMode, setDeleteMode] = useState<boolean>(false)
  const [editText, setEditText] = useState<string>(title)
  const [referenceElement, setReferenceElement] =
    useState<HTMLDivElement | null>(null)

  // looking back i probably could've used an input inside a div/button
  // then make the input invisible but covers the whole div
  // so i can make use of select from input
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(
    null
  )
  const [openPopper, setOpenPopper] = useState<boolean>(false)
  const [arrowElement, setArrowElement] = useState<HTMLDivElement | null>(null)
  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    modifiers: [{ name: "arrow", options: { element: arrowElement } }]
  })

  useClickAwayListener([referenceElement, popperElement] as Element[], () => {
    setOpenPopper(false)
    setDeleteMode(false)
  })

  return (
    <div
      style={{
        width: "100%",
        height: "46px",
        borderRadius: "9999px",
        backgroundColor: "lightgrey",
        color: "black",
        margin: "20px 0px",
        padding: "0px 20px",
        display: "flex",
        justifyContent: "space-between", // had to use this for alignment
        alignItems: "center"
      }}
    >
      {editMode ? (
        <>
          <input
            type="text"
            value={editText}
            style={{
              border: "none",
              color: editText !== title ? "red" : "black",
              outline: "none", // probably pretty bad for accessibility
              backgroundColor: "lightgrey"
            }}
            onChange={(e) => setEditText(e.target.value)}
          />
          <button
            style={{
              width: "64px",
              height: "36px",
              borderRadius: "999px",
              border: "none",
              backgroundColor: "#585292",
              color: "white"
            }}
            onClick={() => {
              handleEditTodo({ id, completed, title: editText })
              setEditMode(false)
            }}
          >
            Save
          </button>
        </>
      ) : (
        <>
          <input
            type="checkbox"
            checked={completed}
            readOnly
            onClick={() => handleEditTodo({ id, completed: !completed, title })}
            style={{
              width: "22px",
              height: "22px",
              borderRadius: "6px",
              border: "2px",
              backgroundColor: "#585292",
              color: "#585292",
              display: "inline"
            }}
          />
          <div style={{ fontSize: "16px" }}>
            {completed ? <s style={{ color: "#A9A9A9" }}>{title}</s> : title}
          </div>
          <div
            style={{
              textAlign: "center",
              backgroundColor: "lightgrey",
              color: "black",
              width: "24px",
              height: "24px",
              display: "flex",
              alignItems: "center"
            }}
            ref={setReferenceElement}
            onClick={() => setOpenPopper(!openPopper)}
          >
            <CustomBurgerIcon />
          </div>
        </>
      )}

      {openPopper ? (
        <div
          ref={setPopperElement}
          style={styles.popper}
          {...attributes.popper}
        >
          {deleteMode ? (
            <div className="todo-popper-box delete-confirm">
              <div
                className="header"
                style={{
                  color: "black"
                }}
              >
                Are you sure?
              </div>
              <div
                className="confirm"
                style={{
                  color: "black"
                }}
                onClick={() => {
                  handleDeleteTodo(id)
                  setOpenPopper(false)
                }}
              >
                Yes
              </div>
              <div
                className="cancel"
                style={{
                  color: "red"
                }}
                onClick={() => {
                  setDeleteMode(false)
                }}
              >
                Cancel
              </div>
            </div>
          ) : (
            <div className="todo-options">
              <div
                style={{
                  color: "black"
                }}
                onClick={() => {
                  setOpenPopper(false)
                  setEditMode(true)
                }}
              >
                Edit
              </div>
              <div
                className=""
                style={{
                  color: "red"
                }}
                onClick={() => {
                  setDeleteMode(true)
                }}
              >
                Delete
              </div>
            </div>
          )}
          <div ref={setArrowElement} style={styles.arrow} />
        </div>
      ) : null}
    </div>
  )
}

export default TodoListItem
