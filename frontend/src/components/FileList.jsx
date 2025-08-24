import React from 'react';
import FileItem from './FileItem';

const FileList = ({ files, onDelete }) => {
  if (!files || files.length === 0) return <p>No files available.</p>;

  return (
    <div>
      {files.map((file) => (
        <FileItem key={file._id} file={file} onDelete={onDelete} />
      ))}
    </div>
  );
};

export default FileList;
