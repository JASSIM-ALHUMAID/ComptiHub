import { FileDown, Search } from 'lucide-react'
import Button from '../../../components/ui/Button'
import Input from '../../../components/ui/Input'
import Select from '../../../components/ui/Select'

export default function CompetitionFilters({
  categoryFilter,
  search,
  statusFilter,
  onCategoryFilterChange,
  onSearchChange,
  onStatusFilterChange,
}) {
  return (
    <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
      <div className="space-y-2">
        <p className="app-ui-text text-[0.68rem] text-[rgba(250,204,21,0.78)]">Registry controls</p>
        <h2 className="app-title text-2xl text-[var(--admin-text)]">Manage competitions</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-[minmax(0,280px)_190px_190px_auto]">
        <label className="space-y-2">
          <span className="app-ui-text text-[0.62rem] text-[rgba(209,198,171,0.7)]">Search</span>
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[rgba(209,198,171,0.52)]" />
            <Input
              className="pl-11"
              placeholder="Search title, ID, organizer..."
              value={search}
              onChange={onSearchChange}
            />
          </div>
        </label>

        <label className="space-y-2">
          <span className="app-ui-text text-[0.62rem] text-[rgba(209,198,171,0.7)]">Status filter</span>
          <Select value={statusFilter} onChange={onStatusFilterChange}>
            <option value="all">All statuses</option>
            <option value="draft">Draft</option>
            <option value="upcoming">Upcoming</option>
            <option value="active">Active</option>
            <option value="open">Open</option>
            <option value="ended">Ended</option>
            <option value="closed">Closed</option>
          </Select>
        </label>

        <label className="space-y-2">
          <span className="app-ui-text text-[0.62rem] text-[rgba(209,198,171,0.7)]">Category</span>
          <Select value={categoryFilter} onChange={onCategoryFilterChange}>
            <option value="all">All categories</option>
            <option value="AI / ML">AI / ML</option>
            <option value="Business">Business</option>
            <option value="Competitive Programming">Competitive Programming</option>
            <option value="Data Science">Data Science</option>
            <option value="Design">Design</option>
            <option value="Hackathon">Hackathon</option>
            <option value="Robotics">Robotics</option>
            <option value="Security">Security</option>
            <option value="Systems">Systems</option>
          </Select>
        </label>

        <Button className="self-end justify-center xl:min-w-44" size="nav" variant="secondary">
          <FileDown className="mr-2 h-4 w-4" />
          Export
        </Button>
      </div>
    </div>
  )
}
