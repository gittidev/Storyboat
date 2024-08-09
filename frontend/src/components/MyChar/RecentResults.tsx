import React, { useEffect, useState } from "react";

interface RecentResultsProps {
  onSelect: (value: string) => void;
  promptQuery?: string;
  imageResult?: string;
}

interface RecentImage {
  src: string;
  name: string;
}

const RecentResults: React.FC<RecentResultsProps> = (props) => {
  const recentImages: RecentImage[] = JSON.parse(localStorage.getItem("genAIRecentKey") || '[]');
  const [recentImagesStored, setRecentImagesStored] = useState<RecentImage[]>([]);

//   const handleClick = (value: string) => {
//     props.onSelect(value);
//   };

  useEffect(() => {
    if (recentImages.length > 0) {
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
      }
      recentImages.push({
        src: props.imageResult,
        name: props.promptQuery,
      });

      localStorage.setItem("genAIRecentKey", JSON.stringify(recentImages));
      setRecentImagesStored(recentImages);
    } else if (props.promptQuery && props.imageResult && recentImages.length === 0) {
      const newRecentImagesStored = [
        ...recentImagesStored,
        {
          src: props.imageResult,
          name: props.promptQuery,
        }
      ];
      localStorage.setItem("genAIRecentKey", JSON.stringify(newRecentImagesStored));
      setRecentImagesStored(newRecentImagesStored);
    }
  }, [props.promptQuery, props.imageResult]);

  return (
    <>
    </>
  );
};

export default RecentResults;
