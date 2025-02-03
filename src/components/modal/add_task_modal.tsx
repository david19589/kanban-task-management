import clsx from "clsx";
import Modal from ".";
import crossSvg from "../../assets/icon-cross.svg";
import {
  addSubtask,
  addTask,
  boardColumn,
  taskFormData,
} from "../../utils/api";
import { z, ZodType } from "zod";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import arrowDownSvg from "../../assets/icon-chevron-down.svg";
import useOutsideClick from "../../hooks/useOutsideClick";
import { useRef } from "react";

const schema: ZodType = z.object({
  task_name: z
    .string()
    .nonempty({ message: "Can't be empty" })
    .max(50, { message: "max 50 char." }),
  description: z.string().optional(),
  status: z.string().nonempty({ message: "Can't be empty" }),
  id: z.string().optional(),
  subtask: z.array(
    z.object({
      subtask_name: z.string().nonempty({ message: "Can't be empty" }),
      id: z.string().optional(),
    })
  ),
});

function AddNewTask(props: {
  addTaskModalOpen: boolean;
  setAddTaskModalOpen: (status: boolean) => void;
  darkMode: boolean;
  showStatuses: boolean;
  setShowStatuses: (status: boolean) => void;
  selectedBoard: boardColumn | null;
  fetchBoards: () => void;
}) {
  const toggleStatusDropdown = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    props.setShowStatuses(!props.showStatuses);
  };

  const statusRef = useRef<HTMLDivElement>(null);

  useOutsideClick(statusRef, () => props.setShowStatuses(false));

  const methods = useForm<taskFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      task_name: "",
      description: "",
      status: "",
      subtask: [{ subtask_name: "" }],
    },
  });

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = methods;

  const onSubmit = async (data: taskFormData) => {
    if (fields.length !== 0) {
      try {
        const selectedColumn = props.selectedBoard?.board_column.find(
          (column) => column.column_name === data.status
        );

        if (!selectedColumn) return;

        const newTask = await addTask({
          task_name: data.task_name,
          id: data.id,
          description: data.description,
          status: data.status,
          subtask: data.subtask,
          column_id: selectedColumn.id,
        });

        if (newTask && newTask.id) {
          await Promise.all(
            data.subtask.map(async (subtask) => {
              await addSubtask({
                subtask_name: subtask.subtask_name,
                id: subtask.id,
                is_completed: false,
                task_id: newTask.id,
              });
            })
          );
        }

        props.fetchBoards();
        reset();
        props.setAddTaskModalOpen(false);
      } catch (err) {
        console.error("Error adding board:", err);
      }
    }
  };

  const { fields, append, remove } = useFieldArray({
    control,
    name: "subtask",
  });

  const handleSelectStatus = (column: { column_name: string }) => {
    methods.setValue("status", column.column_name);
    methods.clearErrors("status");
    props.setShowStatuses(false);
  };

  return (
    <Modal
      isOpen={props.addTaskModalOpen}
      onClose={() => {
        props.setAddTaskModalOpen(false);
        reset();
      }}
      darkMode={props.darkMode}
    >
      <h2
        className={clsx(
          props.darkMode ? "text-[#FFF]" : "text-[#000112]",
          "text-[1.15rem] leading-[1.35rem] font-[700]"
        )}
      >
        Add New Task
      </h2>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
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
              <div className="flex items-center">
                <input
                  {...register("task_name")}
                  type="text"
                  id="task-name"
                  placeholder="e.g. Web Design"
                  className={clsx(
                    errors.task_name
                      ? "border-[#EA5555]"
                      : "hover:border-[#635FC7] transition-all duration-200",
                    props.darkMode
                      ? "bg-[#2B2C37] text-[#FFF]"
                      : "bg-[#FFF] text-[#000112]",
                    "text-[0.85rem] leading-[1.5rem] font-[500] rounded-md border-[0.0625rem] border-[#828FA340] px-[1rem] py-[0.5rem] w-full outline-none"
                  )}
                />
                {errors.task_name && (
                  <span className="absolute right-[1.15rem] text-[0.625rem] leading-[1rem] tracking-[-0.015rem] font-[500] text-[#EC5757] mr-[1rem]">
                    Can't be empty
                  </span>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-[0.5rem] custom-scrollbar">
              <h3
                className={clsx(
                  props.darkMode ? "text-[#FFF]" : "text-[#828FA3]",
                  "text-[0.75rem] leading-[1rem] font-[700]"
                )}
              >
                Description
              </h3>
              <textarea
                {...register("description")}
                id="description"
                placeholder="e.g. It's always good to take a break. This 15 minute break will  recharge the batteries a little."
                className={clsx(
                  props.darkMode
                    ? "bg-[#2B2C37] text-[#FFF]"
                    : "bg-[#FFF] text-[#000112]",
                  "text-[0.85rem] leading-[1.5rem] font-[500] rounded-md border-[0.0625rem] border-[#828FA340] px-[1rem] py-[0.5rem] pb-[2rem] w-full outline-none resize-none hover:border-[#635FC7] transition-all duration-200"
                )}
              />
            </div>
            <div className="flex flex-col">
              <div className="flex flex-col gap-[0.5rem] mb-[1.5rem] overflow-y-scroll custom-scrollbar max-h-[15rem]">
                <h3
                  className={clsx(
                    props.darkMode ? "text-[#FFF]" : "text-[#828FA3]",
                    "text-[0.75rem] leading-[1rem] font-[700]"
                  )}
                >
                  Subtasks
                </h3>
                {fields.length === 0 && (
                  <span
                    className={clsx(
                      props.darkMode ? "text-[#FFF]" : "text-[#a73030]",
                      "text-[0.75rem] leading-[1rem] font-[500]"
                    )}
                  >
                    add atleast one subtask
                  </span>
                )}
                <>
                  {fields.map((field, index) => (
                    <div
                      key={field.id}
                      className="flex items-center gap-[1rem] w-full relative"
                    >
                      <input
                        {...register(`subtask.${index}.subtask_name`)}
                        type="text"
                        id={`${index} subtask`}
                        className={clsx(
                          errors.subtask?.[index]?.subtask_name
                            ? "border-[#EA5555]"
                            : "hover:border-[#635FC7] transition-all duration-200",
                          props.darkMode
                            ? "bg-[#2B2C37] text-[#FFF]"
                            : "bg-[#FFF] text-[#000112]",
                          "text-[0.85rem] leading-[1.5rem] font-[500] rounded-md border-[0.0625rem] border-[#828FA340] px-[1rem] py-[0.5rem] w-full outline-none"
                        )}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          remove(index);
                        }}
                        className="outline-none select-none"
                      >
                        <img src={crossSvg} alt="crossSvg" />
                      </button>
                      {errors.subtask?.[index]?.subtask_name && (
                        <span className="absolute right-[3rem] text-[0.625rem] leading-[1rem] tracking-[-0.015rem] text-[#EC5757] mr-[1rem]">
                          {errors.subtask[index]?.subtask_name?.message}
                        </span>
                      )}
                    </div>
                  ))}
                </>
              </div>
              <button
                onClick={() =>
                  append({
                    subtask_name: "",
                    is_completed: false,
                    id: "",
                    task_id: "",
                  })
                }
                type="button"
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
                    !errors.status && props.showStatuses
                      ? "border-[#635FC7]"
                      : "border-[#828FA340]",
                    errors.status
                      ? "border-[#EA5555]"
                      : "hover:border-[#635FC7] transition-all duration-200",
                    props.darkMode
                      ? "bg-[#2B2C37] text-[#FFF]"
                      : "bg-[#FFF] text-[#000112]",
                    "flex items-center justify-between text-[0.85rem] leading-[1.5rem] font-[500] rounded-md border-[0.0625rem] px-[1rem] py-[0.5rem] w-full cursor-pointer"
                  )}
                >
                  <h2
                    className={clsx(
                      props.darkMode ? "text-[#FFF]" : "text-[ #000112]",
                      "text-[0.85rem] leading-[1.5rem] font-[500]"
                    )}
                  >
                    {methods.getValues("status") || "Select Status"}
                  </h2>
                  <img
                    src={arrowDownSvg}
                    alt="arrowDownSvg"
                    className={clsx(
                      props.showStatuses ? "rotate-180" : "rotate-0",
                      "select-none transition-all duration-200"
                    )}
                  />
                  {errors.status && (
                    <span className="absolute right-[3rem] text-[0.625rem] leading-[1rem] tracking-[-0.015rem] text-[#EC5757] mr-[1rem]">
                      {errors.status.message}
                    </span>
                  )}
                </div>
                <div
                  ref={statusRef}
                  className={clsx(
                    props.showStatuses ? "flex" : "hidden",
                    props.darkMode
                      ? "bg-[#2B2C37] text-[#FFF]"
                      : "bg-[#FFF] text-[#000112]",
                    "flex-col items-start justify-between gap-[0.5rem] absolute top-[3.5rem] text-[0.85rem] leading-[1.5rem] font-[500] rounded-md px-[1rem] py-[0.5rem] w-full shadow-md overflow-y-scroll h-[5rem] custom-scrollbar"
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
            <button
              type="submit"
              className="px-[1.125rem] py-[0.625rem] text-[0.85rem] leading-[1.5rem] font-[700] text-[#FFF] bg-[#635FC7] hover:bg-[#A8A4FF] rounded-full outline-none select-none transition-all duration-200"
            >
              Save Changes
            </button>
          </div>
        </form>
      </FormProvider>
    </Modal>
  );
}

export default AddNewTask;
