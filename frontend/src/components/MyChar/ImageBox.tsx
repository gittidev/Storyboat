import React from "react";

interface ImageBoxProps {
  imageResult?: string | null;
  promptQuery?: string;
}

const ImageBox: React.FC<ImageBoxProps> = ({ imageResult, promptQuery }) => {
  return (
    <>
      {imageResult ? (
        <div>
          <div className="imageBox">
            <img
              src={imageResult}
              alt={promptQuery || "Image"}
              loading="lazy"
              style={{ maxWidth: '100%', maxHeight: '400px', height: 'auto' }} 
            />
          </div>


          <div style={{
              textAlign: 'center',         
              marginTop: '5px',
              marginLeft: '20px'
            }}>
              <a
                download={promptQuery || "download"}
                href={imageResult}
                style={{
                  color: 'rgb(173,216,230)',  /* 링크 텍스트 색상 설정 */
                  fontSize: '25px'            /* 글씨 크기 설정 (선택 사항) */
                }}
              >
            다운로드 
              </a>
            </div>


        </div>
      ) : (

        <div style={{
          margin: '0 auto',        
          textAlign: 'center',      
          display: 'flex',          
          alignItems: 'center',     
          justifyContent: 'center', 
          height: '50vh'          
        }}>
          <a>
          이미지를 생성해주세요
          </a>
        </div>
      )}
    </>
  );
};

export default ImageBox;
