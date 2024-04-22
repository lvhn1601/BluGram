import React, { useCallback, useState } from 'react'
import { FileWithPath, useDropzone } from 'react-dropzone'
import { Button } from '../ui/button';

type FileUploaderProps = {
  fieldChange: (FILES: File[]) => void;
  mediaUrl: string;
}

function FileUploader( { fieldChange, mediaUrl } : FileUploaderProps) {
  const [file, setFile] = useState<File[]>([]);
  const [fileUrl, setFileUrl] = useState(mediaUrl);

  const onDrop = useCallback((acceptedFiles: FileWithPath[]) => {
    setFile(acceptedFiles);
    fieldChange(acceptedFiles);
    setFileUrl(URL.createObjectURL(acceptedFiles[0]));
  }, [file])
  
  const {getRootProps, getInputProps} = useDropzone({
    onDrop,
    accept: {
      'image/*' : ['.png', '.jpg', '.svg']
    }
  })

  const handleDeleteFile = () => {
    setFile([]);
    setFileUrl('');
  }

  return (
    <div className='relative'>
      <div {...getRootProps()} className='flex flex-center flex-col bg-dark-3 rounded-xl cursor-pointer'>
        <input {...getInputProps()} className='cursor-pointer' />
        {
          fileUrl ? (
            <>
              <div className='flex flex-1 justify-center w-full p-5 lg:p-10'>
                <img
                  src={fileUrl}
                  alt='image'
                  className='file_uploader-img'
                />
              </div>
              <p className='file_uploader-label'>Click or drag photo to replace</p>
            </>
          ) : (
            <div className='file_uploader-box'>
              <img
                src='/assets/icons/file-upload.svg'
                width={96}
                height={77}
                alt='file-upload'
              />
              <h3 className='base-medium text-light-2 mb-2 mt-6'>Drag photo here</h3>
              <p className='text-light-4 small-regular mb-6'>JPG, PNG, SVG</p>

              <Button type='button' className='shad-button_dark_4'>
                Select from computer
              </Button>
            </div>
          )
        }
      </div>
      {fileUrl && 
        <Button
          type='button'
          className='absolute top-7 right-7 bg-dark-4 hover:bg-neutral-600 rounded-full p-2 lg:top-14 lg:right-14'
          onClick={handleDeleteFile}
        >
          <img src='/assets/icons/delete-white.svg' alt='delete' width={18} height={18} />
        </Button>
      }
    </div>
  )
}

export default FileUploader