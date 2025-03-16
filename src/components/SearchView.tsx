import { useCallback, useEffect, useState } from "react";
import Pud from "../services/entity/Pud";
import SearchButton from "./icons/SearchButton";
import ProfileManager from "../services/ProfileManager";
import Sorting from "../services/Sorting";
import SearchResultType from "../services/entity/SearchResultType";

interface Search {
  profileStatus: Pud;
  searchItem: string;
  setSearchItem: (newValue: string) => void;
  setSearchResultView: (newValue: boolean) => void;
  setSearchResultValue: (newValue: Pud | undefined) => void;
  setSearchResultType: (newValue: SearchResultType | undefined) => void;
}

function SearchView({
  searchItem,
  setSearchItem,
  setSearchResultView,
  setSearchResultValue,
  setSearchResultType,
}: Search) {
  const [allStatus, setAllStatus] = useState<Pud[]>([]);

  const [showSearchItem, setShowSearchItem] = useState(false);

  const cleanupSearch = () => {
    setAllStatus([]);
    setShowSearchItem(false);
  };

  const isPortalId = useCallback(() => {
    return (
      searchItem.length > 11 &&
      searchItem.length < 15 &&
      typeof parseInt(searchItem) == "number"
    );
  }, [searchItem]);

  const loadUsers = useCallback(async () => {
    if (searchItem.length > 0) {
      if (isPortalId()) {
        const portalIdLock = await ProfileManager.portal(searchItem);
        if (portalIdLock) {
          const statuses = await ProfileManager.statusByPortal(searchItem);
          if (!statuses === false && statuses.length > 0) {
            setAllStatus(statuses);
            setSearchResultType(SearchResultType.PORTAL);
            setShowSearchItem(true);
          } else cleanupSearch();
        } else cleanupSearch();
      } else {
        const statuses = await ProfileManager.statuses();
        if (!statuses === false && statuses.length > 0) {
          setAllStatus(Sorting.sort(searchItem, statuses));
          setSearchResultType(SearchResultType.FOREIGN_PROFILE);
          setShowSearchItem(true);
        } else cleanupSearch();
      }
    } else cleanupSearch();
  }, [isPortalId, searchItem, setSearchResultType]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers, searchItem]);

  return (
    <>
      <input
        type="text"
        className="p-2 text-gray-600 border font-sans font-semibold rounded-l-lg"
        placeholder="search"
        value={searchItem}
        onClick={() => {
          if (allStatus.length > 0) {
            setShowSearchItem(true);
          }
        }}
        onChange={async (e) => {
          setSearchItem(e.target.value);
        }}
      />
      <button
        id="SearchButton"
        className="mr-8 p-2 border bg-white shadow-lg rounded-r-lg"
      >
        {SearchButton({
          onClick: () => {
            if (allStatus.length > 0) {
              setShowSearchItem(true);
            }
          },
        })}
      </button>
      {showSearchItem && (
        <>
          <ul className="absolute p-2 animate-fade bg-white border-2 shadow-lg rounded-b-lg z-50">
            {allStatus.map((a: Pud) => (
              <li
                id={a.id}
                key={a.id}
                onClick={() => {
                  setSearchResultValue(a);
                  setSearchResultView(true);
                  setSearchItem("");
                  cleanupSearch();
                }}
                className="text-gray-600 block font-sans font-semibold"
              >
                {a.id.includes(searchItem)
                  ? "Id: ".concat(a.id)
                  : a.name.includes(searchItem)
                  ? "Name: ".concat(a.name)
                  : searchItem}
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  );
}

export default SearchView;
