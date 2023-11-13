import React from 'react';
import { 
  useState,
  useRef,
  useEffect
} from 'react';
import Space from '../src/space';

import styles from './thumbnail-maker.module.css';

function ThumbnailMaker() {
  const [ imageSrc, setImageSrc ] = useState(null);
  const [opacity, setOpacity] = useState(1);
  const [text, setText] = useState('');
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!imageSrc) {
      return;
    }

    const image = new Image();
    image.src = imageSrc;

    image.onload = () => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      // 이미지 그리기
      canvas.width = image.width;
      canvas.height = image.height;
      ctx.globalAlpha = opacity;
      ctx.drawImage(image, 0, 0);

      // 텍스트 그리기
      ctx.globalAlpha = 1;
      const textMetrics = ctx.measureText(text);
      const textWidth = textMetrics.width;
      const textHeight = 20; // 텍스트의 높이는 폰트 크기를 대략적으로 사용

      // 캔버스의 중앙 좌표 계산
      const x = (canvas.width - textWidth) / 2;
      const y = (canvas.height + textHeight) / 2;

      ctx.fillStyle = 'white';
      ctx.font = '20px Arial';
      ctx.fillText(text, x, y);
    }
  }, [imageSrc, text, opacity]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setImageSrc(reader.result);
    }

    if (file) {
      reader.readAsDataURL(file);
    }
  }

  const handleOpacityChange = (e) => {
    setOpacity(e.target.value);
  }

  const handleTextChange = (e) => {
    setText(e.target.value);
  }

  const saveImage = () => {
    if (!canvasRef.current) {
      return;
    }
    const imageDownloadLink = document.createElement('a');
    imageDownloadLink.href = canvasRef.current.toDataURL('image/png');
    imageDownloadLink.download = 'thumbnail.png';
    imageDownloadLink.click();
  }

  return (
    <div className={styles.thumbnailContainer}>
      <div className={styles.previewDiv}>
        {imageSrc && <canvas ref={canvasRef} className={styles.previewImage}/>}
      </div>
      <div className={styles.settingContainer}>
        <input type="file" onChange={handleImageChange} accept="image/*"/>
        <Space value="20px"/>
        <div>
          <label> 투명도 조절 </label>
          <input type="range" min="0" max="1" step="0.01" 
          style={{width: "100%"}} 
          value={opacity} onChange={handleOpacityChange} />
        </div>
        <Space value="20px"/>
        <div>
          <label> 텍스트 입력 </label>
          <textarea style={{width: "100%"}} onChange={handleTextChange} placeholder="텍스트를 입력하세요"/>
        </div>
        <button onClick={saveImage}>썸네일 저장</button>
      </div>
    </div>
  )
}

function ThumnailMakerPage() {
    return (
      <>
        <h2>썸네일 메이커😍</h2>
        <ThumbnailMaker/>
      </>
    );
}

export default ThumnailMakerPage;