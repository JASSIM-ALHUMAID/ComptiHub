import { ChevronLeft, ChevronRight, Clock3, Download } from 'lucide-react'
import Button from '../../../components/ui/Button'

export default function SuggestionsPagination({ currentPage, onPreviousPage, onNextPage }) {
  return (
    <footer className="flex flex-col gap-6 border-t border-[rgba(77,70,50,0.18)] pt-6 md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-2">
        <button
          aria-label="Previous page"
          className="rounded-full border border-[rgba(77,70,50,0.22)] p-3 text-[rgba(209,198,171,0.74)] transition-colors duration-200 hover:border-[rgba(250,204,21,0.3)] hover:text-[var(--admin-gold-soft)]"
          type="button"
          onClick={onPreviousPage}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--admin-gold)] text-sm font-black text-[var(--admin-surface-low)]">
          {String(currentPage).padStart(2, '0')}
        </span>
        <button
          aria-label="Next page"
          className="rounded-full border border-[rgba(77,70,50,0.22)] p-3 text-[rgba(209,198,171,0.74)] transition-colors duration-200 hover:border-[rgba(250,204,21,0.3)] hover:text-[var(--admin-gold-soft)]"
          type="button"
          onClick={onNextPage}
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div className="flex flex-wrap gap-4">
        <Button className="justify-center md:min-w-44" size="nav" variant="secondary">
          <Clock3 className="mr-2 h-4 w-4" />
          View archive
        </Button>
        <Button className="justify-center md:min-w-44" size="nav" variant="secondary">
          <Download className="mr-2 h-4 w-4" />
          Export JSON
        </Button>
      </div>
    </footer>
  )
}
