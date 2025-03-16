import AdminManager from "../services/AdminManager";
import TickMark from "./icons/TickMark";
import BackButton from "./icons/BackButton";
import CreateButton from "./icons/CreateButton";
import TrashButton from "./icons/TrashButton";
import ResetButton from "./icons/ResetButton";

interface Admin {
  admin: boolean;
  portalId: string | undefined;
  setPortalId: (newValue: string) => void;
  portalIdLock: boolean;
  setPortalIdLock: (newValue: boolean) => void;
  onClickBack: () => void;
}

function AdminView({
  admin,
  portalId,
  setPortalId,
  portalIdLock,
  setPortalIdLock,
  onClickBack,
}: Admin) {
  return (
    admin && (
      <div className="flex justify-center">
        <div className="flex m-8 p-2">
          <div className="grid h-8 mx-8 place-items-center">
            <span className="my-4 text-gray-600 font-sans font-semibold">
              Portal
            </span>
            <div className="flex items-center space-x-2">
              {portalIdLock && BackButton({ onClick: onClickBack })}
              <input
                type="number"
                className="block p-2 border-2 w-full rounded-lg"
                placeholder="input portal id"
                autoComplete="id"
                value={portalId}
                disabled={portalIdLock ? true : undefined}
                onChange={(e) => setPortalId(e.target.value)}
              />
              {portalIdLock && TickMark()}
            </div>
          </div>
          <div className="grid h-8 mx-8 place-items-center">
            <span className="my-4 text-gray-600 font-sans font-semibold">
              Create portal
            </span>
            {CreateButton({
              onClick: async () => {
                const portalId = await AdminManager.create();
                setPortalId(portalId);
              },
            })}
          </div>
          {portalIdLock && (
            <>
              <div className="grid h-8 mx-8 place-items-center">
                <span className="my-4 text-gray-600 font-sans font-semibold">
                  Reset portal
                </span>
                {ResetButton({
                  onClick: async () => {
                    if (portalId) await AdminManager.reset(portalId);
                    setPortalId("");
                    setPortalIdLock(false);
                  },
                })}
              </div>
              <div className="grid h-8 mx-8 place-items-center">
                <span className="my-4 text-gray-600 font-sans font-semibold">
                  Drop portal
                </span>
                {TrashButton({
                  onClick: async () => {
                    if (portalId) await AdminManager.drop(portalId);
                    setPortalId("");
                    setPortalIdLock(false);
                  },
                })}
              </div>
            </>
          )}
        </div>
      </div>
    )
  );
}

export default AdminView;
