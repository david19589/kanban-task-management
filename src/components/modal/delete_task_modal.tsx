import clsx from "clsx";
import Modal from ".";
import { deleteTask, taskFormData } from "../../utils/api";

function DeleteTaskModal(props: {
  deleteTaskModalOpen: boolean;
  setDeleteTaskModalOpen: (status: boolean) => void;
  darkMode: boolean;
  fetchBoards: () => void;
  selectedTask: taskFormData | null;
}) {
  const handleDelete = async () => {
    if (!props.selectedTask) return;

    try {
      await deleteTask(props.selectedTask?.id);

      props.setDeleteTaskModalOpen(false);
      props.fetchBoards();
    } catch (err) {
      console.error("Error deleting task:", err);
      alert("Failed to delete the task. Please try again.");
    }
  };

  return (
    <Modal
      isOpen={props.deleteTaskModalOpen}
      onClose={() => props.setDeleteTaskModalOpen(false)}
      darkMode={props.darkMode}
    >
      <div
        className={clsx(
          props.darkMode ? "bg-[#2B2C37]" : "bg-[#FFF]",
          "flex flex-col gap-[1.5rem]"
        )}
      >
        <h2 className="text-[1.15rem] leading-[1.4rem] font-[700] text-[#EA5555]">
          Delete this task?
        </h2>
        <p className="text-[0.85rem] leading-[1.45rem] font-[500] text-[#828FA3]">
          Are you sure you want to delete the 'Build settings UI' task and its
          subtasks? This action cannot be reversed.
        </p>
        <div className="flex items-center mt-4 space-x-4 w-full">
          <button
            onClick={handleDelete}
            className="text-[0.85rem] leading-[1.45rem] font-[700] text-[#FFF] px-[1rem] py-[0.5rem] bg-[#EA5555] rounded-full hover:bg-[#FF9898] w-full transition-all duration-200"
          >
            Delete
          </button>
          <button
            className={clsx(
              props.darkMode
                ? "bg-[#FFF] hover:bg-[#ffffffe8]"
                : "bg-[#635FC71A] hover:bg-[#635FC740]",
              "text-[0.85rem] leading-[1.45rem] font-[700] text-[#635FC7] px-[1rem] py-[0.5rem] rounded-full w-full transition-all duration-200"
            )}
            onClick={() => props.setDeleteTaskModalOpen(false)}
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default DeleteTaskModal;
