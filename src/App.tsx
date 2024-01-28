import { useState } from "react";
import SelectFiles from "./components/SelectFiles";
import EmptyEditor from "./components/EmptyEditor";
import FolderButton from "./components/FolderButton";
import Editor from "./components/Editor";

function App() {
  const [files, _setFiles] = useState<FileListObj>({});
  const [selectedFiles, _setSelectedFiles] = useState<{ [k: string]: File }>(
    {},
  );

  const setFiles = (file: File[]) => {
    const newFiles = file.reduce((prev, current): FileListObj => {
      const path = current.webkitRelativePath.replace(`/${current.name}`, "");
      if (prev[path]) {
        return {
          ...prev,
          [path]: {
            id: path,
            files: [...prev[path].files, current],
          },
        };
      }
      return {
        ...prev,
        [path]: {
          id: path,
          files: [current],
        },
      };
    }, {} as FileListObj);
    _setFiles(newFiles);
  };

  const setSelectedFiles = (f: File) => {
    const key = `${f.webkitRelativePath}-${f.name}`;
    const keys = Object.keys(selectedFiles);
    if (selectedFiles[key]) {
      _setSelectedFiles(
        keys
          .filter((k) => k !== key)
          .reduce((prev, current) => {
            return {
              ...prev,
              [current]: selectedFiles[current],
            };
          }, {}),
      );
    } else {
      if (keys.length === 2) {
        _setSelectedFiles({
          [key]: f,
        });
        return;
      }
      _setSelectedFiles({
        ...selectedFiles,
        [key]: f,
      });
    }
  };

  const filesKeys = Object.keys(files);
  const showUploadButton = filesKeys.length === 0;
  const showEmptyEditor =
    !showUploadButton && Object.keys(selectedFiles).length < 2;
  const showEditor = !showEmptyEditor && !showUploadButton;

  return (
    <div className="flex h-screen max-h-screen w-full max-w-[100vw] overflow-hidden bg-[#353935]">
      <aside className="flex h-full w-1/5 flex-col gap-4 bg-[#28282B]">
        <h1 className="bg-orange-500 px-1 py-4 text-center text-xl text-white">
          Language Validator
        </h1>
        {filesKeys.length > 0 && (
          <div className="h-full overflow-y-auto">
            {filesKeys.map((key) => {
              const folder = files[key];
              return (
                <FolderButton
                  key={key}
                  files={folder.files}
                  name={key}
                  setSelectedFile={setSelectedFiles}
                  selectedFiles={selectedFiles}
                />
              );
            })}
          </div>
        )}
      </aside>
      <div className="flex h-full w-full items-center justify-center">
        {showUploadButton && <SelectFiles setFiles={setFiles} />}
        {showEmptyEditor && <EmptyEditor />}
        {showEditor && <Editor files={selectedFiles} />}
      </div>
    </div>
  );
}

export default App;

interface FileListObj {
  [k: string]: {
    id: string;
    files: File[];
  };
}
