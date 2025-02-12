import { h, defineComponent, inject, VNode, CSSProperties, computed } from 'vue'
import { throwError } from '../../_utils'
import { uploadInjectionKey } from './interface'
import NUploadFile from './UploadFile'
import { NImageGroup } from '../../image'
import { NFadeInExpandTransition } from '../../_internal'
import NUploadTrigger from './UploadTrigger'

export default defineComponent({
  name: 'UploadFileList',
  setup (_, { slots }) {
    const NUpload = inject(uploadInjectionKey, null)
    if (!NUpload) {
      throwError(
        'upload-file-list',
        '`n-upload-file-list` must be placed inside `n-upload`.'
      )
    }

    const {
      mergedClsPrefixRef,
      listTypeRef,
      mergedFileListRef,
      fileListStyleRef,
      cssVarsRef,
      mergedDisabledRef
    } = NUpload

    const isImageCardTypeRef = computed(
      () => listTypeRef.value === 'image-card'
    )

    const renderFileList = (): VNode[] =>
      mergedFileListRef.value.map((file) => (
        <NUploadFile
          clsPrefix={mergedClsPrefixRef.value}
          key={file.id}
          file={file}
          listType={listTypeRef.value}
        />
      ))

    const renderUploadFileList = (): VNode =>
      isImageCardTypeRef.value ? (
        <NImageGroup>{{ default: renderFileList }}</NImageGroup>
      ) : (
        <NFadeInExpandTransition group>
          {{
            default: renderFileList
          }}
        </NFadeInExpandTransition>
      )

    return () => {
      const { value: mergedClsPrefix } = mergedClsPrefixRef
      return (
        <div
          class={[
            `${mergedClsPrefix}-upload-file-list`,
            mergedDisabledRef.value &&
              `${mergedClsPrefix}-upload-file-list--disabled`,
            isImageCardTypeRef.value &&
              `${mergedClsPrefix}-upload-file-list--grid`
          ]}
          style={[cssVarsRef.value, fileListStyleRef.value as CSSProperties]}
        >
          {renderUploadFileList()}
          {isImageCardTypeRef.value && <NUploadTrigger>{slots}</NUploadTrigger>}
        </div>
      )
    }
  }
})
