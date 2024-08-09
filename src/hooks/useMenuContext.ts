import { useContext } from 'react';
import { PopupMenuContext } from '../molecules/MenuProvider';

export const useMenuContext = () => useContext(PopupMenuContext);
