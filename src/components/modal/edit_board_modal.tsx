import clsx from "clsx";
import Modal from ".";
import crossSvg from "../../assets/icon-cross.svg";
import {
  addColumn,
  boardColumn,
  boardFormData,
  deleteColumn,
  updateBoard,
  updateColumn,
} from "../../utils/api";
import { z, ZodType } from "zod";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";

const schema: ZodType = z.object({
  board_name: z
    .string()
    .nonempty({ message: "Can't be empty" })
    .max(50, { message: "max 50 char." }),
  board_column: z
    .array(
      z.object({
        column_name: z
          .string()
          .nonempty({ message: "Can't be empty" })
          .max(50, { message: "max 50 char." }),
        id: z.string().optional(),
      })
    )
    .refine(
      (columns) =>
        new Set(columns.map((column) => column.column_name.trim())).size ===
        columns.length,
      { message: "Column names must be unique" }
    ),
});

function EditBoardModal(props: {
  editBoardModalOpen: boolean;
  setEditBoardModalOpen: (status: boolean) => void;
  darkMode: boolean;
  setBoards: (status: boardColumn[]) => void;
  selectedBoard: boardColumn | null;
  fetchBoards: () => void;
}) {
  const [columnsToDelete, setColumnsToDelete] = useState<string[]>([]);

  const methods = useForm<boardFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      board_name: props.selectedBoard?.board_name || "",
      board_column:
        props.selectedBoard?.board_column
          .filter((column) => column.board_id === props.selectedBoard?.id)
          .map((column) => ({
            column_name: column.column_name,
            id: column.id,
            fieldKey: column.id || crypto.randomUUID(),
          })) || [],
    },
  });

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = methods;

  const onSubmit = async (data: boardFormData) => {
    try {
      if (!props.selectedBoard) return;

      await updateBoard(props.selectedBoard.id, {
        ...data,
        board_name: data.board_name,
      });

      const updatePromises = data.board_column.map((column) => {
        if (!props.selectedBoard) return;

        if (column.id) {
          return updateColumn(column.id, {
            column_name: column.column_name,
            board_id: props.selectedBoard.id,
            id: column.id,
          });
        } else {
          return addColumn({
            column_name: column.column_name,
            board_id: props.selectedBoard.id,
            id: column.id,
          });
        }
      });
      const deletePromises = columnsToDelete.map((id: string) =>
        deleteColumn(id)
      );

      await Promise.all([...updatePromises, ...deletePromises]);

      props.fetchBoards();
      reset();
      setColumnsToDelete([]);
      props.setEditBoardModalOpen(false);
    } catch (err) {
      console.error("Error editing board:", err);
    }
  };

  const { fields, append, remove } = useFieldArray({
    control,
    name: "board_column",
    keyName: "fieldKey",
  });

  useEffect(() => {
    if (props.selectedBoard) {
      reset({
        board_name: props.selectedBoard.board_name,
        board_column: props.selectedBoard.board_column
          .filter((column) => column.board_id === props.selectedBoard?.id)
          .map((column) => ({
            column_name: column.column_name,
            id: column.id,
            fieldKey: column.id || crypto.randomUUID(),
          })),
      });
    }
  }, [props.selectedBoard, reset]);

  return (
    <Modal
      isOpen={props.editBoardModalOpen}
      onClose={() => {
        props.setEditBoardModalOpen(false);
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
        Edit Board
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
                Board Name
              </h3>
              <div className="flex items-center">
                <input
                  {...register("board_name")}
                  type="text"
                  id="board-name"
                  className={clsx(
                    errors.board_name
                      ? "border-[#EA5555]"
                      : "hover:border-[#635FC7] transition-all duration-200",
                    props.darkMode
                      ? "bg-[#2B2C37] text-[#FFF]"
                      : "bg-[#FFF] text-[#000112]",
                    "text-[0.85rem] leading-[1.5rem] font-[500] rounded-md border-[0.0625rem] border-[#828FA340] px-[1rem] py-[0.5rem] w-full outline-none"
                  )}
                />
                {errors.board_name && (
                  <span className="absolute right-[1.15rem] text-[0.625rem] leading-[1rem] tracking-[-0.015rem] font-[500] text-[#EC5757] mr-[1rem]">
                    {errors.board_name.message}
                  </span>
                )}
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex flex-col gap-[0.5rem] mb-[1.5rem] overflow-y-scroll custom-scrollbar max-h-[15rem]">
                <h3
                  className={clsx(
                    props.darkMode ? "text-[#FFF]" : "text-[#828FA3]",
                    "text-[0.75rem] leading-[1rem] font-[700]"
                  )}
                >
                  Board Columns
                </h3>
                {fields.map((field, index) => (
                  <div
                    key={field.fieldKey}
                    className="flex items-center gap-[1rem] w-full relative"
                  >
                    <input
                      {...register(`board_column.${index}.column_name`)}
                      type="text"
                      id={`${field.id} subTask`}
                      className={clsx(
                        errors.board_column &&
                          errors.board_column[index]?.column_name
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
                        if (field.id) {
                          setColumnsToDelete((prev) => [...prev, field.id]);
                        }
                        remove(index);
                      }}
                      className="outline-none select-none"
                    >
                      <img src={crossSvg} alt="crossSvg" />
                    </button>
                    {errors.board_column?.[index]?.column_name && (
                      <span className="absolute right-[2rem] text-[0.625rem] leading-[1rem] tracking-[-0.015rem] text-[#EC5757] mr-[1rem]">
                        {errors.board_column[index]?.column_name?.message}
                      </span>
                    )}
                  </div>
                ))}

                {errors.board_column?.message && (
                  <span className="text-red-500 text-sm">
                    {errors.board_column.message}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() =>
                  append({ column_name: "", id: "", board_id: "" })
                }
                className={clsx(
                  props.darkMode
                    ? "bg-[#FFF] hover:bg-[#ffffffe5]"
                    : "bg-[#635FC71A] hover:bg-[#635FC740]",
                  "px-[1.125rem] py-[0.625rem] text-[0.85rem] leading-[1.5rem] font-[700] text-[#635FC7] rounded-full outline-none select-none transition-all duration-200"
                )}
              >
                + Add New Column
              </button>
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

export default EditBoardModal;
