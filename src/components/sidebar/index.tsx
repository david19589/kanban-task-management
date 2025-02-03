import boardSvg from "../../assets/icon-board.svg";
import PurpleBoardSvg from "../../assets/icons/purpleBoard";
import sunSvg from "../../assets/icon-light-theme.svg";
import moonSvg from "../../assets/icon-dark-theme.svg";
import hideSvg from "../../assets/icon-hide-sidebar.svg";
import clsx from "clsx";
import HideSideBarSvg from "../../assets/icons/hideSideBar";
import { boardColumn } from "../../utils/api";
import WhiteBoardSvg from "../../assets/icons/whiteBoard";

function Sidebar(props: {
  darkMode: boolean;
  setDarkMode: (status: boolean) => void;
  showSidebar: boolean;
  setShowSidebar: (status: boolean) => void;
  boards: boardColumn[];
  setAddBoardModalOpen: (status: boolean) => void;
  selectedBoard: boardColumn | null;
  handleBoardClick: (boardId: string) => void;
}) {
  return (
    <div
      className={clsx(
        props.showSidebar ? "translate-x-0" : "translate-x-[-30rem]",
        props.darkMode ? "bg-[#2B2C37]" : "bg-[#FFF]",
        "lg:top-[6rem] md:flex flex-col justify-between hidden absolute left-0 top-[5rem] bottom-0 pt-[2rem] pb-[3rem] w-[16.25rem] transition-all duration-200"
      )}
    >
      <div>
        <h2 className="text-[0.75rem] leading-[1rem] font-[700] tracking-[0.15rem] text-[#828FA3] ml-[1.5rem] mb-[1.3rem]">
          ALL BOARDS ({props.boards.length})
        </h2>
        <div>
          <div className="max-h-[31.5rem] h-full overflow-y-scroll custom-scrollbar">
            {props.boards.map((board) => (
              <div key={board.id}>
                <button
                  onClick={() => props.handleBoardClick(board.id)}
                  className={clsx(
                    props.selectedBoard?.id === board.id
                      ? "bg-[#635FC7]"
                      : "bg-transparent hover:bg-[#625fc736]",
                    "flex items-center gap-[0.75rem] pl-[1.5rem] pr-[4.325rem] py-[1rem] w-full rounded-r-full outline-none group"
                  )}
                >
                  {props.selectedBoard?.id === board.id ? (
                    <WhiteBoardSvg />
                  ) : (
                    <>
                      <img
                        src={boardSvg}
                        alt="boardSvg"
                        className="h-max select-none group-hover:hidden"
                      />
                      <PurpleBoardSvg className="hidden h-max select-none group-hover:flex" />
                    </>
                  )}
                  <h2
                    className={clsx(
                      props.selectedBoard?.id === board.id
                        ? "text-[#FFF]"
                        : "text-[#828FA3] group-hover:text-[#635FC7]",
                      "text-[1rem] leading-[1.15rem] font-[700] overflow-x-scroll overflow-y-hidden max-w-[8rem] custom-scrollbar2"
                    )}
                  >
                    {board.board_name}
                  </h2>
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={() => {
              props.setAddBoardModalOpen(true);
            }}
            className="flex items-center gap-[0.75rem] pl-[1.5rem] mt-[1rem] outline-none select-none"
          >
            <PurpleBoardSvg className="h-max" />
            <h2 className="text-[1rem] leading-[1.15rem] font-[700] text-[#635FC7]">
              + Create New Board
            </h2>
          </button>
        </div>
      </div>
      <div>
        <div
          className={clsx(
            props.darkMode ? "bg-[#20212C]" : "bg-[#F4F7FD]",
            "flex items-center gap-[1.45rem] py-[0.88rem] px-[3.5625rem] mx-[0.75rem] rounded-lg mb-[2rem]"
          )}
        >
          <img src={sunSvg} alt="sunSvg" className="h-max select-none" />
          <label className="inline-flex items-center cursor-pointer">
            <input type="checkbox" id="toggle" className="sr-only" />
            <span
              onClick={() => {
                props.setDarkMode(!props.darkMode);
              }}
              className={clsx(
                props.darkMode
                  ? "bg-[#A729F5] after:translate-x-full"
                  : "bg-gray-400",
                "relative w-[2.75rem] h-[1.5rem] rounded-full after:absolute after:top-[0.1875rem] after:start-[0.25rem] after:bg-[#FFF] after:rounded-full after:h-[1.125rem] after:w-[1.125rem] after:transition-all"
              )}
            />
          </label>
          <img src={moonSvg} alt="moonSvg" className="h-max select-none" />
        </div>
        <button
          onClick={() => {
            props.setShowSidebar(false);
          }}
          className={clsx(
            props.darkMode ? "hover:bg-[#FFF]" : "hover:bg-[#625fc72f]",
            "flex items-center gap-[0.625rem] outline-none py-[1rem] pl-[2rem] w-[15.25rem] rounded-r-full group transition-all duration-200"
          )}
        >
          <img
            src={hideSvg}
            alt="hideSvg"
            className="group-hover:hidden select-none"
          />
          <HideSideBarSvg className="group-hover:flex hidden select-none" />
          <h3 className="text-[1rem] leading-[1.15rem] font-[700] text-[#828FA3] group-hover:text-[#635FC7]">
            Hide Sidebar
          </h3>
        </button>
      </div>
    </div>
  );
}
export default Sidebar;
