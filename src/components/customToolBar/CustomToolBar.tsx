import clsx from 'clsx'
import { navigate } from '../../constants'
import styles from "./customToolBar.module.css";

interface Message {
    previous: string;
    today: string;
    next: string;
}

interface ViewNamesGroup {
    onView: (name: string) => void;
    view: string;
    name: string;
}

interface CustomToolbarProps {
    date: Date;
    label: string;
    localizer: Message;
    messages: Message;
    onNavigate: (arg: string) => void;
    onView: () => void;
    views: string[];
    view: string;
}

const { rbcBtnGroup } = styles;

const ViewNamesGroup = ({ view, onView, name }: ViewNamesGroup) => {

    return (
        <button
            type="button"
            id={name === view ? 'button' : ''}
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
    view
}: CustomToolbarProps) {

    const currentDate = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    return (
        <div className="rbc-toolbar">
            <span className={clsx('rbc-btn-group', 'examples--custom-toolbar')}>
                <button
                    type="button"
                    onClick={() => onNavigate(navigate.PREVIOUS)}
                    aria-label={messages.previous}
                >
                    {view === 'week' ? 'Previuos' : "Yesterday"}
                </button>
                <button
                    type="button"
                    id={label.includes(currentDate) ? 'active-btn' : ''}
                    onClick={() => onNavigate(navigate.TODAY)}
                    aria-label={messages.today}
                >
                    { view === 'week' ? 'This week' : "Today"}
                </button>
                <button
                    type="button"
                    onClick={() => onNavigate(navigate.NEXT)}
                    aria-label={messages.next}
                >
                    {view === 'week' ? 'Next' : "Tomorrow"}
                </button>
            </span>
            <span className={rbcBtnGroup}>
                {views.map(item => <ViewNamesGroup key={item} name={view} view={item} onView={onView} />)}
            </span>
            <span className="rbc-toolbar-label">{label}</span>
        </div>
    )
}