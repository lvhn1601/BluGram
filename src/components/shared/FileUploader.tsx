import React, { useCallback, useState } from 'react'
import { FileWithPath, useDropzone } from 'react-dropzone'
import { Button } from '../ui/button';

type FileUploaderProps = {
  fieldChange: (FILES: File[]) => void;
  mediaUrl: string;
  setDelete: React.Dispatch<boolean>;
}

function FileUploader( { fieldChange, mediaUrl, setDelete } : FileUploaderProps) {
  const [file, setFile] = useState<File[]>([]);
  const [fileUrl, setFileUrl] = useState(mediaUrl);

  const onDrop = useCallback((acceptedFiles: FileWithPath[]) => {
    const fileToResize = acceptedFiles[0]; // Assuming only one file is dropped
    const reader = new FileReader();
    reader.readAsDataURL(fileToResize);
    reader.onload = function(event) {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = function() {
        const MAX_SIZE = 1024;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_SIZE) {
            height *= MAX_SIZE / width;
            width = MAX_SIZE;
          }
        } else {
          if (height > MAX_SIZE) {
            width *= MAX_SIZE / height;
            height = MAX_SIZE;
          }
        }

        // Create a canvas to draw the resized image
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);

        // Convert the canvas content to a Blob
        canvas.toBlob((blob: Blob | null) => {
          if (blob) {
            // Create a new File object with the resized image
            const resizedFile = new File([blob], fileToResize.name, { type: 'image/jpeg' });

            // Update state and call fieldChange with the resized file
            setFile([resizedFile]);
            fieldChange([resizedFile]);
            setFileUrl(URL.createObjectURL(resizedFile));
            setDelete(false);
          }
        }, 'image/jpeg');
      };
    };
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
    setDelete(true);
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