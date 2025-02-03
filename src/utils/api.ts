import axios from "axios";

type HttpMethod = "get" | "post" | "put" | "delete";

export type boardFormData = {
  board_name: string;
  board_column: {
    column_name: string;
    id: string;
    board_id: string;
    pendingDeletion?: boolean;
  }[];
};

export type columnFormData = {
  column_name: string;
  id?: string;
  board_id: string;
};

export type taskFormData = {
  task_name: string;
  id: string;
  description: string;
  status: string;
  column_id: string;
  subtask: {
    subtask_name: string;
    id: string;
    is_completed: boolean;
    task_id: string;
  }[];
};

export type subtaskData = {
  subtask_name: string;
  id: string;
  is_completed: boolean;
  task_id: string;
};

export type boardColumn = {
  board_name: string;
  id: string;
  board_column: {
    column_name: string;
    id: string;
    board_id: string;
    task: {
      task_name: string;
      id: string;
      description: string;
      status: string;
      column_id: string;
      subtask: {
        subtask_name: string;
        id: string;
        is_completed: boolean;
        task_id: string;
      }[];
    }[];
  }[];
};

const apiUrl = {
  board: "http://localhost:5000/boards",
  column: "http://localhost:5000/columns",
  task: "http://localhost:5000/tasks",
  subtask: "http://localhost:5000/subtasks",
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

export const getTask = (columnId: string) =>
  handleRequest("task", "get", `?column_id=${columnId}`);
export const addTask = (data: taskFormData) =>
  handleRequest("task", "post", "", data);
export const updateTask = (id: string, data: taskFormData) =>
  handleRequest("task", "put", `/${id}`, data);
export const deleteTask = (id: string) =>
  handleRequest("task", "delete", `/${id}`);

export const getSubtask = (taskId: string) =>
  handleRequest("subtask", "get", `?task_id=${taskId}`);
export const addSubtask = (data: subtaskData) =>
  handleRequest("subtask", "post", "", data);
export const updateSubtask = (id: string, data: subtaskData) =>
  handleRequest("subtask", "put", `/${id}`, data);
export const deleteSubtask = (id: string) =>
  handleRequest("subtask", "delete", `/${id}`);
