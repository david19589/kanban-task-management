import axios from "axios";

type HttpMethod = "get" | "post" | "put" | "delete";

export type boardFormData = {
  board_name: string;
  board_column: { column_name: string; id: string }[];
};

export type columnFormData = {
  column_name: string;
  board_id: string;
};

export type boardColumn = {
  board_name: string;
  id: string;
  board_column: {
    column_name: string;
    id: string;
    board_id: string;
    task: {
      id: string;
      task_name: string;
      description: string;
      status: string;
      column_id: string;
    }[];
  }[];
};

const apiUrl = {
  board: "http://localhost:5000/board",
  column: "http://localhost:5000/columns",
};

const handleRequest = async <T>(
  resource: keyof typeof apiUrl,
  method: HttpMethod,
  endpoint = "",
  data?: T
) => {
  try {
    const response = await axios({
      method,
      url: `${apiUrl[resource]}${endpoint}`,
      data,
    });
    return response.data;
  } catch (err) {
    console.error(`Error with ${method.toUpperCase()} request:`, err);
    throw err;
  }
};

export const getBoard = () => handleRequest("board", "get");
export const addBoard = (data: boardFormData) =>
  handleRequest("board", "post", "", data);
export const updateBoard = (id: string, data: boardFormData) =>
  handleRequest("board", "put", `/${id}`, data);
export const deleteBoard = (id: string) =>
  handleRequest("board", "delete", `/${id}`);
export const getColumn = (boardId: string) =>
  handleRequest("column", "get", `?board_id=${boardId}`);
export const addColumn = (data: columnFormData) =>
  handleRequest("column", "post", "", data);
export const updateColumn = (id: string, data: columnFormData) =>
  handleRequest("column", "put", `/${id}`, data);
export const deleteColumn = (id: string) =>
  handleRequest("column", "delete", `/${id}`);
