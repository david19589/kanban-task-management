import clsx from "clsx";
import { boardColumn } from "../../utils/api";
import plusSvg from "../../assets/icon-add-task-mobile.svg";

function Board(props: {
  darkMode: boolean;
  showSidebar: boolean;
  editBoardModalOpen: boolean;
  setEditBoardModalOpen: (status: boolean) => void;
  selectedBoard: boardColumn | null;
  setShowTaskDetails: (status: boolean) => void;
}) {
  const filteredColumns =
    props.selectedBoard?.board_column.filter(
      (column) => column.board_id === props.selectedBoard?.id
    ) || [];

  return (
    <div
      className={clsx(
        props.showSidebar
          ? "lg:translate-x-[17.75rem] lg:right-[17.75rem] md:translate-x-[16.25rem] md:absolute md:right-[16.25rem] md:left-0 custom-scrollbar"
          : "translate-x-0",
        "md:px-[1.5rem] flex h-full px-[1rem] transition-all duration-200"
      )}
    >
      {filteredColumns.length === 0 ? (
        <div className="lg:mt-[6rem] flex flex-col items-center justify-center gap-[1.5rem] mt-[5rem] w-full">
          <p className="text-[1.125rem] leading-[1.4rem] font-[700] text-[#828FA3] w-full text-center">
            This board is empty. Create a new column to get started.
          </p>
          <button className="flex items-center gap-[0.5rem] px-[1.5rem] py-[0.9375rem] max-w-[12.15rem] w-full bg-[#635FC7] hover:bg-[#A8A4FF] rounded-full outline-none select-none transition-all duration-200">
            <img src={plusSvg} alt="plusSvg" />
            <button
              onClick={() => {
                props.setEditBoardModalOpen(true);
              }}
              className="text-[0.9375rem] leading-[1.15rem] font-[700] text-[#FFF] outline-none"
            >
              Add New Column
            </button>
          </button>
        </div>
      ) : (
        <div className="lg:mt-[7.5rem] flex gap-[1.5rem] mt-[6.5rem] pb-[1.5rem] overflow-x-scroll custom-scrollbar">
          {filteredColumns.map((column) => {
            const tasksFromColumn = column.task || [];

            return (
              <div
                key={column.column_name}
                className="flex flex-col gap-[1.5rem] w-[17.5rem]"
              >
                <div className="flex items-center gap-[0.5rem] w-[17.5rem]">
                  <span className="flex w-[0.8rem] h-[0.8rem] bg-[#49C4E5] rounded-full" />
                  <h2 className="text-[0.75rem] leading-[1rem] font-[700] text-[#828FA3]">
                    {column.column_name}
                  </h2>
                  <span className="text-[0.75rem] leading-[1rem] font-[700] text-[#828FA3]">
                    ( {tasksFromColumn?.length} )
                  </span>
                </div>
                {tasksFromColumn.map((task) => (
                  <div
                    key={task.id}
                    onClick={() => {
                      props.setShowTaskDetails(true);
                    }}
                    className={clsx(
                      props.darkMode ? "bg-[#2B2C37]" : "bg-[#FFF]",
                      "flex flex-col gap-[0.5rem] p-[1.5rem] w-[17.5rem] rounded-lg shadow-lg cursor-pointer group transition-all duration-200"
                    )}
                  >
                    <h1
                      className={clsx(
                        props.darkMode ? "text-[#FFF]" : "text-[#000112]",
                        "text-[0.95rem] leading-[1.2rem] font-[700] group-hover:text-[#635FC7] transition-all duration-200"
                      )}
                    >
                      {task.task_name}
                    </h1>
                    <h3 className="text-[0.75rem] leading-[1rem] font-[700] text-[#828FA3]">
                      0 of 5 subsTasks
                    </h3>
                  </div>
                ))}
              </div>
            );
          })}
          <div className="w-[17.5rem]">
            <button
              onClick={() => {
                props.setEditBoardModalOpen(true);
              }}
              className={clsx(
                props.darkMode ? "bg-[#2B2C3740]" : "bg-[#E9EFFA]",
                "w-[17.5rem] h-full text-[1.5rem] leading-[1.9rem] font-[700] text-[#828FA3] hover:text-[#635FC7] transition-all duration-200 outline-none rounded-lg"
              )}
            >
              + New Column
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
export default Board;
