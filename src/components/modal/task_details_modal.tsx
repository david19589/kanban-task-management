import clsx from "clsx";
import Modal from ".";
import verticalEllipsisSvg from "../../assets/icon-vertical-ellipsis.svg";
import checkSvg from "../../assets/icon-check.svg";
import { useEffect, useRef, useState } from "react";
import useOutsideClick from "../../hooks/useOutsideClick";
import {
  boardColumn,
  subtaskData,
  taskFormData,
  updateSubtask,
  updateTask,
} from "../../utils/api";
import arrowDownSvg from "../../assets/icon-chevron-down.svg";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z, ZodType } from "zod";

const schema: ZodType = z.object({
  status: z.string().nonempty({ message: "Can't be empty" }),
});

function TaskDetailsModal(props: {
  showTaskDetails: boolean;
  setShowTaskDetails: (status: boolean) => void;
  setEditTaskModalOpen: (status: boolean) => void;
  setDeleteTaskModalOpen: (status: boolean) => void;
  darkMode: boolean;
  showStatuses: boolean;
  setShowStatuses: (status: boolean) => void;
  selectedBoard: boardColumn | null;
  fetchBoards: () => void;
  selectedTask: taskFormData | null;
}) {
  const [taskEllipsisMenu, setTaskEllipsisMenu] = useState(false);

  const [checkedSubtasks, setCheckedSubtasks] = useState<{
    [key: string]: boolean;
  }>({});

  const toggleEllipsis = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    setTaskEllipsisMenu(!taskEllipsisMenu);
  };

  const toggleStatusDropdown = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    props.setShowStatuses(!props.showStatuses);
  };

  const ellipsisRef = useRef<HTMLDivElement>(null);

  useOutsideClick(ellipsisRef, () => setTaskEllipsisMenu(false));

  const statusRef = useRef<HTMLDivElement>(null);

  useOutsideClick(statusRef, () => props.setShowStatuses(false));

  const openTaskEditModal = () => {
    props.setEditTaskModalOpen(true);
    setTaskEllipsisMenu(false);
    props.setShowTaskDetails(false);
  };

  const openTaskDeleteModal = () => {
    props.setDeleteTaskModalOpen(true);
    setTaskEllipsisMenu(false);
    props.setShowTaskDetails(false);
  };

  const methods = useForm<taskFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      status: props.selectedTask?.status || "",
    },
  });

  const { reset } = methods;

  const handleSelectStatus = async (column: {
    column_name: string;
    id: string;
  }) => {
    try {
      if (!props.selectedTask) return;

      await updateTask(props.selectedTask?.id, {
        ...props.selectedTask,
        status: column.column_name,
        column_id: column.id,
      });

      methods.setValue("status", column.column_name);
      methods.clearErrors("status");

      props.fetchBoards();
      props.setEditTaskModalOpen(false);
      props.setShowStatuses(false);
    } catch (err) {
      console.error("Error updating task status:", err);
    }
  };

  const handleCheckSubtasks = async (data: subtaskData) => {
    try {
      const updatedSubtask = {
        ...data,
        is_completed: !data.is_completed,
      };

      await updateSubtask(updatedSubtask.id, updatedSubtask);

      setCheckedSubtasks((prev) => ({
        ...prev,
        [data.id]: updatedSubtask.is_completed,
      }));

      if (props.selectedTask) {
        props.selectedTask.subtask = props.selectedTask.subtask.map((sub) =>
          sub.id === data.id ? updatedSubtask : sub
        );
      }

      props.fetchBoards();
    } catch (err) {
      console.error("Error updating subtask status:", err);
    }
  };

  useEffect(() => {
    if (props.selectedTask) {
      const initialCheckedState = props.selectedTask.subtask.reduce(
        (acc, subtask) => ({ ...acc, [subtask.id]: subtask.is_completed }),
        {}
      );
      setCheckedSubtasks(initialCheckedState);
      reset({ status: props.selectedTask.status });
    }
  }, [props.selectedTask, props.selectedTask?.status, reset]);

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
            {props.selectedTask?.task_name}
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
            "flex flex-col items-start gap-[1rem] absolute top-[4rem] right-[-1rem] p-[1rem] pr-[4rem] rounded-xl shadow-md z-10"
          )}
        >
          <button
            onClick={openTaskEditModal}
            className="text-[0.85rem] leading-[1.5rem] font-[500] text-[#828FA3] outline-none hover:text-[#828fa3e5] transition-all duration-200"
          >
            Edit Task
          </button>
          <button
            onClick={openTaskDeleteModal}
            className="text-[0.85rem] leading-[1.5rem] font-[500] text-[#EA5555] outline-none hover:text-[#ea5555e5] transition-all duration-200"
          >
            Delete Task
          </button>
        </div>
        <div className="flex flex-col gap-[1.5rem] mt-[1.5rem]">
          <div className="flex flex-col gap-[1.5rem]">
            <p
              className={clsx(
                props.darkMode ? "text-[#FFF]" : "text-[#828FA3]",
                "text-[0.75rem] leading-[1.5rem] font-[500]"
              )}
            >
              {props.selectedTask?.description}
            </p>
            <div className="flex flex-col">
              <h2
                className={clsx(
                  props.darkMode ? "text-[#FFF]" : "text-[#828FA3]",
                  "text-[0.75rem] leading-[1.5rem] font-[700] mb-[0.5rem]"
                )}
              >
                {`Subtasks ( ${
                  props.selectedTask?.subtask?.filter((sub) => sub.is_completed)
                    .length
                } of ${props.selectedTask?.subtask?.length} )`}
              </h2>
              {props.selectedTask?.subtask?.map((subtask) => {
                return (
                  <div
                    key={subtask.id}
                    onClick={() => handleCheckSubtasks(subtask)}
                    className={clsx(
                      props.darkMode ? "bg-[#20212C]" : "bg-[#F4F7FD]",
                      "flex items-center gap-[1rem] p-[0.75rem] mb-[0.5rem] rounded cursor-pointer hover:bg-[#625fc72d] transition-all duration-200"
                    )}
                  >
                    <button
                      className={clsx(
                        checkedSubtasks[subtask.id]
                          ? "bg-[#635FC7]"
                          : "border-[0.12rem] border-[#828FA33F]",
                        "w-[1rem] h-[1rem] flex items-center justify-center rounded-sm"
                      )}
                    >
                      {checkedSubtasks[subtask.id] && (
                        <img
                          className="w-[0.75rem]"
                          src={checkSvg}
                          alt="checkSvg"
                        />
                      )}
                    </button>
                    <h2
                      className={clsx(
                        checkedSubtasks[subtask.id] &&
                          "line-through opacity-[50%]",
                        props.darkMode ? "text-[#FFF]" : "text-[#000112]",
                        "text-[0.75rem] leading-[1.5rem] font-[700]"
                      )}
                    >
                      {subtask.subtask_name}
                    </h2>
                  </div>
                );
              })}
            </div>
            <div className="flex flex-col w-full relative">
              <h2
                className={clsx(
                  props.darkMode ? "text-[#FFF]" : "text-[#828FA3]",
                  "text-[0.75rem] leading-[1.5rem] font-[700] mb-[0.5rem]"
                )}
              >
                Current Status
              </h2>
              <div
                onMouseUp={toggleStatusDropdown}
                className={clsx(
                  props.showStatuses
                    ? "border-[#635FC7]"
                    : "border-[#828FA340] hover:border-[#635FC7] transition-all duration-200",
                  props.darkMode
                    ? "bg-[#2B2C37] text-[#FFF]"
                    : "bg-[#FFF] text-[#000112]",
                  "flex items-center justify-between text-[0.85rem] leading-[1.5rem] font-[500] rounded-md border-[0.0625rem] px-[1rem] py-[0.5rem] w-full cursor-pointer hover:border-[#635FC7] transition-all duration-200"
                )}
              >
                <h2
                  className={clsx(
                    props.darkMode ? "text-[#FFF]" : "text-[ #000112]",
                    "text-[0.85rem] leading-[1.5rem] font-[500]"
                  )}
                >
                  {methods.getValues("status")}
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
                  "flex-col items-start justify-between gap-[0.5rem] absolute top-[5rem] text-[0.85rem] leading-[1.5rem] font-[500] rounded-md px-[1rem] py-[0.5rem] w-full shadow-md overflow-y-scroll h-[5rem] custom-scrollbar"
                )}
              >
                {props.selectedBoard?.board_column
                  .filter((col) => col.board_id === props.selectedBoard?.id)
                  .map((column) => (
                    <h3
                      key={column.id}
                      onClick={() => handleSelectStatus(column)}
                      className="text-[0.85rem] leading-[1.5rem] font-[500] text-[#828FA3] cursor-pointer w-full hover:bg-[#828fa317] rounded-md px-[1rem] transition-all duration-200"
                    >
                      {column.column_name}
                    </h3>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default TaskDetailsModal;
