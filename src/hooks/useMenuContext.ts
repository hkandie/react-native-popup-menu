import { useContext } from "react";
import { MenuContext } from "../molecules/MenuProvider";

export const useMenuContext = () => useContext(MenuContext);
