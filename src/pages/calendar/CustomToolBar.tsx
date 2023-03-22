import clsx from 'clsx'
import { navigate } from '../../constants'
import styles from "./calendar.module.css";

export interface Message {
  previous: string;
  today: string;
  next: string;
}

interface ViewNamesGroup {
  onView: (name: string) => void;
  view: string;
}

export interface CustomToolbarProps {
  date: Date;
  label: string;
  localizer: Message;
  messages: Message;
  onNavigate: (arg: string) => void;
  onView: () => void;
  views: string[];
}

const { rbcBtnGroup } = styles;

const ViewNamesGroup = ({ view, onView }: ViewNamesGroup) => {
  return (
    <button
      type="button"
      id='button'
      onClick={() => onView(view)}
    >
      {view}
    </button>
  )
}

export default function CustomToolbar({
  label,
  localizer: messages,
  onNavigate,
  onView,
  views,
}: CustomToolbarProps) {
  return (
    <div className="rbc-toolbar">
      <span className={clsx('rbc-btn-group', 'examples--custom-toolbar')}>
        <button
          type="button"
          onClick={() => onNavigate(navigate.PREVIOUS)}
          aria-label={messages.previous}
        >
          Yesterday
        </button>
        <button
          type="button"
          onClick={() => onNavigate(navigate.TODAY)}
          aria-label={messages.today}
        >
          Today
        </button>
        <button
          type="button"
          onClick={() => onNavigate(navigate.NEXT)}
          aria-label={messages.next}
        >
          Tomorrow
        </button>
      </span>
      <span className={rbcBtnGroup}>
        {views.map(view => <ViewNamesGroup key={view} view={view} onView={onView} />)}
      </span>
      <span className="rbc-toolbar-label">{label}</span>
    </div>
  )
}
