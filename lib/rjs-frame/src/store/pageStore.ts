import { atom } from 'nanostores';
import { generate } from 'short-uuid';
import { PageState } from '../types/PageState';

const createInitialState = (): PageState => ({
  name: '',
  time: new Date().toISOString(),
  args: [],
  link_state: {},
  vars_state: {
    _id: generate()
  },
  priv_state: {},
  auth: {},
  other: {}
});

export const pageStore = atom<PageState>(createInitialState());

export const updatePageState = (updater: (state: PageState) => PageState) => {
  pageStore.set(updater(pageStore.get()));
};

export const resetPageState = () => {
  pageStore.set(createInitialState());
}; 