import React, { useEffect, useState } from "react";

const RecentResults = (props) => {
  const recentImages = JSON.parse(localStorage.getItem("genAIRecentKey"));
  const [recentImagesStored, setRecentImagesStored] = useState([]);

  const handleClick = (value) => {
    props.onSelect(value);
  };

  useEffect(() => {
    if (recentImages) {
      setRecentImagesStored(recentImages);
    }

    if (
      props.promptQuery &&
      props.imageResult &&
      recentImages &&
      !recentImages.some((local) => local.src === props.imageResult)
    ) {
      if (recentImages.length === 5) {
        recentImages.shift();
        recentImages.push({
          src: props.imageResult,
          name: props.promptQuery,
        });
      } else {
        recentImages.push({
          src: props.imageResult,
          name: props.promptQuery,
        });
      }
      localStorage.setItem("genAIRecentKey", JSON.stringify(recentImages));
      setRecentImagesStored(recentImages);
    } else if (props.promptQuery && props.imageResult && !recentImages) {
      recentImagesStored.push({
        src: props.imageResult,
        name: props.promptQuery,
      });
      localStorage.setItem(
        "genAIRecentKey",
        JSON.stringify(recentImagesStored)
      );
      setRecentImagesStored(recentImagesStored);
    }
  }, [props.promptQuery, props.imageResult]);

  return (
    <>
    </>
  );
};

export default RecentResults;
