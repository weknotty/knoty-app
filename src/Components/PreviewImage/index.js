import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { handleUploadChange } from "../../Utils";
import ButtonLoader from "../ButtonLoader";
import MatchName from "../MatchName";

const PreviewImage = () => {
  const dispatch = useDispatch();
  const userID = useSelector((state) => state.user.userID);
  const profileImageUrl = useSelector((state) => state.user.profileImageUrl) || "/assets/images/logoUpload.png";
  const [isUploading, setsetIsUploading] = useState(false);

  return (
    <div className="col-auto d-flex flex-column justify-content-center align-items-center position-relative userProfileContainer">
      <MatchName key={"sdklnosdfiosofno"}/>
      <div className="col-auto d-flex flex-column justify-content-center align-items-center position-relative mt-3">
        {isUploading ? <ButtonLoader state={true} className="thumbHolder"   /> : <img src={profileImageUrl} className="userProfileImage" />}
        <span className="editProfileImage pointer">
          <label htmlFor="profile-input">
            <img src="/assets/icons/edit.svg" height="35" width="35" className="pointer" />
          </label>
          <input
            type="file"
            id="profile-input"
            onInput={(e) => handleUploadChange(e, userID, dispatch, setsetIsUploading)}
            className="d-none"
            accept="image/*"
          />
        </span>
      </div>
    </div>
  );
};
export default PreviewImage;
