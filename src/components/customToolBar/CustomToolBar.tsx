import { useState } from "react";
import { Box, Button, ButtonGroup, Typography } from "@mui/material";
import clsx from "clsx";
import { navigate } from "../../constants";
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

const { rbcBtnGroup, button } = styles;

const ViewNamesGroup = ({ view, onView, name }: ViewNamesGroup) => {

    return (
        <Button
            type="button"
            id={name === view ? "button" : ""}
            onClick={() => onView(view)}
            className={button}
        >
            {view}
        </Button>
    )
}

const CustomToolbar = ({
    label,
    localizer: messages,
    onNavigate,
    onView,
    views,
    view
}: CustomToolbarProps) => {
    const [todayButtonId, setTodayButtonId] = useState('active-btn');

    const handleOnClick = (path: string) => {
        onNavigate(path);
        
        if(path !== navigate.TODAY) {
            setTodayButtonId('');
        }
    }

    return (
        <Box className="rbc-toolbar">
            <ButtonGroup className={clsx("rbc-btn-group", "examples--custom-toolbar")}>
                <Button
                    onClick={() => handleOnClick(navigate.PREVIOUS)}
                    aria-label={messages.previous}
                    className={button}
                >
                    Previous 
                </Button>
                <Button
                    id={todayButtonId}
                    onClick={() => handleOnClick(navigate.TODAY)}
                    aria-label={messages.today}
                    className={button}
                >
                    Today
                </Button>
                <Button
                    onClick={() => handleOnClick(navigate.NEXT)}
                    aria-label={messages.next}
                    className={button}
                >
                    Next
                </Button>
            </ButtonGroup>
            <Box className={rbcBtnGroup}>
                {views.map(item => <ViewNamesGroup key={item} name={view} view={item} onView={onView} />)}
            </Box>
            <Typography className="rbc-toolbar-label">{label}</Typography>
        </Box>
    )
}

export default CustomToolbar