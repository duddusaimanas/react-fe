import { useCallback, useEffect, useState } from "react";
import Pud from "../services/entity/Pud";
import AdminManager from "../services/AdminManager";
import Spinner from "./icons/Spinner";
import EditButton from "./icons/EditButton";
import BackButton from "./icons/BackButton";
import ProfileManager from "../services/ProfileManager";
import SearchButton from "./icons/SearchButton";
import Sorting from "../services/Sorting";
import SearchResultType from "../services/entity/SearchResultType";

interface SearchResult {
  profileStatus: Pud;
  searchResultView: boolean;
  searchResultValue: Pud | undefined;
  searchResultType: SearchResultType | undefined;
  searchItem: string;
}

function SearchResultView({
  profileStatus,
  searchResultView,
  searchResultValue,
  searchResultType,
  searchItem,
}: SearchResult) {
  const [allStatus, setAllStatus] = useState<Pud[]>([]);
  const [tempSort, setTempSort] = useState<Pud[]>([]);

  const [newStatus, setNewStatus] = useState("");
  const [statusSpinner, setStatusSpinner] = useState(false);
  const [updateStatusPopup, setUpdateStatusPopup] = useState(false);

  const [localId, setLocalId] = useState("");

  const loadUsers = useCallback(async () => {
    if (searchResultType === SearchResultType.PORTAL) {
      const users = await ProfileManager.statusByPortal(searchItem);
      if (!users === false && users.length > 0) {
        setLocalId(searchItem);
        setAllStatus(users);
        setTempSort(users);
      }
    }
    if (searchResultType === SearchResultType.FOREIGN_PROFILE) {
      setLocalId("");
      setAllStatus([]);
      setTempSort([]);
    }
  }, [searchItem, searchResultType]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers, searchItem]);

  const [tabularSearch, setTabularSearch] = useState("");
  const [expandSearch, setExpandSearch] = useState(false);

  return (
    <div className="animate-fade grid m-24 place-items-center justify-center space-x-8">
      {searchResultView &&
        searchResultType === SearchResultType.PORTAL &&
        localId.length > 0 && (
          <>
            <div className="flex h-8 place-items-center justify-center space-x-4">
              {expandSearch ? (
                <>
                  {BackButton({
                    onClick: () => {
                      setExpandSearch(false);
                      setTabularSearch("");
                    },
                  })}
                  <input
                    type="text"
                    className="p-2 border-2 w-full rounded-lg"
                    placeholder="search"
                    autoComplete="id"
                    value={tabularSearch}
                    onChange={(e) => {
                      setTabularSearch(e.target.value);
                      if (e.target.value.length > 0) {
                        setTempSort(allStatus);
                        const sort = Sorting.sort(e.target.value, tempSort);
                        setTempSort(sort);
                      } else {
                        setTempSort(allStatus);
                      }
                    }}
                  />
                </>
              ) : (
                SearchButton({ onClick: () => setExpandSearch(true) })
              )}
            </div>

            <table className="table-auto w-fit shadow-lg rounded">
              <caption className="px-6 m-4 py-4 text-gray-600 drop-shadow-sm font-sans font-bold">
                Portal {'"' + localId + '"'}
              </caption>
              <thead className="px-6 py-4 text-gray-600 drop-shadow-sm font-sans font-bold">
                <tr>
                  <th className="px-6 py-4 text-gray-600 drop-shadow-sm font-sans font-semibold">
                    Id
                  </th>
                  <th className="px-6 py-4 text-gray-600 drop-shadow-sm font-sans font-semibold">
                    Name
                  </th>
                  <th className="px-6 py-4"></th>
                  <th className="px-6 py-4 text-gray-600 drop-shadow-sm font-sans font-semibold">
                    Status
                  </th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {tempSort.map((a: Pud) => (
                  <tr key={a.id} className="odd:bg-teal-50 h-8">
                    <td className="px-6 py-4 text-gray-600 drop-shadow-sm font-sans font-semibold">
                      {a.id}
                    </td>
                    <td className="px-6 py-4 text-gray-600 drop-shadow-sm font-sans font-semibold">
                      {a.name}
                    </td>
                    {updateStatusPopup ? (
                      <>
                        <td className="px-6 py-4">
                          {BackButton({
                            onClick: () => setUpdateStatusPopup(false),
                          })}
                        </td>
                        <td className="px-6 py-4">
                          <select
                            className="text-gray-600 drop-shadow-sm font-sans font-semibold"
                            name="statusDropdown"
                            id="statusDropdown"
                            onChange={async (e) => {
                              setNewStatus(e.target.value);
                            }}
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
                              a.status === newStatus || newStatus === ""
                                ? "text-gray-600"
                                : "hover:text-fuchsia-500 text-fuchsia-600 hover:translate-y-px"
                            } font-sans font-semibold`}
                            disabled={
                              (a.status === newStatus ? true : undefined) ||
                              (newStatus === "" ? true : undefined)
                            }
                            onClick={async () => {
                              setStatusSpinner(true);
                              await AdminManager.markById(
                                localId,
                                a.id,
                                newStatus
                              );
                              await loadUsers();
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
                          {a.status}
                        </td>
                        <td className="px-6 py-4">
                          {(profileStatus.admin || a.id === profileStatus.id) &&
                            EditButton({
                              onClick: () => setUpdateStatusPopup(true),
                            })}
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      {searchResultView &&
        searchResultType === SearchResultType.FOREIGN_PROFILE &&
        searchResultValue && (
          <table className="table-fixed shadow-lg rounded">
            <tbody className="divide-y">
              <tr className="odd:bg-teal-50 h-8">
                <td className="px-6 py-4 text-gray-600 drop-shadow-sm font-sans font-bold">
                  Id
                </td>
                <td className="px-6 py-4"></td>
                <td className="px-6 py-4 text-gray-600 drop-shadow-sm font-sans font-semibold">
                  {searchResultValue.id}
                </td>
                <td className="px-6 py-4"></td>
              </tr>
              <tr className="odd:bg-teal-50 h-8">
                <td className="px-6 py-4 text-gray-600 drop-shadow-sm font-sans font-bold">
                  Username
                </td>
                <td className="px-6 py-4"></td>
                <td className="px-6 py-4 text-gray-600 drop-shadow-sm font-sans font-semibold">
                  {searchResultValue.username}
                </td>
                <td className="px-6 py-4"></td>
              </tr>
              <tr className="odd:bg-teal-50 h-8">
                <td className="px-6 py-4 text-gray-600 drop-shadow-sm font-sans font-bold">
                  Name
                </td>
                <td className="px-6 py-4"></td>
                <td className="px-6 py-4 text-gray-600 drop-shadow-sm font-sans font-semibold">
                  {searchResultValue.name}
                </td>
              </tr>
            </tbody>
          </table>
        )}
    </div>
  );
}

export default SearchResultView;
