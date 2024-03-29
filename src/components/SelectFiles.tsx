import { useEffect, useRef } from "react";

interface Props {
  setFiles: (files: File[]) => void;
}

const SelectFiles = ({ setFiles }: Props) => {
  const ref = useRef<HTMLInputElement>(null);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const targetFiles = e.target.files;
    if (!targetFiles) return;
    const files = [];
    for (const file of targetFiles) {
      files.push(file);
    }
    setFiles(files);
  };

  useEffect(() => {
    if (ref.current) {
      ref.current.setAttribute("directory", "");
      ref.current.setAttribute("webkitdirectory", "true");
    }
  }, [ref]);

  return (
    <>
      <button
        type="button"
        className="rounded-md bg-orange-500 px-3 py-4 font-bold text-white"
        onClick={() => {
          ref.current?.click();
        }}
      >
        Upload folder
      </button>
      <input
        type="file"
        className="hidden"
        ref={ref}
        multiple
        onChange={onChange}
      />
    </>
  );
};

export default SelectFiles;
