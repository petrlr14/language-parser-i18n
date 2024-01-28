import { useState } from "react";

interface Props {
  name: string;
  files: File[];
  setSelectedFile: (f: File) => void;
  selectedFiles: { [k: string]: File };
}

const FolderButton = ({
  files,
  name,
  selectedFiles,
  setSelectedFile,
}: Props) => {
  const [listStatus, setListStatus] = useState<"closed" | "open">("open");
  return (
    <div className="w-full">
      <button
        className="w-full bg-red-500 px-2 py-2 text-start"
        onClick={() => {
          if (listStatus === "closed") {
            setListStatus("open");
          }
          if (listStatus === "open") {
            setListStatus("closed");
          }
        }}
      >
        {name}
      </button>
      {listStatus === "open" && (
        <ul className="flex flex-col gap-2 pl-5 pt-3">
          {files.map((f) => {
            const key = `${f.webkitRelativePath}-${f.name}`;

            const isSelected = selectedFiles[key];
            return (
              <li key={`item-${key}`}>
                <button
                  className={`${isSelected ? "text-orange-500" : "text-white"}`}
                  onClick={() => {
                    setSelectedFile(f);
                  }}
                >
                  {f.name}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default FolderButton;
