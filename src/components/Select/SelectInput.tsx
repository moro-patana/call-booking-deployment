import React from "react";
import { MenuItem, Select } from "@mui/material";
import styled from "styled-components";
import { RoomType } from "../../utils/types";

const SelectInput = ({
  data,
  value,
  note,
  handleChange,
  defaultValue
}: {
  data: RoomType[] | { name: string; id: string }[];
  value: string;
  note: string;
  handleChange: any;
  defaultValue?: any
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
