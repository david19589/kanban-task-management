import clsx from "clsx";
import Modal from ".";
import verticalEllipsisSvg from "../../assets/icon-vertical-ellipsis.svg";
import { useRef, useState } from "react";
import EditTaskModal from "./edit_task_modal";
import DeleteTaskModal from "./delete_task_modal";
import useOutsideClick from "../../hooks/useOutsideClick";

function TaskDetailsModal(props: {
  showTaskDetails: boolean;
  setShowTaskDetails: (status: boolean) => void;
  darkMode: boolean;
}) {
  const [editTaskModalOpen, setEditTaskModalOpen] = useState(false);
  const [showStatuses, setShowStatuses] = useState(false);
  const [taskEllipsisMenu, setTaskEllipsisMenu] = useState(false);
  const [deleteTaskModalOpen, setDeleteTaskModalOpen] = useState(false);

  const toggleEllipsis = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    setTaskEllipsisMenu(!taskEllipsisMenu);
  };

  const ellipsisRef = useRef<HTMLDivElement>(null);

  useOutsideClick(ellipsisRef, () => setTaskEllipsisMenu(false));

  const openTaskEditModal = () => {
    setEditTaskModalOpen(true);
    setTaskEllipsisMenu(false);
    props.setShowTaskDetails(false);
  };
  const openTaskDeleteModal = () => {
    setEditTaskModalOpen(true);
    setTaskEllipsisMenu(false);
    props.setShowTaskDetails(false);
  };

  return (
    <>
      <Modal
        isOpen={props.showTaskDetails}
        onClose={() => props.setShowTaskDetails(false)}
        darkMode={props.darkMode}
      >
        <div className="flex items-center justify-between">
          <h2
            className={clsx(
              props.darkMode ? "text-[#FFF]" : "text-[#000112]",
              "text-[1.15rem] leading-[1.35rem] font-[700]"
            )}
          >
            Research pricing points of various competitors and trial different
            business models
          </h2>
          <button
            onMouseUp={toggleEllipsis}
            className="outline-none select-none px-[0.5rem]"
          >
            <img
              src={verticalEllipsisSvg}
              alt="verticalEllipsisSvg"
              className="min-w-[0.30rem]"
            />
          </button>
        </div>
        <div
          ref={ellipsisRef}
          className={clsx(
            taskEllipsisMenu ? "flex" : "hidden",
            props.darkMode ? "bg-[#20212C]" : "bg-[#FFF]",
            "flex flex-col items-start gap-[1rem] absolute top-[4rem] right-[-1rem] p-[1rem] pr-[4rem] rounded-xl"
          )}
        >
          <button
            onClick={openTaskEditModal}
            className="text-[0.85rem] leading-[1.5rem] font-[500] text-[#828FA3] outline-none"
          >
            Edit Task
          </button>
          <button
            onClick={openTaskDeleteModal}
            className="text-[0.85rem] leading-[1.5rem] font-[500] text-[#EA5555] outline-none"
          >
            Delete Task
          </button>
        </div>
        <div className="flex flex-col gap-[1.5rem] mt-[1.5rem]">
          <div className="flex flex-col gap-[0.5rem]">
            <p
              className={clsx(
                props.darkMode ? "text-[#FFF]" : "text-[#828FA3]",
                "text-[0.75rem] leading-[1.5rem] font-[500]"
              )}
            >
              We know what we're planning to build for version one. Now we need
              to finalise the first pricing model we'll use. Keep iterating the
              subtasks until we have a coherent proposition.
            </p>

            <input
              type="text"
              id="board-name"
              className={clsx(
                props.darkMode
                  ? "bg-[#2B2C37] text-[#FFF]"
                  : "bg-[#FFF] text-[#000112]",
                "text-[0.85rem] leading-[1.5rem] font-[500] rounded-md border-[0.0625rem] border-[#828FA340] px-[1rem] py-[0.5rem] w-full outline-none"
              )}
            />
          </div>
        </div>
      </Modal>
      <EditTaskModal
        editTaskModalOpen={editTaskModalOpen}
        setEditTaskModalOpen={setEditTaskModalOpen}
        darkMode={props.darkMode}
        showStatuses={showStatuses}
        setShowStatuses={setShowStatuses}
      />
      <DeleteTaskModal
        deleteTaskModalOpen={deleteTaskModalOpen}
        setDeleteTaskModalOpen={setDeleteTaskModalOpen}
        darkMode={props.darkMode}
      />
    </>
  );
}

export default TaskDetailsModal;
