import { appStore } from '../appStore';
import Toast from '../components/toast';

const defaultErrorToastTimeout = 2000;

const defaultSuccessToastTimeout = 2000;

class ToastHelper {
    success(message: string, toast?: Toast) {
        if (toast) {
            toast.show(message, defaultErrorToastTimeout);
        } else if (appStore.successToast) {
            appStore.successToast.show(message, defaultSuccessToastTimeout);
        }

    }

    error(message: string, toast?: Toast) {
        if (toast) {
            toast.show(message, defaultErrorToastTimeout);
        } else if (appStore.errorToast) {
            appStore.errorToast.show(message, defaultErrorToastTimeout);
        }

    }

    warning(message: string, toast?: Toast) {
        if (toast) {
            toast.show(message, defaultErrorToastTimeout);
        } else if (appStore.warningToast) {
            appStore.warningToast.show(message, defaultErrorToastTimeout);
        }

    }

    info(message: string, toast?: Toast) {
        if (toast) {
            toast.show(message, defaultSuccessToastTimeout);
        } else if (appStore.bottomInfoToast) {
            appStore.bottomInfoToast.show(message, defaultSuccessToastTimeout);
        }
    }

    infoWithCenter(message: string, toast?: Toast) {
        if (toast) {
            toast.show(message, defaultSuccessToastTimeout);
        } else if (appStore.centerInfoToast) {
            appStore.centerInfoToast.show(message, defaultSuccessToastTimeout);
        }
    }

}

export const toastHelper = new ToastHelper();

