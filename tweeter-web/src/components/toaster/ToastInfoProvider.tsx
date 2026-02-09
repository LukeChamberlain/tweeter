import { useCallback, useMemo, useState, useRef } from "react";
import { Toast, ToastType } from "./Toast";
import PropTypes from "prop-types";
import { ToastListContext, ToastActionsContext } from "./ToastContexts";
import {
  ToastInfoPresenter,
  ToastInfoProviderView,
} from "../../presenter/ToastInfoProviderPresenter";

interface Props {
  children: React.ReactNode;
}

const ToastInfoProvider: React.FC<Props> = ({ children }) => {
  const [toastList, setToastList] = useState<Toast[]>([]);

  const view: ToastInfoProviderView = useMemo(
    () => ({
      setToastList: (toastList: Toast[]) => setToastList(toastList),
    }),
    []
  );

  const presenterRef = useRef<ToastInfoPresenter | null>(null);
  if (!presenterRef.current) {
    presenterRef.current = new ToastInfoPresenter(view);
  }

  const displayExistingToast = useCallback(
    (toast: Toast) => {
      presenterRef.current!.displayExistingToast(toast, toastList);
    },
    [toastList]
  );

  const displayToast = useCallback(
    (
      toastType: ToastType,
      message: string,
      duration: number,
      title?: string,
      bootstrapClasses?: string
    ): string => {
      return presenterRef.current!.displayToast(
        toastType,
        message,
        duration,
        toastList,
        title,
        bootstrapClasses
      );
    },
    [toastList]
  );

  const deleteToast = useCallback(
    (id: string) => {
      presenterRef.current!.deleteToast(id, toastList);
    },
    [toastList]
  );

  const deleteAllToasts = useCallback(() => {
    presenterRef.current!.deleteAllToasts();
  }, []);

  const toastActions = useMemo(
    () => ({
      displayExistingToast,
      displayToast,
      deleteToast,
      deleteAllToasts,
    }),
    [displayExistingToast, displayToast, deleteToast, deleteAllToasts]
  );

  return (
    <ToastListContext.Provider value={toastList}>
      <ToastActionsContext.Provider value={toastActions}>
        {children}
      </ToastActionsContext.Provider>
    </ToastListContext.Provider>
  );
};

ToastInfoProvider.propTypes = {
  children: PropTypes.element.isRequired,
};

export default ToastInfoProvider;