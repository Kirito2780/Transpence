import "./ProfilePage.css";
import "../Main Page/MainPage.css";
import ProfileSection from "./ProfileSection.tsx";
import StatsSection from "./StatsSection.tsx";
import FilesSection from "./FilesSection.tsx";
import ChartSection from "./ChartSection.tsx";
import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import Modal from "../../Components/Modal/Modal.tsx";
import { type SubmitHandler, useForm } from "react-hook-form";
import axios from "axios";
import { useSelector } from "react-redux";
import type { RootState } from "../../Store/Store.tsx";
import { Message } from "../../Components/Message/Message.tsx";
import { HistorySection } from "./HistorySection.tsx";
import { HistoryFilterModal } from "./HistoryFilterModal.tsx";

interface IProfilePageForm {
  file?: FileList;
}
interface HistoryFilters {
  date_start: string;
  date_end: string;
  tags: string[];
}

const ProfilePage = () => {
  const { register, handleSubmit } = useForm<IProfilePageForm>({
    mode: "onBlur",
  });
  const token = useSelector((state: RootState) => state.AuthSlice.token);
  const [modal, setModal] = useState(false);
  const [modalChildren, setModalChildren] = useState<string>("File");
  const [file, setFile] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [handleChanges, setChanges] = useState<boolean>(false);
  const [message, setMessage] = useState<boolean>(false);
  const [messageText, setMessageText] = useState<string>("");
  const [error, setError] = useState<boolean>(false);
  const [unwrapped, setUnwrapped] = useState(false);
  const [filters, setFilters] = useState<HistoryFilters | null>(null);

  const handleAddFile: SubmitHandler<IProfilePageForm> = async (data) => {
    try {
      const formData = new FormData();
      if (data.file) {
        Array.from(data.file).forEach((item) => {
          formData.append("file", item);
        });
        setFile(true);
      }
      console.log(formData);
      const request = await axios.post(
        "http://172.30.88.250:8000/users/files/",
        formData,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        },
      );
      const response = request.data;
      setMessageText(response.message);
      setLoading(false);
      setMessage(true);
      setModal(false);
      setChanges((prev) => !prev);
      setFile(false);
      console.log(response);
    } catch (e) {
      console.log(e);
      setError(true);
    }
  };

  useEffect(() => {
    if (message) {
      setTimeout(() => {
        setMessage(false);
      }, 4000);
    }
  }, [message]);

  return (
    <div>
      <Message error={error} setOpen={setMessage} open={message}>
        {messageText}
      </Message>
      <Modal open={modal}>
        {modalChildren == "File" && (
          <>
            <div className={"ModalCloseWrapper"}>
              <button className={"ModalClose"} onClick={() => setModal(false)}>
                x
              </button>
            </div>
            <form
              onSubmit={handleSubmit(handleAddFile)}
              className={"ProfilePageForm"}
            >
              <h2 className={"ModalHeader"}>Add a new file</h2>
              <label className={"ProfilePageFile"} htmlFor={"fileUpload"}>
                {file ? <span>File uploaded</span> : <span>Choose file</span>}
              </label>
              <input
                type="file"
                id={"fileUpload"}
                multiple={true}
                accept={".xlsx"}
                {...register("file", {
                  onChange: (e) => {
                    const file = e.target.files;
                    if (file) setFile(true);
                  },
                })}
                disabled={loading}
              />
              <button type={"submit"} className={"ModalDone"}>
                Done
              </button>
            </form>
          </>
        )}

        {modalChildren == "Filter" && (
          <div>
            <div className={"ModalCloseWrapper"}>
              <button className={"ModalClose"} onClick={() => setModal(false)}>
                x
              </button>
            </div>
            <HistoryFilterModal
              onApply={(filters) => {
                setFilters(filters);
                setChanges((prev) => !prev);
              }}
              onClose={() => setModal(false)}
            />
          </div>
        )}
      </Modal>
      <header>
        <h1 className={"MainTitlePage"}>
          <NavLink to={"/"} className={"nav-link"}>
            <span className={"MainTitleFirstPage"}>Trans</span>
            <span className={"MainTitleSecondPage"}>pence</span>
          </NavLink>
        </h1>
      </header>
      <main>
        <div className={"ProfilePageContent"}>
          <div className={"ProfileLeft"}>
            <div className={"ProfileTop"}>
              <ProfileSection
                setMessage={setMessage}
                setTextMessage={setMessageText}
                setError={setError}
                setChanges={setChanges}
              />
              <StatsSection modal={modal} changes={handleChanges} />
            </div>
            <div className={"ProfileBottom"}>
              <ChartSection modal={modal} changes={handleChanges} />
            </div>
          </div>
          <div className={"ProfileRight"}>
            <FilesSection
              setModalChildren={setModalChildren}
              modal={modal}
              setModal={setModal}
              setNewChanges={setChanges}
              setMessage={setMessage}
              setTextMessage={setMessageText}
              setError={setError}
              unwrapped={unwrapped}
            />
            <HistorySection
              unwrapped={unwrapped}
              setModalChildren={setModalChildren}
              setModal={setModal}
              setUnwrapped={setUnwrapped}
              changes={handleChanges}
              filters={filters}
              setMessage={setMessage}
              setTextMessage={setMessageText}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
