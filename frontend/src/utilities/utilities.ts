import { FilterOption } from "../component/Filter"

export const checkFilter = (filterOption: FilterOption, completed: boolean) => {
  switch (filterOption) {
    case "all":
      return true
    case "done":
      return completed
    case "undone":
      return !completed
  }
}
