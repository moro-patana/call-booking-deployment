import React, { FC, ReactNode } from "react";
import { MenuItem, Select, SelectChangeEvent } from "@mui/material";
import styled from "styled-components";
import { RoomType } from "../../utils/types";

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
  return (
    <InputWrapper>
      <Select value={value} onChange={handleChange} sx={{ width: "100%" }} defaultValue={defaultValue}>
        {data?.map((item) => (
          <MenuItem key={item?.id} value={item?.id === defaultValue ? defaultValue : item?.id}>
            {item?.name}
          </MenuItem>
        ))}
      </Select>
      <small>{note}</small>
    </InputWrapper>
  );
};

const InputWrapper = styled("div")`
  width: 100%;
  margin-bottom: 16px;
  small {
    display: block;
    margin-top: 6px;
  }
  svg {
    display: none;
  }
`;
export default SelectInput;
