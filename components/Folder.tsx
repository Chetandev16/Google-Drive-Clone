"use client";

interface Props {
  name: string;
  id: number;
  layout: string;
}
import { useRouter } from "next/navigation";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import Options from "@/components/Options";
import { Folder, X } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { forEach, isEmpty } from "lodash";
import { useLoaderStore } from "@/store/use-loader-store";
import { useDataStore } from "@/store/use-data-store";

const FolderComponent: React.FC<Props> = ({ name, id, layout }) => {
  const [isEditName, setIsEditName] = useState(false);
  const [nameOnEdit, setNameOnEdit] = useState(name);
  const { startTopLoader, stopTopLoader } = useLoaderStore();
  const { addDataToStore, folders, files } = useDataStore();
  const router = useRouter();

  const onClickEdit = () => {
    setIsEditName(true);
  };

  const updateFolderNameinDB = async () => {
    try {
      startTopLoader();
      const res = await axios.put("/api/folder/update", {
        folderId: id,
        folderName: nameOnEdit,
      });

      const { folder_id, folder_name } = res.data;

      const updatedFolders = forEach(folders, (folder) => {
        if (folder.id === folder_id) {
          folder.name = folder_name;
        }
      });

      addDataToStore(files, updatedFolders);
    } catch (err) {
      console.log(err);
      toast.error("Error occurred while updating folder name!");
    } finally {
      setIsEditName(false);
      stopTopLoader();
    }
  };

  const handleFolderClick = () => {
    router.push(`/dashboard/home/folder/${id}`);
  };

  if (layout == "grid") {
    return (
      <div
        onClick={() => handleFolderClick()}
        className="flex hover:bg-[#E1E5EA] bg-[#EDF2FC] items-center justify-between p-2 rounded-md cursor-pointer transition-colors"
      >
        <div className="flex gap-2 justify-center items-center">
          <Folder
            size={28}
            color="#5F6368"
            className="fill-[#5F6368]"
            strokeWidth={3}
          />
          {!isEditName ? (
            <p className="text-[#5F6368] text-sm font-medium truncate">
              {name}
            </p>
          ) : (
            <div
              onClick={(e) => {
                e.stopPropagation();
              }}
              className="relative"
            >
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (isEmpty(nameOnEdit)) {
                    toast.error("Folder name cannot be empty");
                    return;
                  }

                  updateFolderNameinDB();
                }}
              >
                <Input
                  className="focus-visible:ring-transparent border-0 "
                  type="text"
                  value={nameOnEdit}
                  placeholder="Enter folder name"
                  onChange={(e) => setNameOnEdit(e.target.value)}
                />
              </form>

              <X
                onClick={() => {
                  setIsEditName(false);
                }}
                className="absolute -right-1 -top-1 h-4 w-4 text-red-600 bg-red-200 rounded-lg"
              />
            </div>
          )}
        </div>

        <div onClick={(e) => e.stopPropagation()}>
          <Options
            onClickEdit={onClickEdit}
            name={name}
            type="Folder"
            id={id}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <Separator />
      <div className="group">
        <div
          onClick={() => handleFolderClick()}
          className="cursor-pointer flex p-3 group-hover:bg-[#E1E5EA] mt-2 rounded-sm justify-between items-center gap-3"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-2"
          >
            {" "}
            <Folder
              size={28}
              color="#5F6368"
              className="fill-[#5F6368]"
              strokeWidth={3}
            />
            {!isEditName ? (
              <p className="text-[#5F6368] text-sm font-medium truncate">
                {name}
              </p>
            ) : (
              <div className="relative">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (isEmpty(nameOnEdit)) {
                      toast.error("Folder name cannot be empty");
                      return;
                    }

                    updateFolderNameinDB();
                  }}
                >
                  <Input
                    className="focus-visible:ring-transparent border-0 bg-slate-200 group-hover:bg-white"
                    type="text"
                    value={nameOnEdit}
                    placeholder="Enter folder name"
                    onChange={(e) => setNameOnEdit(e.target.value)}
                  />
                </form>

                <X
                  onClick={() => {
                    setIsEditName(false);
                  }}
                  className="absolute -right-1 -top-1 h-4 w-4 text-red-600 bg-red-200 rounded-lg"
                />
              </div>
            )}
          </div>

          <div onClick={(e) => e.stopPropagation()}>
            <Options
              onClickEdit={onClickEdit}
              name={name}
              type="Folder"
              id={id}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FolderComponent;
