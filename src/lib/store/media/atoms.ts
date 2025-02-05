import { atomFamily } from 'recoil';

export const imageLoadingState = atomFamily<boolean, string>({
  key: 'media/imageLoadingState',
  default: false,
});

export const videoLoadingState = atomFamily<boolean, string>({
  key: 'media/videoLoadingState',
  default: false,
});

export const codeCopyState = atomFamily<boolean, string>({
  key: 'media/codeCopyState',
  default: false,
});