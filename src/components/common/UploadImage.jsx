import camera from "assets/images/camera.png";
import axios from "axios";
import LazyLoadImage from "components/common/LazyLoadImage";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { addToast } from "store/Toast/action";
const EnumGeometry = {
  rect: "rounded-0",
  radius: "rounded",
  circle: "rounded-circle",
};
function UploadImage({
  image,
  callback,
  geometry = "circle",
  size = { width: 150, height: 150 },
  classImage = "",
  showUpload = false,
}) {
  const [file, setFile] = useState();
  const [isUploading, setIsUploading] = useState(false);
  const dispatch = useDispatch();
  const onAddToast = (data) => dispatch(addToast(data));
  useEffect(() => {
    setFile(image);
  }, [image]);

  const handleUploadImage = (event) => {
    const selectedFile = event.target.files[0];

    if (selectedFile) {
      const formData = new FormData();
      formData.append("image", selectedFile);
      setIsUploading(true);
      axios
        .post("https://kubtool.000webhostapp.com/upload.php", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          const url = response.data.url;
          setFile(url);
          callback(url);
        })
        .catch((error) => {
          onAddToast({
            text: "Upload image failed",
            type: "danger",
            title: "",
          });
        })
        .finally(() => {
          setIsUploading(false);
        });
    }
  };

  return (
    <>
      {file ? (
        <div>
          <LazyLoadImage
            key={file}
            src={file}
            alt="avatar"
            {...size}
            className={`${EnumGeometry[geometry]} p-2 shadow-sm ${classImage}`}
          />
        </div>
      ) : (
        <label
          htmlFor="uploadImage"
          className={`${EnumGeometry[geometry]} shadow-sm d-flex justify-content-center align-items-center text-center ${classImage}`}
          style={{
            ...size,
            cursor: "pointer",
            background: "#e1e1e1",
            border: "8px solid #ecebe8",
          }}
        >
          <div>
            <img
              src={camera}
              alt="camera"
              width={30}
              height="auto"
              className="opacity-50"
            />
            <div>
              <small className="text-black-50 opacity-75">Upload photo</small>
            </div>
          </div>
        </label>
      )}
      {showUpload && (
        <div>
          <label
            htmlFor="uploadImage"
            className={`btn btn-outline-secondary mt-3 ${
              isUploading && "pe-none"
            }`}
          >
            {isUploading && (
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />
            )}
            Upload Image
          </label>
        </div>
      )}
      <input
        id="uploadImage"
        type="file"
        accept="image/*"
        onChange={handleUploadImage}
        hidden
        disabled={isUploading}
      />
    </>
  );
}
UploadImage.propTypes = {
  src: PropTypes.string,
  callback: PropTypes.func,
};
export default UploadImage;
