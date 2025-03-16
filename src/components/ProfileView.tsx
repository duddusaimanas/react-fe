import { useCallback, useEffect, useState } from "react";
import ProfileManager from "../services/ProfileManager";
import Spinner from "./icons/Spinner";
import AdminView from "./AdminView";
import TickMark from "./icons/TickMark";
import BackButton from "./icons/BackButton";
import Pud from "../services/entity/Pud";
import ProfileIcon from "./icons/ProfileIcon";
import EditButton from "./icons/EditButton";

interface Profile {
  profileView: boolean;
  profileStatus: Pud;
  setProfileStatus: (newValue: Pud) => void;
}

function ProfileView({
  profileView,
  profileStatus,
  setProfileStatus,
}: Profile) {
  const [profileLoaded, setProfileLoaded] = useState(false);

  useEffect(() => {
    if (!profileView) {
      setProfileStatus({ ...profileStatus, status: "" });
      setProfileLoaded(false);
      setNameSpinner(false);
      setStatusSpinner(false);
    }
  }, [profileStatus, profileView, setProfileStatus]);

  const [newName, setNewName] = useState("");
  const [updateNamePopup, setUpdateNamePopup] = useState(false);
  const [nameSpinner, setNameSpinner] = useState(false);

  const [newStatus, setNewStatus] = useState("");
  const [updateStatusPopup, setUpdateStatusPopup] = useState(false);
  const [statusSpinner, setStatusSpinner] = useState(false);

  const [portalId, setPortalId] = useState("");
  const [portalIdLock, setPortalIdLock] = useState(false);
  const [enrollLock, setEnrollLock] = useState(false);

  const onProfileLoad = useCallback(
    async (id: string) => {
      const id1 = id === "" ? undefined : id;
      const status = await ProfileManager.status(id1);
      if (!status === false) {
        setProfileStatus(status);
        setNewName(status.name);
        setNewStatus("");
        if (status.status != null) setEnrollLock(true);
        if (id1) {
          const portalIdLock = await ProfileManager.portal(id);
          if (portalIdLock) setPortalIdLock(true);
        }
      }
    },
    [setProfileStatus]
  );

  useEffect(() => {
    onProfileLoad(portalId);
  }, [profileLoaded, onProfileLoad, portalId]);

  useEffect(() => {
    setProfileLoaded(true);
  }, []);

  const onCLickBack = () => {
    setProfileStatus({ ...profileStatus, status: "" });
    setPortalId("");
    setEnrollLock(false);
    setPortalIdLock(false);
  };

  return (
    <div className="animate-fade">
      <AdminView
        admin={profileStatus.admin}
        portalId={portalId}
        setPortalId={setPortalId}
        portalIdLock={portalIdLock}
        setPortalIdLock={setPortalIdLock}
        onClickBack={onCLickBack}
      />
      <div className="flex m-24 items-center justify-center space-x-8">
        {ProfileIcon()}
        {profileLoaded && (
          <table className="table-fixed shadow-lg rounded">
            <tbody className="divide-y">
              <tr className="odd:bg-teal-50 h-8">
                <td className="px-6 py-4 text-gray-600 drop-shadow-sm font-sans font-bold">
                  Id
                </td>
                <td className="px-6 py-4"></td>
                <td className="px-6 py-4 text-gray-600 drop-shadow-sm font-sans font-semibold">
                  {profileStatus.id}
                </td>
                <td className="px-6 py-4"></td>
              </tr>
              <tr className="odd:bg-teal-50 h-8">
                <td className="px-6 py-4 text-gray-600 drop-shadow-sm font-sans font-bold">
                  Username
                </td>
                <td className="px-6 py-4"></td>
                <td className="px-6 py-4 text-gray-600 drop-shadow-sm font-sans font-semibold">
                  {profileStatus.username}
                </td>
                <td className="px-6 py-4"></td>
              </tr>
              <tr className="odd:bg-teal-50 h-8">
                <td className="px-6 py-4 text-gray-600 drop-shadow-sm font-sans font-bold">
                  Name
                </td>
                {updateNamePopup ? (
                  <>
                    <td className="px-6 py-4">
                      {BackButton({
                        onClick: () => setUpdateNamePopup(false),
                      })}
                    </td>
                    <td className="px-6 py-4 flex place-items-center space-x-2">
                      <input
                        type="text"
                        className="block p-2 text-gray-600 font-sans font-semibold"
                        placeholder="input name"
                        autoComplete="name"
                        value={newName}
                        onChange={(e) => {
                          setNewName(e.target.value);
                        }}
                      />
                    </td>
                    <td align="center" className="px-6 py-4">
                      <button
                        className={`${
                          profileStatus.name === newName
                            ? "text-gray-600"
                            : "hover:text-fuchsia-500 text-fuchsia-600 hover:translate-y-px"
                        } font-sans font-semibold`}
                        disabled={
                          profileStatus.name === newName ? true : undefined
                        }
                        onClick={async () => {
                          setNameSpinner(true);
                          await ProfileManager.updateName(
                            profileStatus.name,
                            newName
                          );
                          await onProfileLoad(portalId);
                          setUpdateNamePopup(false);
                          setNameSpinner(false);
                        }}
                      >
                        {nameSpinner ? Spinner() : "Submit"}
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="px-6 py-4"></td>
                    <td className="px-6 py-4 text-gray-600 drop-shadow-sm font-sans font-semibold">
                      {profileStatus.name}
                    </td>
                    <td align="center" className="px-6 py-4">
                      {EditButton({ onClick: () => setUpdateNamePopup(true) })}
                    </td>
                  </>
                )}
              </tr>
              <tr className="odd:bg-teal-50 h-8">
                <td className="px-6 py-4 text-gray-600 drop-shadow-sm font-sans font-bold">
                  Status
                </td>
                {portalIdLock && updateStatusPopup ? (
                  <>
                    <td className="px-6 py-4">
                      {BackButton({
                        onClick: () => setUpdateStatusPopup(false),
                      })}
                    </td>
                    <td className="px-6 py-4 flex place-items-center space-x-2">
                      <select
                        className="text-gray-600 drop-shadow-sm font-sans font-semibold"
                        name="statusDropdown"
                        id="statusDropdown"
                        onChange={(e) => setNewStatus(e.target.value)}
                      >
                        <option
                          className="text-gray-600 drop-shadow-sm font-sans font-semibold"
                          value="ABSENT"
                        >
                          ABSENT
                        </option>
                        <option
                          className="text-gray-600 drop-shadow-sm font-sans font-semibold"
                          value="PRESENT"
                        >
                          PRESENT
                        </option>
                      </select>
                    </td>
                    <td align="center" className="px-6 py-4">
                      <button
                        className={`${
                          profileStatus.status === newStatus || newStatus == ""
                            ? "text-gray-600"
                            : "hover:text-fuchsia-500 text-fuchsia-600 hover:translate-y-px"
                        } font-sans font-semibold`}
                        disabled={
                          (profileStatus.status === newStatus
                            ? true
                            : undefined) || newStatus == ""
                        }
                        onClick={async () => {
                          setStatusSpinner(true);
                          await ProfileManager.markStatus(portalId, newStatus);
                          await onProfileLoad(portalId);
                          setUpdateStatusPopup(false);
                          setStatusSpinner(false);
                        }}
                      >
                        {statusSpinner ? Spinner() : "Submit"}
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="px-6 py-4"></td>
                    <td className="px-6 py-4 text-gray-600 drop-shadow-sm font-sans font-semibold">
                      {profileStatus.status}
                    </td>
                    {portalIdLock && profileStatus.status != null ? (
                      <td align="center" className="px-6 py-4">
                        {EditButton({
                          onClick: () => setUpdateStatusPopup(true),
                        })}
                      </td>
                    ) : (
                      <td className="px-6 py-4"></td>
                    )}
                  </>
                )}
              </tr>
              {!profileStatus.admin && (
                <tr className="odd:bg-teal-50 h-8">
                  <td className="px-6 py-4 text-gray-600 drop-shadow-sm font-sans font-bold">
                    Portal
                  </td>
                  {portalIdLock ? (
                    <td className="px-6 py-4">
                      {BackButton({ onClick: onCLickBack })}
                    </td>
                  ) : (
                    <td className="px-6 py-4"></td>
                  )}
                  <td className="px-6 py-4 flex place-items-center space-x-2">
                    <input
                      type="number"
                      className="block p-2 border-2 w-full rounded-lg"
                      placeholder="input portal id"
                      value={portalId}
                      disabled={portalIdLock ? true : undefined}
                      onChange={(e) => setPortalId(e.target.value)}
                    />
                  </td>
                  {portalIdLock && !enrollLock ? (
                    <td className="px-6 py-4" align="center">
                      <button
                        onClick={async () => {
                          const isEnrolled = await ProfileManager.enroll(
                            portalId
                          );
                          if (isEnrolled) {
                            setEnrollLock(true);
                            await onProfileLoad(portalId);
                          }
                        }}
                        className="text-sky-600 hover:text-sky-500 font-sans font-semibold"
                      >
                        Enroll
                      </button>
                    </td>
                  ) : (
                    <td className="px-6 py-4"> {portalIdLock && TickMark()}</td>
                  )}
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default ProfileView;
