import { useEffect, useState } from "react";

interface Props {
  files: { [k: string]: File };
}

const Editor = ({ files }: Props) => {
  const [content, setContent] = useState<{ [k: string]: string }>({});
  const [missmatches, setMissmatches] = useState<string[] | null>(null);

  useEffect(() => {
    const keys = Object.keys(files);
    if (keys.length === 2) {
      keys.map((k) => {
        readFile(files[k], (str) => {
          setContent((prev) => {
            return {
              ...prev,
              [k]: str,
            };
          });
        });
      });
    }
  }, [files]);

  useEffect(() => {
    const contentKeys = Object.keys(content);
    if (contentKeys.length === 2) {
      const values = contentKeys.reduce(
        (prev, current) => {
          const json = JSON.parse(content[current]);
          return {
            ...prev,
            [current]: getJsonObject(json),
          };
        },
        {} as { [k: string]: string[] },
      );
      setMissmatches(
        getUniqueValues(values[contentKeys[0]], values[contentKeys[1]]),
      );
    }
  }, [content]);

  const contentKeys = Object.keys(content);

  if (contentKeys.length < 2 || missmatches === null) {
    return <p>Loading... esperame loco</p>;
  }

  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <h2 className="text-4xl text-red-600">Missmatches loco</h2>
      <ul className="w-1/2 text-white">
        {missmatches.map((m) => {
          return <li>{m}</li>;
        })}
      </ul>
    </div>
  );
};

/*
{filesKeys.map((key, index) => {
  const f = files[key];
  const json = content[key] || "{}";
  const str = JSON.stringify(JSON.parse(json), null, 2);
  return (
    <div
      key={`${index}-${f.name}`}
      className="h-full w-1/2 overflow-y-auto bg-blue-950"
    >
      <CodeEditor value={str} />
    </div>
  );
})}
*/

export default Editor;

const readFile = (f: File, cb: (str: string) => void) => {
  const reader = new FileReader();
  reader.readAsText(f, "UTF-8");
  reader.onload = function (e) {
    cb(e.target?.result?.toString() || "");
  };
};

const createJsonObject = (key: string, json: any, prev: string = "") => {
  if (Array.isArray(json) || typeof json === "string") {
    return prev;
  }
  if (typeof json === "object") {
    const keys = Object.keys(json);
    const results = [];
    for (let i = 0; i < keys.length; i++) {
      results.push(
        createJsonObject(keys[i], json[keys[i]], `${prev}/${keys[i]}`),
      );
    }
    const parsedResults: string[] = results.reduce((prev, current) => {
      if (typeof current === "string") {
        return [...prev, current];
      }
      if (Array.isArray(current)) return [...prev, ...current];
      return [...prev];
    }, [] as string[]);
    return parsedResults;
  }
};

const getJsonObject = (json: any) => {
  const jsonKeys = Object.keys(json);
  const keys = [];
  for (let i = 0; i < jsonKeys.length; i++) {
    const x = createJsonObject(jsonKeys[i], json[jsonKeys[i]], jsonKeys[i]);
    keys.push(...x);
  }
  return keys;
};

const getUniqueValues = (val1: string[], val2: string[]) => {
  const set1 = new Set(val1);
  const set2 = new Set(val2);
  const uniqueValues = [...new Set([...set1].filter((val) => !set2.has(val)))];
  return uniqueValues;
};
