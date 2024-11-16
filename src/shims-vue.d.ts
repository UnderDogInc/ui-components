/// <reference types="vite/client" />

declare module '*.vue' {
  import { DefineComponent } from 'vue'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>
  export default component
}


declare module 'vue-yandex-maps' {
  const yandexMap: any
  const ymapMarker: any
  export {
    yandexMap,
    ymapMarker
  }
}

declare module 'quill-image-resize' {
  const any: any
  export default any
}
declare module 'quill-image-uploader' {
  const any: any
  export default any
}
declare module 'v3-infinite-loading' {
  const any: any
  export default any
}