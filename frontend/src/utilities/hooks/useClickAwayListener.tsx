import { useEffect } from "react"

// i made this for some other project a while ago
// where i "closely imitated" the code from someone else
// who made it

// array of refs so you can target more than 1 element (type)
// for example in an Autocomplete you'd need to detect any clicks outside
// BOTH the input element and the dropdown list (ul)
const useClickAwayListener = (refs: Element[] | null, callback: () => void) => {
  useEffect(() => {
    if (!refs) return
    const handleClickOutside = (event: MouseEvent) => {
      for (const ref of refs) {
        if (ref.contains(event.target as Node)) {
          return
        }
      }
      callback()
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      // clean up
      document.removeEventListener("mousedown", handleClickOutside)
    }

    // probably won't need a dep array since you check this all the time
  })
}

export default useClickAwayListener
