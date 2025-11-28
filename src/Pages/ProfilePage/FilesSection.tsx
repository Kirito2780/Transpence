import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import type { RootState } from "../../Store/Store.tsx";
import FileSectionItem from "./FileSectionItem.tsx";

export type Files = {
  id: number;
  file_name: string;
  uploaded_at: string;
  total_ops: number;
};

interface FileSectionProps {
  files: Files[];
  total_links: number;
}

interface FileSectionPropsJSX {
  modal: boolean;
  setNewChanges: React.Dispatch<React.SetStateAction<boolean>>;
  setModal: (arg: boolean) => void;
}

const FilesSection = ({
  setNewChanges,
  setModal,
  modal,
}: FileSectionPropsJSX) => {
  const token = useSelector((state: RootState) => state.AuthSlice.token);
  const [deleteFile, setDeleteFile] = useState<boolean>(false);
  const [data, setData] = useState<FileSectionProps>();
  const [selectedFile, setSelectedFile] = useState<number[]>([]);
  const [allIds, setAllIds] = useState<number[]>([]);
  const HandleSelection = (id: number) => {
    setSelectedFile((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  useEffect(() => {
    if (token) {
      Fetch();
    }
  }, [token, modal]);

  const Fetch = async () => {
    try {
      const response = await axios("http://172.30.88.250:8000/users/files/", {
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
      });
      const responseResult: FileSectionProps = response.data;
      setData(responseResult);
      setAllIds([...responseResult.files.map((i) => i.id)]);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = () => {
    axios
      .delete("http://172.30.88.250:8000/users/files/", {
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
        data: { id: selectedFile },
      })
      .then((res) => {
        console.log(res);
        setNewChanges((prev) => !prev);
        setSelectedFile([]);
        Fetch();
      })
      .catch((err) => {
        console.log(err);
      });
    setDeleteFile(false);
  };

  return (
    <section className={"ProfileSection"}>
      <div className={"ProfileFilesWrapper"}>
        {deleteFile ? (
          <>
            <h2 className={"ProfileFilesHeader"}>Delete File?</h2>
            <div className={"ProfileFilesButtons"}>
              <button className={"ProfileButtonDelete"} onClick={handleDelete}>
                Yes
              </button>
              <button
                className={"ProfileButton"}
                onClick={() => setDeleteFile(false)}
              >
                No
              </button>
            </div>
          </>
        ) : (
          <>
            {data && (
              <>
                {data.files.length > 0 ? (
                  <>
                    <h2 className={"ProfileFilesHeader"}>Files</h2>
                    <div className={"ProfileFilesItems"}>
                      {data?.files.map((file) => (
                        <FileSectionItem
                          data={file}
                          key={file.id}
                          setSelected={HandleSelection}
                          selected={selectedFile}
                        />
                      ))}
                    </div>
                    <div className={"ProfileFilesItemsButtons"}>
                      <button
                        className={"ProfileButtonFiles"}
                        onClick={() => setSelectedFile(allIds)}
                      >
                        select all
                      </button>
                      <button
                        className={"ProfileButtonFiles"}
                        onClick={() => setSelectedFile([])}
                      >
                        clear all
                      </button>
                    </div>
                    <div className={"ProfileFilesButtons"}>
                      <button
                        className={"ProfileButton"}
                        onClick={() => setModal(true)}
                      >
                        <svg
                          width="20px"
                          height="20px"
                          viewBox="0 0 32 32"
                          version="1.1"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <title>plus</title>
                          <desc>Created with Sketch Beta.</desc>
                          <defs></defs>
                          <g
                            id="Page-1"
                            stroke="none"
                            strokeWidth="1"
                            fill="none"
                            fillRule="evenodd"
                          >
                            <g
                              id="Icon-Set-Filled"
                              transform="translate(-362.000000, -1037.000000)"
                              fill="#34A853 "
                            >
                              <path
                                d="M390,1049 L382,1049 L382,1041 C382,1038.79 380.209,1037 378,1037 C375.791,1037 374,1038.79 374,1041 L374,1049 L366,1049 C363.791,1049 362,1050.79 362,1053 C362,1055.21 363.791,1057 366,1057 L374,1057 L374,1065 C374,1067.21 375.791,1069 378,1069 C380.209,1069 382,1067.21 382,1065 L382,1057 L390,1057 C392.209,1057 394,1055.21 394,1053 C394,1050.79 392.209,1049 390,1049"
                                id="plus"
                              ></path>
                            </g>
                          </g>
                        </svg>
                      </button>
                      <button
                        onClick={() => setDeleteFile(true)}
                        className={
                          selectedFile.length === 0
                            ? "ProfileButtonDeleteDisabled"
                            : "ProfileButtonDelete"
                        }
                        disabled={selectedFile.length == 0}
                      >
                        <svg
                          fill={selectedFile.length === 0 ? "gray" : "#EA4335"}
                          width="30px"
                          height="30px"
                          viewBox="0 0 32 32"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M18.8,16l5.5-5.5c0.8-0.8,0.8-2,0-2.8l0,0C24,7.3,23.5,7,23,7c-0.5,0-1,0.2-1.4,0.6L16,13.2l-5.5-5.5  c-0.8-0.8-2.1-0.8-2.8,0C7.3,8,7,8.5,7,9.1s0.2,1,0.6,1.4l5.5,5.5l-5.5,5.5C7.3,21.9,7,22.4,7,23c0,0.5,0.2,1,0.6,1.4  C8,24.8,8.5,25,9,25c0.5,0,1-0.2,1.4-0.6l5.5-5.5l5.5,5.5c0.8,0.8,2.1,0.8,2.8,0c0.8-0.8,0.8-2.1,0-2.8L18.8,16z" />
                        </svg>
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <h2 className={"ProfileFilesHeader"}>No files to show</h2>
                    <div className={"ProfileFilesNoDataButtonWrapper"}>
                      <button
                        className={"ProfileButton"}
                        onClick={() => setModal(true)}
                      >
                        <svg
                          width="20px"
                          height="20px"
                          viewBox="0 0 32 32"
                          version="1.1"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <title>plus</title>
                          <desc>Created with Sketch Beta.</desc>
                          <defs></defs>
                          <g
                            id="Page-1"
                            stroke="none"
                            strokeWidth="1"
                            fill="none"
                            fillRule="evenodd"
                          >
                            <g
                              id="Icon-Set-Filled"
                              transform="translate(-362.000000, -1037.000000)"
                              fill="#34A853 "
                            >
                              <path
                                d="M390,1049 L382,1049 L382,1041 C382,1038.79 380.209,1037 378,1037 C375.791,1037 374,1038.79 374,1041 L374,1049 L366,1049 C363.791,1049 362,1050.79 362,1053 C362,1055.21 363.791,1057 366,1057 L374,1057 L374,1065 C374,1067.21 375.791,1069 378,1069 C380.209,1069 382,1067.21 382,1065 L382,1057 L390,1057 C392.209,1057 394,1055.21 394,1053 C394,1050.79 392.209,1049 390,1049"
                                id="plus"
                              ></path>
                            </g>
                          </g>
                        </svg>
                      </button>
                    </div>
                  </>
                )}
              </>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default FilesSection;
