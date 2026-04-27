import { Clock3, FileJson, Search } from 'lucide-react'
import Button from '../../../components/ui/Button'
import Input from '../../../components/ui/Input'

export default function SuggestionsControls({ search, onSearchChange }) {
  return (
    <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
      <div className="space-y-2">
        <p className="admin-ui-text text-[0.68rem] text-[rgba(250,204,21,0.78)]">Queue controls</p>
        <h2 className="admin-title text-2xl text-[var(--admin-text)]">Pending approval</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-[minmax(0,320px)_auto_auto]">
        <label className="space-y-2">
          <span className="admin-ui-text text-[0.62rem] text-[rgba(209,198,171,0.7)]">Search queue</span>
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[rgba(209,198,171,0.52)]" />
            <Input
              className="pl-11"
              placeholder="Search title, student, ID..."
              value={search}
              onChange={onSearchChange}
            />
          </div>
        </label>

        <Button className="self-end justify-center md:min-w-40" size="nav" variant="secondary">
          <Clock3 className="mr-2 h-4 w-4" />
          View archive
        </Button>

        <Button className="self-end justify-center md:min-w-40" size="nav" variant="secondary">
          <FileJson className="mr-2 h-4 w-4" />
          Export JSON
        </Button>
      </div>
    </div>
  )
}
