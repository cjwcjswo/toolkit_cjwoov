import React, { useState, useRef, useEffect, useCallback } from 'react';

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
    ctx.font = `${textSize}px fantasy`;

    let textMaxWidth = 0;
    let totalTextHeight = 0;

    textLines.forEach((line) => {
      const textMetrics = ctx.measureText(line);
      const textWidth = textMetrics.width;
      totalTextHeight += textMetrics.actualBoundingBoxAscent + textMetrics.actualBoundingBoxDescent + Number(textSize/2);

      if (textWidth > textMaxWidth) textMaxWidth = textWidth;
    });

    const textX = (canvas.width - textMaxWidth) / 2;
    const textY = (canvas.height - totalTextHeight) / 2;

    if (textHighlight) {
      ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
      ctx.fillRect(textX - Number(textSize/2), textY - Number(textSize/2), 
                    textMaxWidth + Number(textSize), totalTextHeight + Number(textSize));
    }

    // Draw text
    ctx.globalAlpha = 1;
    ctx.fillStyle = textFillColor;

    if (textStrokeWidth > 0) {
      ctx.strokeStyle = textStrokeColor;
      ctx.lineWidth = textStrokeWidth;
    }

    textLines.forEach((line, i) => {
      const textMetrics = ctx.measureText(line);
      const textWidth = textMetrics.width;
      const textHeight = (textMetrics.actualBoundingBoxAscent + textMetrics.actualBoundingBoxDescent) + Number(textSize/2);

      const x = (canvas.width - textWidth) / 2;
      const y = (textY + totalTextHeight) - (textLines.length - (i+0.8)) * textHeight;

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
    <div className="flex flex-wrap mt-2">
      <div className="flex border-2 border-gray-600 rounded-3xl m-2 w-full aspect-[2/1] overflow-auto xl:basis-3/4 ">
        {imageSrc && (
          <canvas className="mx-auto my-auto" ref={canvasRef}/>
        )}
      </div>
      <div className="m-2 w-full xl:w-fit">
        <input type="file" className="mt-2" onChange={handleImageChange} accept="image/*" />
        <div className="mt-4 text-center border-2 border-gray-400 border-separate">
          너비: <input type="number" className="mt-2 text-black" name="imageWidth" min="1" value={imageSize.width} disabled={sizeInputDisabled} onChange={handleImageWidthChange} />px<br />
          높이: <input type="number" className="mt-2 text-black" name="imageHeight" min="1" value={imageSize.height} disabled={sizeInputDisabled} onChange={handleImageHeightChange} />px<br />
          <button className="my-2 p-2 bg-blue-500 rounded disabled:bg-gray-800" onClick={resizeImage} disabled={sizeInputDisabled}>이미지 크기 조절</button>
        </div>
        <div className="mt-2">
          <label>투명도 조절</label>
          <input type="range" className="w-full" min="0" max="1" step="0.01" value={imageOpacity} onChange={handleImageOpacityChange} disabled={sizeInputDisabled} />
        </div>
        <div className="mt-2">
          <label>텍스트 입력</label>
          <textarea rows="5" className="w-full" onChange={handleTextContentChange} placeholder="텍스트를 입력하세요" disabled={sizeInputDisabled} />
        </div>
        <div className="mt-2">
          <label>텍스트 외곽선 두께</label>
          <input type="range" min="0" max="50" step="1" style={{ width: '100%' }} value={textStrokeWidth} onChange={handleTextStrokeWidthChange} disabled={sizeInputDisabled} />
        </div>
        <div className="mt-2">
          <label>텍스트 크기</label>
          <input type="range" min="10" max="500" step="1" style={{ width: '100%' }} value={textSize} onChange={handleTextSizeChange} disabled={sizeInputDisabled} />
        </div>
        <div className="mt-2">
          <input type="color" value={textFillColor} onChange={handleTextFillColorChange} disabled={sizeInputDisabled} />
          <label>텍스트 채우기 색상 선택</label>
        </div>
        <div className="mt-2">
          <input type="color" value={textStrokeColor} onChange={handleTextStrokeColorChange} disabled={sizeInputDisabled} />
          <label>텍스트 외곽선 색상 선택</label>
        </div>
        <div className="mt-2">
          <input type="checkbox" name="textHighlight" value="textHighlight" onChange={handleTextHighlightChange} checked={textHighlight} disabled={sizeInputDisabled}/>
          <label>텍스트 강조 선택</label>
        </div>
        <div className="mt-2 wd-full text-center">
          <input type="radio" name="ext" value="png" checked={imageExtension === 'png'} onChange={() => setImageExtension('png')} />PNG &emsp;
          <input type="radio" name="ext" value="webp" checked={imageExtension === 'webp'} onChange={() => setImageExtension('webp')} />WEBP<br/>
          <button className="my-2 p-2 bg-blue-500 rounded disabled:bg-gray-800" onClick={saveImage} disabled={sizeInputDisabled}>썸네일 저장</button>
        </div>
      </div>
    </div>
  );
}

function ThumnailMakerPage() {
    return (
      <>
        <h2 className="flex items-center">
          <img src="images/thumbnail_maker.png" className="mr-2" width="64px" height="48px" style={{ imageRendering: "pixelated" }}/>
          썸네일 메이커
          </h2>
        <ThumbnailMaker/>
      </>
    );
}

export default ThumnailMakerPage;