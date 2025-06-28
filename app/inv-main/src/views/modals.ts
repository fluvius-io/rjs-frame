import { ModalViewSwitcher, UserProfileModal } from "rjs-admin";
import AlgoModal from "./AlgoModal";

ModalViewSwitcher.registerView("profile", UserProfileModal);
ModalViewSwitcher.registerView("algo", AlgoModal);
