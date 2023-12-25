"use client";

import { isEmpty, map } from "lodash";
import FileViewer from "@/components/File";
import Folder from "@/components/Folder";
import { cn } from "@/lib/utils";

interface Props {
  folders: any;
  files: any;
  layout: string;
}

const RenderData: React.FC<Props> = ({ folders, files, layout }) => {
  const getClassNames = () => {
    if (layout == "grid") {
      return "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-6";
    } else {
      return;
    }
  };

  return (
    <div className="w-full">
      <div className="p-4 h-full w-full mb-20">
        {/* Folders */}
        {!isEmpty(folders) && layout == "grid" && (
          <h1 className="text-slate-900 text-md font-semibold">Folders</h1>
        )}
        <div className={getClassNames()}>
          {map(folders, (folder) => {
            return (
              <div
                className={`${cn(layout == "grid" ? "p-4" : "p-1", "w-full")}`}
                key={folder.id}
              >
                <Folder name={folder.name} id={folder.id} layout={layout} />
              </div>
            );
          })}
        </div>

        {/* Files */}
        {!isEmpty(files) && layout == "grid" && (
          <h1 className="text-slate-900 text-md font-semibold">Files</h1>
        )}
        <div className={getClassNames()}>
          {map(files, (file) => {
            return (
              <div
                className={`${cn(layout == "grid" ? "p-4" : "p-1", "w-full")}`}
                key={file.id}
              >
                <FileViewer
                  id={file.id}
                  name={file.name}
                  url={file.uploadedURL}
                  layout={layout}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RenderData;
