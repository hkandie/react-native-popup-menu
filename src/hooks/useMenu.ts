import { useState } from 'react';
import { makeName } from '../helpers/util';

export const useMenu = (menuName: string) => {
    return {
        menuName,
    };
};
