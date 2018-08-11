import React from 'react';
import { createCache, createResource } from 'simple-cache-provider';

function load(image: ImageProps): Promise<void> {
  const { src } = image;
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = resolve;
    image.onerror = reject;
    image.src = src;
  });
}

const resource = createResource(load, ({ src }) => src);
const cache = createCache();

export const Img = props => {
  resource.read(cache, props);

  const { alt, ...rest } = props;
  return <img alt={alt} {...rest} />;
};
