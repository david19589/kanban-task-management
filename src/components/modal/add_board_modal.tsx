import clsx from "clsx";
import Modal from ".";
import crossSvg from "../../assets/icon-cross.svg";
import {
  addBoard,
  addColumn,
  boardColumn,
  boardFormData,
  getBoard,
} from "../../utils/api";
import { z, ZodType } from "zod";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const schema: ZodType = z.object({
  board_name: z
    .string()
    .nonempty({ message: "Can't be empty" })
    .max(50, { message: "max 50 char." }),
  board_column: z.array(
    z.object({
      column_name: z
        .string()
        .nonempty({ message: "Can't be empty" })
        .max(50, { message: "max 50 char." }),
    })
  ),
});

function AddNewBoard(props: {
  addBoardModalOpen: boolean;
  setAddBoardModalOpen: (status: boolean) => void;
  darkMode: boolean;
  boards: boardColumn[];
  setBoards: (status: boardColumn[]) => void;
  newBoardName: string;
  setNewBoardName: (status: string) => void;
}) {
  const methods = useForm<boardFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      board_name: "",
      board_column: [{ column_name: "" }],
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
      const addedBoard = await addBoard({
        ...data,
        board_name: props.newBoardName,
      });

      const columnPromises = data.board_column.map((column) =>
        addColumn({
          column_name: column.column_name,
          board_id: addedBoard.id,
        })
      );

      await Promise.all(columnPromises);

      props.setBoards(await getBoard());
      reset();
      props.setAddBoardModalOpen(false);
    } catch (err) {
      console.error("Error adding board:", err);
    }
  };

  const { fields, append, remove } = useFieldArray({
    control,
    name: "board_column",
  });

  return (
    <Modal
      isOpen={props.addBoardModalOpen}
      onClose={() => {
        props.setAddBoardModalOpen(false);
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
        Add New Board
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
                  {...register("board_name", {
                    onChange: (e) => props.setNewBoardName(e.target.value),
                  })}
                  type="text"
                  id="board-name"
                  placeholder="e.g. Web Design"
                  className={clsx(
                    errors.board_name && "border-[#EA5555]",
                    props.darkMode
                      ? "bg-[#2B2C37] text-[#FFF]"
                      : "bg-[#FFF] text-[#000112]",
                    "text-[0.85rem] leading-[1.5rem] font-[500] rounded-md border-[0.0625rem] border-[#828FA340] px-[1rem] py-[0.5rem] w-full outline-none"
                  )}
                />
                {errors.board_name && (
                  <span className="absolute right-[1.15rem] text-[0.625rem] leading-[1rem] tracking-[-0.015rem] font-[500] text-[#EC5757] mr-[1rem]">
                    Can't be empty
                  </span>
                )}
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex flex-col gap-[0.5rem] mb-[1.5rem]">
                <h3
                  className={clsx(
                    props.darkMode ? "text-[#FFF]" : "text-[#828FA3]",
                    "text-[0.75rem] leading-[1rem] font-[700]"
                  )}
                >
                  Board Columns
                </h3>
                <>
                  {fields.map((field, index) => (
                    <div
                      key={field.id}
                      className="flex items-center gap-[1rem] w-full"
                    >
                      <input
                        {...register(`board_column.${index}.column_name`)}
                        type="text"
                        id={`${index} subtask`}
                        className={clsx(
                          errors.board_column &&
                            errors.board_column[index]?.column_name &&
                            "border-[#EA5555]",
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
                        type="button"
                        className="outline-none select-none"
                      >
                        <img src={crossSvg} alt="crossSvg" />
                      </button>
                      {errors.board_column?.[index]?.column_name && (
                        <span className="absolute right-[3rem] text-[0.625rem] leading-[1rem] tracking-[-0.015rem] text-[#EC5757] mr-[1rem]">
                          {errors.board_column[index]?.column_name?.message}
                        </span>
                      )}
                    </div>
                  ))}
                </>
              </div>
              <button
                onClick={() => {
                  append({ column_name: "" });
                }}
                type="button"
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
              Create New Board
            </button>
          </div>
        </form>
      </FormProvider>
    </Modal>
  );
}

export default AddNewBoard;
