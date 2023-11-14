import React, { useState, useRef, useEffect, useCallback } from 'react';
import Space from '../src/space';
import styles from './thumbnail-maker.module.css';

const DEFAULT_IMAGE_SIZE = { width: 1200, height: 628 };
const DEFAULT_EXTENSION = 'png';
const DEFAULT_TEXT_SIZE = 32;

function ThumbnailMaker() {
  // 이미지 관련 상태
  const [imageSrc, setImageSrc] = useState(null);
  const [imageOpacity, setImageOpacity] = useState(1);
  const [imageSize, setImageSize] = useState(DEFAULT_IMAGE_SIZE);
  const [imageExtension, setImageExtension] = useState(DEFAULT_EXTENSION);

  // 텍스트 관련 상태
  const [textStrokeWidth, setTextStrokeWidth] = useState(0);
  const [textStrokeColor, setTextStrokeColor] = useState('black');
  const [textContent, setTextContent] = useState('');
  const [textFillColor, setTextFillColor] = useState('white');
  const [textSize, setTextSize] = useState(DEFAULT_TEXT_SIZE);
  const [textHighlight, setTextHighlight] = useState(false);

  // 기타 상태
  const [sizeInputDisabled, setSizeInputDisabled] = useState(true);
  const canvasRef = useRef(null);
  const imageRef = useRef(null);

  useEffect(() => {
    if (!imageSrc) return;

    const image = new Image();
    image.src = imageSrc;

    image.onload = () => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      imageRef.current = image;

      drawImageAndText(ctx, canvas);
    };
  }, [imageSrc, imageOpacity, textContent, textSize, textFillColor, textStrokeWidth, textStrokeColor, textHighlight]);

  const drawImageAndText = useCallback((ctx, canvas) => {
    canvas.width = imageSize.width;
    canvas.height = imageSize.height;
    setSizeInputDisabled(false);

    // Draw image
    ctx.globalAlpha = imageOpacity;
    ctx.drawImage(imageRef.current, 0, 0, imageSize.width, imageSize.height);

    // Draw Highlight
    const textLines = textContent.split('\n');
    ctx.font = `${textSize}px Arial`;

    let textMaxWidth = 0;
    let totalTextHeight = 0;

    textLines.forEach((line) => {
      const textMetrics = ctx.measureText(line);
      const textWidth = textMetrics.width;
      totalTextHeight += textMetrics.actualBoundingBoxAscent + textMetrics.actualBoundingBoxDescent;

      if (textWidth > textMaxWidth) textMaxWidth = textWidth;
    });

    const DELTA = 1.24;
    totalTextHeight *= DELTA;
    const textY = (canvas.height - totalTextHeight) / 2;

    const DELTA_X = 128;
    const DELTA_Y = 128;
    const TEXT_LINE_MAX_WIDTH_SIZE = textMaxWidth + DELTA_X;
    if (textHighlight) {
      ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
      ctx.fillRect(canvas.width/2 - (TEXT_LINE_MAX_WIDTH_SIZE/2), 
                   textY - DELTA_Y / 2, 
                   TEXT_LINE_MAX_WIDTH_SIZE, 
                   totalTextHeight + DELTA_Y);
    }

    // Draw text
    ctx.globalAlpha = 1;
    ctx.fillStyle = textFillColor;
    ctx.font = `${textSize}px Arial`;

    if (textStrokeWidth > 0) {
      ctx.strokeStyle = textStrokeColor;
      ctx.lineWidth = textStrokeWidth;
    }

    textLines.forEach((line, i) => {
      const textMetrics = ctx.measureText(line);
      const textWidth = textMetrics.width;

      const x = (canvas.width - textWidth) / 2;
      const y = (textY + (totalTextHeight)) - ((textLines.length - (1 + i)) / 2) * (textMetrics.actualBoundingBoxAscent + textMetrics.actualBoundingBoxDescent) * DELTA * 2.2;
      

      if (textStrokeWidth > 0) ctx.strokeText(line, x, y);
      ctx.fillText(line, x, y);
    });

  }, [imageSize, imageOpacity, textContent, textSize, textFillColor, textStrokeWidth, textStrokeColor, textHighlight]);

  // 이미지 파일 선택 핸들러
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setImageSrc(reader.result);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  // 이미지 투명도 변경 핸들러
  const handleImageOpacityChange = (e) => {
    setImageOpacity(e.target.value);
  };

  // 텍스트 외곽선 두께 변경 핸들러
  const handleTextStrokeWidthChange = (e) => {
    setTextStrokeWidth(e.target.value);
  };

  // 텍스트 크기 변경 핸들러
  const handleTextSizeChange = (e) => {
    setTextSize(e.target.value);
  };

  // 텍스트 내용 변경 핸들러
  const handleTextContentChange = (e) => {
    setTextContent(e.target.value);
  };

  // 텍스트 채우기 색상 변경 핸들러
  const handleTextFillColorChange = (e) => {
    setTextFillColor(e.target.value);
  };

  // 텍스트 외곽선 색상 변경 핸들러
  const handleTextStrokeColorChange = (e) => {
    setTextStrokeColor(e.target.value);
  };

  // 텍스트 강조 변경 핸들러
  const handleTextHighlightChange = () => {
    setTextHighlight(!textHighlight);
  };

  // 이미지 너비 변경 핸들러
  const handleImageWidthChange = (e) => {
    const newWidth = e.target.value;
    setImageSize((prevSize) => ({ width: newWidth, height: prevSize.height }));
  };

  // 이미지 높이 변경 핸들러
  const handleImageHeightChange = (e) => {
    const newHeight = e.target.value;
    setImageSize((prevSize) => ({ width: prevSize.width, height: newHeight }));
  };

  // 이미지 크기 조절 함수
  const resizeImage = () => {
    if (!canvasRef.current) {
      return;
    }

    const canvas = canvasRef.current;
    canvas.width = imageSize.width;
    canvas.height = imageSize.height;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(imageRef.current, 0, 0, imageSize.width, imageSize.height);
  };

  // 이미지 저장 함수
  const saveImage = () => {
    if (!canvasRef.current) {
      return;
    }

    const imageDownloadLink = document.createElement('a');
    imageDownloadLink.href = canvasRef.current.toDataURL(`image/${imageExtension}`);
    imageDownloadLink.download = `thumbnail.${imageExtension}`;
    imageDownloadLink.click();
  };

  return (
    <div className={styles.thumbnailContainer}>
      <div className={styles.previewDiv}>
        {imageSrc && (
          <canvas ref={canvasRef} className={styles.previewImage}/>
        )}
      </div>
      <div className={styles.settingContainer}>
        <input type="file" onChange={handleImageChange} accept="image/*" />
        <Space value="20px" />
        <div style={{ border: '1px solid white', borderRadius: '3px', padding: '5px' }}>
          너비: <input type="number" name="imageWidth" min="1" value={imageSize.width} className={styles.imageSizeInput} disabled={sizeInputDisabled} onChange={handleImageWidthChange} />px<br />
          높이: <input type="number" name="imageHeight" min="1" value={imageSize.height} className={styles.imageSizeInput} disabled={sizeInputDisabled} onChange={handleImageHeightChange} />px<br />
          <button onClick={resizeImage} disabled={sizeInputDisabled}>이미지 크기 조절</button>
        </div>
        <Space value="20px" />
        <div>
          <label>투명도 조절</label>
          <input type="range" min="0" max="1" step="0.01" style={{ width: '100%' }} value={imageOpacity} onChange={handleImageOpacityChange} disabled={sizeInputDisabled} />
        </div>
        <Space value="20px" />
        <div>
          <label>텍스트 입력</label>
          <textarea rows="5" style={{ width: '100%' }} onChange={handleTextContentChange} placeholder="텍스트를 입력하세요" disabled={sizeInputDisabled} />
        </div>
        <Space value="20px" />
        <div>
          <label>텍스트 외곽선 두께</label>
          <input type="range" min="0" max="50" step="1" style={{ width: '100%' }} value={textStrokeWidth} onChange={handleTextStrokeWidthChange} disabled={sizeInputDisabled} />
        </div>
        <Space value="10px" />
        <div>
          <label>텍스트 크기</label>
          <input type="range" min="10" max="500" step="1" style={{ width: '100%' }} value={textSize} onChange={handleTextSizeChange} disabled={sizeInputDisabled} />
        </div>
        <Space value="10px" />
        <div>
          <input type="color" value={textFillColor} onChange={handleTextFillColorChange} disabled={sizeInputDisabled} />
          <label>텍스트 채우기 색상 선택</label>
        </div>
        <Space value="10px" />
        <div>
          <input type="color" value={textStrokeColor} onChange={handleTextStrokeColorChange} disabled={sizeInputDisabled} />
          <label>텍스트 외곽선 색상 선택</label>
        </div>
        <Space value="10px" />
        <div>
          <input type="checkbox" name="textHighlight" value="textHighlight" onChange={handleTextHighlightChange} checked={textHighlight} disabled={sizeInputDisabled}/>
          <label>텍스트 강조 선택</label>
        </div>
        <Space value="10px" />
        <div style={{ textAlign: 'center', margin: 'auto' }}>
          <input type="radio" name="ext" value="png" checked={imageExtension === 'png'} onChange={() => setImageExtension('png')} />PNG
          <input type="radio" name="ext" value="webp" checked={imageExtension === 'webp'} onChange={() => setImageExtension('webp')} />WEBP
          <button onClick={saveImage} disabled={sizeInputDisabled}>썸네일 저장</button>
        </div>
      </div>
    </div>
  );
}

function ThumnailMakerPage() {
    return (
      <>
        <h2 style={{display: "flex", alignItems: "center"}}>
          <img src="images/thumbnail_maker.png" style={
            {imageRendering: "pixelated", width: "64 px", height: "48px", marginRight: "10px"}
            }/>
          썸네일 메이커
          </h2>
        <ThumbnailMaker/>
      </>
    );
}

export default ThumnailMakerPage;