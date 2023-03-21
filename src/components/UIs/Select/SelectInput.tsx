import { FC, ReactNode } from "react";
import { Box, MenuItem, Select, SelectChangeEvent, Typography } from "@mui/material";
import styles from './selectInput.module.css';
import { RoomType } from "../../../utils/types";

interface SelectInputProps {
  data: RoomType[] | { name: string; id: string }[];
  value: string;
  note: string;
  handleChange: (event: SelectChangeEvent<string | null | undefined>, child: ReactNode) => void;
  defaultValue?: string | null;
}

const SelectInput: FC<SelectInputProps> = ({
  data,
  value,
  note,
  handleChange,
  defaultValue
}) => {
  const { wrapper, typography, select } = styles;

  return (
    <Box className={wrapper}>
      <Select value={value} onChange={handleChange} className={select} defaultValue={defaultValue}>
        {data?.map((item) => (
          <MenuItem key={item?.id} value={item?.id === defaultValue ? defaultValue : item?.id}>
            {item?.name}
          </MenuItem>
        ))}
      </Select>
      <Typography className={typography}>{note}</Typography>
    </Box>
  );
};

export default SelectInput;