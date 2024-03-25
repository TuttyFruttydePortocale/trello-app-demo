import React, { FormEvent, Fragment, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useBoardStore } from "@/store/BoardStore";
import TaskTypeRadioButton from "./TaskTypeRadioButton";
import Image from "next/image";
import { PhotoIcon } from "@heroicons/react/24/outline";

function AddTask() {
  const imagePickerRef = useRef<HTMLInputElement>(null);
  const [
    isOpenPopUp,
    setIsOpenPopUpState,
    userInput,
    setUserInput,
    addedTaskType,
    image,
    setImage,
    addTask,
  ] = useBoardStore((state) => [
    state.isOpenPopUp,
    state.setIsOpenPopUpState,
    state.userInput,
    state.setUserInput,
    state.addedTaskType,
    state.image,
    state.setImage,
    state.addTask,
  ]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!userInput) return;

    addTask(userInput, addedTaskType, image)
    setImage(null);
    setIsOpenPopUpState(false, addedTaskType)
  };
  return (
    <Transition appear show={isOpenPopUp} as={Fragment}>
      <Dialog
        as="form"
        onSubmit={handleSubmit}
        className="relative z-10"
        onClose={() => setIsOpenPopUpState(false, addedTaskType)}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100" 
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              {/* <div className="fixed inset-0 bg-black bg-opacity-25" /> */}
              <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
                <Dialog.Panel
                  className="w-full max-w-md transform overflow-hiden rounded-2xl bg-white 
                p-6 text-left align-middle shadow-xl transition-all"
                >
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900 pb-2 "
                  >
                    Add Task
                  </Dialog.Title>
                  <div className="mt-2">
                    <input
                      type="text"
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      placeholder="Write a new task here ..."
                      className="w-full border border-gray-300 rounded-md outline-none p-5"
                    />
                  </div>
                  <TaskTypeRadioButton />
                  <div>
                    <button
                      type="button"
                      onClick={() => {
                        imagePickerRef.current?.click();
                      }}
                      className="w-full border border-gray-300 rounded-md outline-none p-5 focus-visible:ring-2
                    focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    >
                      <PhotoIcon className="h-6 w-6 mr-2 inline-block" />
                    </button>
                    {image && (
                      <Image
                        alt="Uploaded Image"
                        width={200}
                        height={200}
                        className="w-full h-44 object-cover mt-2 filter hover:grayscale transition-all duration-150 cursor-not-allowed"
                        src={URL.createObjectURL(image)}
                        onClick={() => {
                          setImage(null);
                        }}
                      />
                    )}
                    <input
                      type="file"
                      ref={imagePickerRef}
                      hidden
                      onChange={(e) => {
                        //check if e is an image
                        if (!e.target.files![0].type.startsWith("image/"))
                          return;
                        setImage(e.target.files![0]);
                      }}
                    />
                  </div>
                  <div className="mt-4">
                    <button
                      type="submit"
                      disabled={!userInput}
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 
                  py-2 text-sm font-medium text-blue-900 focus:outline-none focus-visible:ring-2 
                  focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:bg-gray-100 disabled:text-gray-300 disabled:cursor-not-allowedS"
                    >
                      Add Task
                    </button>
                  </div>
                </Dialog.Panel>
              </div>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

export default AddTask;
