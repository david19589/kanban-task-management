import { useEffect, useState } from "react";
import Header from "../header";
import Sidebar from "../sidebar";
import showSvg from "../../assets/icon-show-sidebar.svg";
import clsx from "clsx";
import Board from "../board";
import { boardColumn, getBoard, getColumn } from "../../utils/api";
import AddNewBoard from "../modal/add_board_modal";
import DeleteBoardModal from "../modal/delete_board_modal";
import EditBoardModal from "../modal/edit_board_modal";
import TaskDetailsModal from "../modal/task_details_modal";

function Main() {
  const [darkMode, setDarkMode] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [addBoardModalOpen, setAddBoardModalOpen] = useState(false);
  const [editBoardModalOpen, setEditBoardModalOpen] = useState(false);
  const [deleteBoardModalOpen, setDeleteBoardModalOpen] = useState(false);
  const [boards, setBoards] = useState<boardColumn[]>([]);
  const [newBoardName, setNewBoardName] = useState("");
  const [selectedBoard, setSelectedBoard] = useState<boardColumn | null>(null);
  const [showTaskDetails, setShowTaskDetails] = useState(false);

  const fetchBoards = async () => {
    try {
      const board = await getBoard();
      setBoards(board);
      if (board.length > 0) {
        setNewBoardName(board[0].board_name);
        const columns = await getColumn(board[0].id);
        setSelectedBoard({ ...board[0], board_column: columns });
      }
    } catch (err) {
      console.error("Failed to fetch boards:", err);
      setBoards([]);
    }
  };

  useEffect(() => {
    fetchBoards();
  }, []);

  const handleBoardClick = async (boardId: string) => {
    const board = boards.find((item) => item.id === boardId) || null;
    if (board) {
      try {
        const columns = await getColumn(boardId);
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
        newBoardName={newBoardName}
        setNewBoardName={setNewBoardName}
        setAddBoardModalOpen={setAddBoardModalOpen}
        setDeleteBoardModalOpen={setDeleteBoardModalOpen}
        selectedBoard={selectedBoard}
        handleBoardClick={handleBoardClick}
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
        newBoardName={newBoardName}
        setNewBoardName={setNewBoardName}
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
        fetchBoards={fetchBoards}
      />
      <TaskDetailsModal
        showTaskDetails={showTaskDetails}
        setShowTaskDetails={setShowTaskDetails}
        darkMode={darkMode}
      />
    </div>
  );
}
export default Main;
