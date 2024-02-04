export type FilterOption = "all" | "done" | "undone"

interface IFilterProps {
  selectedOption: FilterOption
  handleSelectChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
}

const Filter = (props: IFilterProps) => {
  const { handleSelectChange, selectedOption } = props
  return (
    <select value={selectedOption} onChange={handleSelectChange}>
      <option value="all">All</option>
      <option value="done">Done</option>
      <option value="undone">Undone</option>
    </select>
  )
}

export default Filter
