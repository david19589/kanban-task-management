import clsx from "clsx";
import Modal from ".";
import crossSvg from "../../assets/icon-cross.svg";
import arrowDownSvg from "../../assets/icon-chevron-down.svg";
import { useRef } from "react";
import useOutsideClick from "../../hooks/useOutsideClick";

function EditTaskModal(props: {
  editTaskModalOpen: boolean;
  setEditTaskModalOpen: (status: boolean) => void;
  darkMode: boolean;
  showStatuses: boolean;
  setShowStatuses: (status: boolean) => void;
}) {
  const toggleStatusDropdown = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    props.setShowStatuses(!props.showStatuses);
  };

  const statusRef = useRef<HTMLDivElement>(null);

  useOutsideClick(statusRef, () => props.setShowStatuses(false));

  return (
    <Modal
      isOpen={props.editTaskModalOpen}
      onClose={() => props.setEditTaskModalOpen(false)}
      darkMode={props.darkMode}
    >
      <h2
        className={clsx(
          props.darkMode ? "text-[#FFF]" : "text-[#000112]",
          "text-[1.15rem] leading-[1.35rem] font-[700]"
        )}
      >
        Edit Task
      </h2>
      <div className="flex flex-col gap-[1.5rem] mt-[1.5rem]">
        <div className="flex flex-col gap-[0.5rem]">
          <h3
            className={clsx(
              props.darkMode ? "text-[#FFF]" : "text-[#828FA3]",
              "text-[0.75rem] leading-[1rem] font-[700]"
            )}
          >
            Title
          </h3>
          <input
            type="text"
            id="title"
            className={clsx(
              props.darkMode
                ? "bg-[#2B2C37] text-[#FFF]"
                : "bg-[#FFF] text-[#000112]",
              "text-[0.85rem] leading-[1.5rem] font-[500] rounded-md border-[0.0625rem] border-[#828FA340] px-[1rem] py-[0.5rem] w-full outline-none"
            )}
          />
        </div>
        <div className="flex flex-col gap-[0.5rem]">
          <h3
            className={clsx(
              props.darkMode ? "text-[#FFF]" : "text-[#828FA3]",
              "text-[0.75rem] leading-[1rem] font-[700]"
            )}
          >
            Description
          </h3>
          <textarea
            id="description"
            placeholder="e.g. It's always good to take a break. This 15 minute break will  recharge the batteries a little."
            className={clsx(
              props.darkMode
                ? "bg-[#2B2C37] text-[#FFF]"
                : "bg-[#FFF] text-[#000112]",
              "text-[0.85rem] leading-[1.5rem] font-[500] rounded-md border-[0.0625rem] border-[#828FA340] px-[1rem] py-[0.5rem] pb-[2rem] w-full outline-none resize-none"
            )}
          />
        </div>
        <div className="flex flex-col">
          <div className="flex flex-col gap-[0.5rem] mb-[1.5rem]">
            <h3
              className={clsx(
                props.darkMode ? "text-[#FFF]" : "text-[#828FA3]",
                "text-[0.75rem] leading-[1rem] font-[700]"
              )}
            >
              Subtasks
            </h3>
            <div className="flex items-center gap-[1rem] w-full">
              <input
                type="text"
                id="subTask"
                className={clsx(
                  props.darkMode
                    ? "bg-[#2B2C37] text-[#FFF]"
                    : "bg-[#FFF] text-[#000112]",
                  "text-[0.85rem] leading-[1.5rem] font-[500] rounded-md border-[0.0625rem] border-[#828FA340] px-[1rem] py-[0.5rem] w-full outline-none"
                )}
              />
              <button className="outline-none select-none">
                <img src={crossSvg} alt="crossSvg" />
              </button>
            </div>
          </div>
          <button
            className={clsx(
              props.darkMode
                ? "bg-[#FFF] hover:bg-[#ffffffe5]"
                : "bg-[#635FC71A] hover:bg-[#635FC740]",
              "px-[1.125rem] py-[0.625rem] text-[0.85rem] leading-[1.5rem] font-[700] text-[#635FC7] rounded-full outline-none select-none transition-all duration-200"
            )}
          >
            + Add New Subtask
          </button>
        </div>
        <div className="flex flex-col gap-[0.5rem] mb-[1.5rem]">
          <h3
            className={clsx(
              props.darkMode ? "text-[#FFF]" : "text-[#828FA3]",
              "text-[0.75rem] leading-[1rem] font-[700]"
            )}
          >
            Status
          </h3>
          <div className="flex flex-col items-center gap-[1rem] w-full relative">
            <div
              onMouseUp={toggleStatusDropdown}
              className={clsx(
                props.darkMode
                  ? "bg-[#2B2C37] text-[#FFF]"
                  : "bg-[#FFF] text-[#000112]",
                "flex items-center justify-between text-[0.85rem] leading-[1.5rem] font-[500] rounded-md border-[0.0625rem] border-[#828FA340] px-[1rem] py-[0.5rem] w-full cursor-pointer"
              )}
            >
              <h2
                className={clsx(
                  props.darkMode ? "text-[#FFF]" : "text-[ #000112]",
                  "text-[0.85rem] leading-[1.5rem] font-[500]"
                )}
              >
                Doing
              </h2>
              <img
                src={arrowDownSvg}
                alt="arrowDownSvg"
                className={clsx(
                  props.showStatuses ? "rotate-180" : "rotate-0",
                  "select-none transition-all duration-200"
                )}
              />
            </div>
            <div
              ref={statusRef}
              className={clsx(
                props.showStatuses ? "flex" : "hidden",
                props.darkMode
                  ? "bg-[#2B2C37] text-[#FFF]"
                  : "bg-[#FFF] text-[#000112]",
                "flex-col items-start justify-between gap-[0.5rem] absolute top-[4rem] text-[0.85rem] leading-[1.5rem] font-[500] rounded-md px-[1rem] py-[0.5rem] w-full shadow-md overflow-y-scroll h-[5rem] custom-scrollbar"
              )}
            >
              <h3 className="text-[0.85rem] leading-[1.5rem] font-[500] text-[#828FA3] cursor-pointer w-full hover:bg-[#828fa317] rounded-md px-[1rem] transition-all duration-200">
                Doing
              </h3>
            </div>
          </div>
        </div>
        <button className="px-[1.125rem] py-[0.625rem] text-[0.85rem] leading-[1.5rem] font-[700] text-[#FFF] bg-[#635FC7] hover:bg-[#A8A4FF] rounded-full outline-none select-none transition-all duration-200">
          Save Changes
        </button>
      </div>
    </Modal>
  );
}

export default EditTaskModal;
