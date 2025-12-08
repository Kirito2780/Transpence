import "./ProfilePage.css";
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

interface IProfilePageForm {
  file?: FileList;
}

const ProfilePage = () => {
  const { register, handleSubmit } = useForm<IProfilePageForm>({
    mode: "onBlur",
  });
  const token = useSelector((state: RootState) => state.AuthSlice.token);
  const [modal, setModal] = useState(false);
  const [file, setFile] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [handleChanges, setChanges] = useState<boolean>(false);
  const [message, setMessage] = useState<boolean>(false);
  const [messageText, setMessageText] = useState<string>("");
  const [error, setError] = useState<boolean>(false);

  const handleAddFile: SubmitHandler<IProfilePageForm> = async (data) => {
    try {
      const formData = new FormData();
      if (data.file) {
        formData.append("file", data.file[0]);
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
      </Modal>
      <header>
        <h1 className={"MainTitle"}>
          <NavLink to={"/"} className={"nav-link"}>
            <span className={"MainTitleFirst"}>Trans</span>
            <span className={"MainTitleSecond"}>pence</span>
          </NavLink>
        </h1>
      </header>
      <main className={"ProfileContainer"}>
        <div className={"ProfileTop"}>
          <ProfileSection
            setMessage={setMessage}
            setTextMessage={setMessageText}
            setError={setError}
          />
          <StatsSection modal={modal} changes={handleChanges} />
          <FilesSection
            modal={modal}
            setModal={setModal}
            setNewChanges={setChanges}
            setMessage={setMessage}
            setTextMessage={setMessageText}
            setError={setError}
          />
        </div>
        <div className={"ProfileBottom"}>
          <ChartSection modal={modal} changes={handleChanges} />
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
