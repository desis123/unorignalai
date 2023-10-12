import React, { useCallback, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import { Button } from "../components/button";
import { API_ENDPOINT } from "../api/api-service";
import { useAuth0 } from "@auth0/auth0-react";

const DropzoneContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  height: 100%;
  flex: 1;
  border: 2px dashed ${({ theme }) => theme.colors.secondary};
  border-radius: 10px;
  cursor: pointer;
  ${({ isDisabled }) =>
    isDisabled && `cursor: not-allowed; background-color: #e0e0e0;`}
  transition: background-color 0.3s ease-in-out;

  &:hover {
    border: 2px dashed ${({ theme }) => theme.colors.primary};
  }

  & > p {
    font-size: 1.2rem;
    margin-top: 1.5rem;
    text-align: center;
  }
`;

const ErrorMessage = styled.div`
  color: ${({ theme }) => theme.colors.error};
  font-size: 1rem;
  margin-top: 1rem;
`;

const DropzoneMessage = styled.div`
  color: ${({ theme }) => theme.colors.primary};
  font-size: 1rem;
`;

const TextButton = styled(Button)`
  background-color: transparent;
  color: ${({ theme }) => theme.colors.tertiary};
  border: none;
  padding: 5px;
  color: ${({ theme }) => theme.colors.error};
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

function DragDrop({ onUpload, isDisabled }) {
  const { user, getAccessTokenSilently } = useAuth0();
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState(
    "Drag and drop your file here, or click to select a file"
  );
  const [file, setFile] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    if (isLoading) return;

    setIsLoading(true);
    const file = acceptedFiles[0];
    if (!file.type.match(/^image\/(jpeg|png)$/)) {
      console.error("Only JPEG and PNG files are accepted.");
      setErrorMessage("Only JPEG and PNG files are accepted.");
      setIsLoading(false);
      return;
    }

    // make sure filezise is less than 5MB
    if (file.size > 1000000) {
      setErrorMessage("File size is too large, less than 1MB is required");
      setIsLoading(false);
      return;
    }

    getAccessTokenSilently()
      .then((token) => {
        const formData = new FormData();
        formData.append("file", acceptedFiles[0]);
        formData.append("user", JSON.stringify(user));

        return axios.post(`${API_ENDPOINT}/api/upload/s3`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`, // Add token to the headers
          },
        });
      })
      .then((response) => {
        setFile(response.data.url);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setErrorMessage("Something went wrong. Please try again.");
        setIsLoading(false);
      });
  }, []);

  React.useEffect(() => {
    if (file && onUpload) {
      onUpload(file);
      setUploadMessage("File uploaded successfully.");
      setErrorMessage("");
      setIsLoading(false);
    }
  }, [file]);

  const removeFile = () => {
    if (file) {
      setIsLoading(true);
      getAccessTokenSilently()
        .then((token) => {
          return axios.delete(`${API_ENDPOINT}/api/upload/s3`, {
            data: { url: file, user: user },
            headers: {
              Authorization: `Bearer ${token}`, // Add token to the headers
            },
          });
        })
        .then((response) => {
          setFile(null);
          setIsLoading(false);
          setErrorMessage("");
          setUploadMessage(
            "Drag and drop your file here, or click to select a file"
          );
        })
        .catch((error) => {
          console.error(error);
          setErrorMessage("Something went wrong. Please try again.");
          setIsLoading(false);
        });
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    maxFiles: 1, // Limit the number of accepted files to 1
    accept: "image/jpeg, image/png",
    disabled: isLoading || isDisabled || !!file,
    isDisabled: isLoading || isDisabled || !!file,
  });

  return (
    <Container>
      <DropzoneContainer
        {...getRootProps()}
        isDisabled={isLoading || !!file || isDisabled}
      >
        <input {...getInputProps()} />
        {<DropzoneMessage>{uploadMessage}</DropzoneMessage>}
        {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
        {isLoading && <p>Loading...</p>}
      </DropzoneContainer>
      {file && (
        <TextButton
          onClick={
            removeFile // Show "Remove File" button only if a file is uploaded
          }
          name="Remove File"
        />
      )}
    </Container>
  );
}

export default DragDrop;
