import { useCallback, useEffect, useState } from "react";
import Header from "../header";
import Sidebar from "../sidebar";
import showSvg from "../../assets/icon-show-sidebar.svg";
import clsx from "clsx";
import Board from "../board";
import {
  boardColumn,
  getBoard,
  getColumn,
  getSubtask,
  getTask,
  taskFormData,
} from "../../utils/api";
import AddNewBoard from "../modal/add_board_modal";
import DeleteBoardModal from "../modal/delete_board_modal";
import EditBoardModal from "../modal/edit_board_modal";
import TaskDetailsModal from "../modal/task_details_modal";
import AddNewTask from "../modal/add_task_modal";
import DeleteTaskModal from "../modal/delete_task_modal";
import EditTaskModal from "../modal/edit_task_modal";

function Main() {
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("darkMode") === "true"
  );
  const [showSidebar, setShowSidebar] = useState(true);
  const [addBoardModalOpen, setAddBoardModalOpen] = useState(false);
  const [editBoardModalOpen, setEditBoardModalOpen] = useState(false);
  const [deleteBoardModalOpen, setDeleteBoardModalOpen] = useState(false);
  const [editTaskModalOpen, setEditTaskModalOpen] = useState(false);
  const [deleteTaskModalOpen, setDeleteTaskModalOpen] = useState(false);
  const [addTaskModalOpen, setAddTaskModalOpen] = useState(false);
  const [boards, setBoards] = useState<boardColumn[]>([]);
  const [selectedBoard, setSelectedBoard] = useState<boardColumn | null>(null);
  const [showTaskDetails, setShowTaskDetails] = useState(false);
  const [showStatuses, setShowStatuses] = useState(false);
  const [selectedTask, setSelectedTask] = useState<taskFormData | null>(null);

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode.toString());
  }, [darkMode]);

  const fetchBoards = useCallback(async () => {
    try {
      const board = await getBoard();
      setBoards(board);

      if (board.length > 0) {
        const currentBoard = selectedBoard
          ? board.find((b: { id: string }) => b.id === selectedBoard.id)
          : board[0];

        if (currentBoard) {
          const columns = await getColumn(currentBoard.id);

          for (const column of columns) {
            const allTasks = await getTask(column.id);
            for (const task of allTasks) {
              task.subtask = await getSubtask(task.id);
            }
            column.task = allTasks;
          }

          setSelectedBoard({ ...currentBoard, board_column: columns });
        }
      }
    } catch (err) {
      console.error("Failed to fetch boards:", err);
      setBoards([]);
    }
  }, [selectedBoard]);

  useEffect(() => {
    if (selectedBoard === null) {
      fetchBoards();
    }
  }, [fetchBoards, selectedBoard]);

  const handleBoardClick = async (boardId: string) => {
    const board = boards.find((item) => item.id === boardId) || null;

    if (board) {
      try {
        const columns = await getColumn(boardId);

        for (const column of columns) {
          const tasks = await getTask(column.id);

          for (const task of tasks) {
            task.subtask = await getSubtask(task.id);
          }

          column.task = tasks;
        }

        setSelectedBoard({ ...board, board_column: columns });
      } catch (err) {
        console.error("Failed to fetch columns:", err);
        setSelectedBoard({ ...board, board_column: [] });
      }
    } else {
      setSelectedBoard(null);
    }
  };

  return (
    <div
      className={clsx(
        darkMode ? "bg-[#20212C]" : "bg-[#F4F7FD]",
        "h-full transition-all duration-200"
      )}
    >
      <Header
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        setEditBoardModalOpen={setEditBoardModalOpen}
        boards={boards}
        setBoards={setBoards}
        setAddBoardModalOpen={setAddBoardModalOpen}
        setDeleteBoardModalOpen={setDeleteBoardModalOpen}
        selectedBoard={selectedBoard}
        handleBoardClick={handleBoardClick}
        setAddTaskModalOpen={setAddTaskModalOpen}
      />
      <Sidebar
        showSidebar={showSidebar}
        setShowSidebar={setShowSidebar}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        boards={boards}
        setAddBoardModalOpen={setAddBoardModalOpen}
        selectedBoard={selectedBoard}
        handleBoardClick={handleBoardClick}
      />
      {selectedBoard && (
        <Board
          showSidebar={showSidebar}
          darkMode={darkMode}
          editBoardModalOpen={editBoardModalOpen}
          setEditBoardModalOpen={setEditBoardModalOpen}
          selectedBoard={selectedBoard}
          setShowTaskDetails={setShowTaskDetails}
          setSelectedTask={setSelectedTask}
        />
      )}
      <button
        onClick={() => {
          setShowSidebar(true);
        }}
        className={clsx(
          showSidebar ? "opacity-0 z-[-10]" : "opacity-1 z-0",
          "md:flex hidden items-center gap-[0.625rem] pr-[1.4rem] pl-[1.2rem] py-[1.2rem] bg-[#635FC7] hover:bg-[#A8A4FF] rounded-r-full absolute bottom-[3rem] outline-none transition-all duration-200"
        )}
      >
        <img src={showSvg} alt="showSvg" className="select-none" />
      </button>
      <AddNewBoard
        addBoardModalOpen={addBoardModalOpen}
        setAddBoardModalOpen={setAddBoardModalOpen}
        darkMode={darkMode}
        boards={boards}
        setBoards={setBoards}
        fetchBoards={fetchBoards}
      />
      <EditBoardModal
        editBoardModalOpen={editBoardModalOpen}
        setEditBoardModalOpen={setEditBoardModalOpen}
        darkMode={darkMode}
        setBoards={setBoards}
        selectedBoard={selectedBoard}
        fetchBoards={fetchBoards}
      />
      <DeleteBoardModal
        deleteBoardModalOpen={deleteBoardModalOpen}
        setDeleteBoardModalOpen={setDeleteBoardModalOpen}
        darkMode={darkMode}
        selectedBoard={selectedBoard}
        setSelectedBoard={setSelectedBoard}
        fetchBoards={fetchBoards}
        boards={boards}
      />
      <AddNewTask
        addTaskModalOpen={addTaskModalOpen}
        setAddTaskModalOpen={setAddTaskModalOpen}
        darkMode={darkMode}
        showStatuses={showStatuses}
        setShowStatuses={setShowStatuses}
        selectedBoard={selectedBoard}
        fetchBoards={fetchBoards}
      />
      <TaskDetailsModal
        showTaskDetails={showTaskDetails}
        setShowTaskDetails={setShowTaskDetails}
        setEditTaskModalOpen={setEditTaskModalOpen}
        setDeleteTaskModalOpen={setDeleteTaskModalOpen}
        darkMode={darkMode}
        showStatuses={showStatuses}
        setShowStatuses={setShowStatuses}
        selectedBoard={selectedBoard}
        fetchBoards={fetchBoards}
        selectedTask={selectedTask}
      />
      <EditTaskModal
        editTaskModalOpen={editTaskModalOpen}
        setEditTaskModalOpen={setEditTaskModalOpen}
        darkMode={darkMode}
        showStatuses={showStatuses}
        setShowStatuses={setShowStatuses}
        selectedBoard={selectedBoard}
        fetchBoards={fetchBoards}
        selectedTask={selectedTask}
      />
      <DeleteTaskModal
        deleteTaskModalOpen={deleteTaskModalOpen}
        setDeleteTaskModalOpen={setDeleteTaskModalOpen}
        darkMode={darkMode}
        fetchBoards={fetchBoards}
        selectedTask={selectedTask}
      />
    </div>
  );
}
export default Main;
