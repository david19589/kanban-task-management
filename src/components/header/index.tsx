import logoSvg from "../../assets/logo-mobile.svg";
import logoLightSvg from "../../assets/logo-light.svg";
import logoDarkSvg from "../../assets/logo-dark.svg";
import arrowDownSvg from "../../assets/icon-chevron-down.svg";
import plusSvg from "../../assets/icon-add-task-mobile.svg";
import verticalEllipsisSvg from "../../assets/icon-vertical-ellipsis.svg";
import { useRef, useState } from "react";
import PurpleBoardSvg from "../../assets/icons/purpleBoard";
import sunSvg from "../../assets/icon-light-theme.svg";
import moonSvg from "../../assets/icon-dark-theme.svg";
import boardSvg from "../../assets/icon-board.svg";
import clsx from "clsx";
import useOutsideClick from "../../hooks/useOutsideClick";
import { boardColumn } from "../../utils/api";
import WhiteBoardSvg from "../../assets/icons/whiteBoard";

function Header(props: {
  darkMode: boolean;
  setDarkMode: (status: boolean) => void;
  setEditBoardModalOpen: (status: boolean) => void;
  boards: boardColumn[];
  setBoards: (status: boardColumn[]) => void;
  newBoardName: string;
  setNewBoardName: (status: string) => void;
  setAddBoardModalOpen: (status: boolean) => void;
  setDeleteBoardModalOpen: (status: boolean) => void;
  selectedBoard: boardColumn | null;
  handleBoardClick: (boardId: string) => void;
}) {
  const [seeBoards, setSeeBoards] = useState(false);
  const [boardEllipsisMenu, setBoardEllipsisMenu] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const ellipsisRef = useRef<HTMLDivElement>(null);

  useOutsideClick(dropdownRef, () => setSeeBoards(false));
  useOutsideClick(ellipsisRef, () => setBoardEllipsisMenu(false));

  const toggleDropdown = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    setSeeBoards(!seeBoards);
    setBoardEllipsisMenu(false);
  };

  const toggleEllipsis = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    setBoardEllipsisMenu(!boardEllipsisMenu);
    setSeeBoards(false);
  };

  return (
    <div
      className={clsx(
        props.darkMode ? "bg-[#2B2C37]" : "bg-[#FFF]",
        "lg:pr-[3rem] md:py-0 flex items-center justify-between fixed right-0 left-0 top-0 px-[1.5rem] py-[1.25rem] transition-all duration-200 z-20"
      )}
    >
      <div className="md:gap-0 flex items-center gap-[1rem]">
        <img src={logoSvg} alt="logoSvg" className="md:hidden select-none" />
        <img
          src={props.darkMode ? logoLightSvg : logoDarkSvg}
          alt="logoDarkSvg"
          className="md:flex hidden select-none"
        />
        <button
          onMouseUp={toggleDropdown}
          className="md:hidden flex items-center gap-[0.5rem] outline-none"
        >
          <h1
            className={clsx(
              props.darkMode ? "text-[#FFF]" : "text-[#000112]",
              "sm:text-[1.125rem] text-[0.65rem] leading-[1.4rem] font-[700] transition-all duration-200 overflow-x-scroll max-w-[5rem] sm:max-w-[10rem] custom-scrollbar2"
            )}
          >
            {props.selectedBoard?.board_name}
          </h1>
          <img
            src={arrowDownSvg}
            alt="arrowDownSvg"
            className={clsx(
              seeBoards ? "rotate-180" : "rotate-0",
              "select-none transition-all duration-200"
            )}
          />
        </button>
        <span
          className={clsx(
            props.darkMode ? "bg-[#3E3F4E]" : "bg-[#E4EBFA]",
            "lg:h-[6rem] md:flex hidden w-[0.0625rem] h-[5rem] mr-[1.5rem] ml-[5.2rem] transition-all duration-200"
          )}
        />
        <h1
          className={clsx(
            props.darkMode ? "text-[#FFF]" : "text-[#000112]",
            "lg:max-w-[50rem] md:flex hidden text-[1.25rem] leading-[1.6rem] font-[700] text-[#000112] transition-all duration-200 overflow-x-scroll max-w-[12rem] custom-scrollbar2"
          )}
        >
          {props.selectedBoard?.board_name}
        </h1>
      </div>
      {seeBoards && (
        <div
          ref={dropdownRef}
          className={clsx(
            props.darkMode ? "bg-[#2B2C37]" : "bg-[#FFF]",
            "md:hidden flex flex-col gap-[3rem] absolute top-[6rem] py-[1rem] pr-[1rem] w-[16.25rem] transition-all duration-200 rounded-lg z-10"
          )}
        >
          <div>
            <h2 className="text-[0.75rem] leading-[1rem] font-[700] tracking-[0.15rem] text-[#828FA3] ml-[1.5rem] mb-[1.3rem]">
              ALL BOARDS ({props.boards.length})
            </h2>
            <div>
              <div className="h-[16rem] overflow-y-scroll custom-scrollbar">
                {props.boards?.map((board) => (
                  <div key={board.id}>
                    <button
                      onClick={() => {
                        props.handleBoardClick(board.id);
                        setSeeBoards(false);
                      }}
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
                          "text-[1rem] leading-[1.15rem] font-[700] overflow-x-scroll max-w-[7rem] custom-scrollbar2"
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
                  setSeeBoards(false);
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
          <div className="px-[0.75rem]">
            <div
              className={clsx(
                props.darkMode ? "bg-[#20212C]" : "bg-[#F4F7FD]",
                "flex items-center gap-[1.45rem] py-[0.88rem] px-[3.5625rem] rounded-lg"
              )}
            >
              <img src={sunSvg} alt="sunSvg" className="h-max select-none" />
              <label className="inline-flex items-center cursor-pointer">
                <input type="checkbox" id="toggle2" className="sr-only peer" />
                <span
                  onClick={() => {
                    props.setDarkMode(!props.darkMode);
                  }}
                  className="relative w-[2.75rem] h-[1.5rem] bg-[#A729F5] rounded-full peer peer-checked:after:translate-x-full after:absolute after:top-[0.1875rem] after:start-[0.25rem] after:bg-[#FFF] after:rounded-full after:h-[1.125rem] after:w-[1.125rem] after:transition-all"
                />
              </label>
              <img src={moonSvg} alt="moonSvg" className="h-max select-none" />
            </div>
          </div>
        </div>
      )}
      <div className="md:gap-[1.5rem] flex items-center gap-[1rem]">
        <button
          className={clsx(
            props.selectedBoard?.board_column.length !== 0
              ? "opacity-1 cursor-pointer"
              : "opacity-25 cursor-default",
            "md:px-[1.5rem] md:py-[0.9375rem] px-[1.125rem] py-[0.625rem] bg-[#635FC7] hover:bg-[#A8A4FF] rounded-full outline-none select-none transition-all duration-200"
          )}
        >
          <img src={plusSvg} alt="plusSvg" className="md:hidden" />
          <h2 className="md:flex hidden text-[0.9375rem] leading-[1.15rem] font-[700] text-[#FFF]">
            + Add New Task
          </h2>
        </button>
        <button onMouseUp={toggleEllipsis} className="outline-none select-none">
          <img
            src={verticalEllipsisSvg}
            alt="verticalEllipsisSvg"
            className="px-[0.5rem]"
          />
        </button>
        <div
          ref={ellipsisRef}
          className={clsx(
            boardEllipsisMenu ? "flex" : "hidden",
            props.darkMode ? "bg-[#20212C]" : "bg-[#FFF]",
            "flex flex-col items-start gap-[1rem] absolute top-[5rem] right-[1rem] p-[1rem] pr-[4rem] rounded-xl"
          )}
        >
          <button
            onClick={() => {
              props.setEditBoardModalOpen(true);
              setBoardEllipsisMenu(false);
            }}
            className="text-[0.85rem] leading-[1.5rem] font-[500] text-[#828FA3] outline-none"
          >
            Edit Board
          </button>
          <button
            onClick={() => {
              props.setDeleteBoardModalOpen(true);
              setBoardEllipsisMenu(false);
            }}
            className="text-[0.85rem] leading-[1.5rem] font-[500] text-[#EA5555] outline-none"
          >
            Delete Board
          </button>
        </div>
      </div>
      <span
        className={clsx(
          seeBoards ? "opacity-[50%] h-screen" : "opacity-0 h-0",
          "md:hidden flex absolute top-[4.5rem] left-0 right-0 bg-[#000] transition-all duration-200"
        )}
      />
    </div>
  );
}
export default Header;
