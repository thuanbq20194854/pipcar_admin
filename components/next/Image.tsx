import { default as NextImage, ImageProps } from 'next/image';

export type TImageProps = ImageProps;

function Image(props: TImageProps) {
  return <NextImage sizes='(max-width: 768px) 100vw,(max-width: 1200px) 50vw,33vw' {...props} />;
}

export default Image;
