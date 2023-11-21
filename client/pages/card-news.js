import React, { useRef, useState, useEffect } from 'react';

const CardNews = ({ page, setting }) => {
    const canvasRef = useRef(null);

    const [titleText, setTitleText] = useState('');
    const [contentText, setContentText] = useState('');

    useEffect(() => {
        if (!canvasRef.current) {
            return;
        }
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        canvas.width = 1080;
        canvas.height = 1080;

        // 공통 설정 함수
        const applyCommonSettings = () => {
            if (Number(setting.textStrokeSize) > 0) {
                ctx.strokeStyle = setting.textStrokeColor;
                ctx.lineWidth = setting.textStrokeSize;
            }

            if (setting.textShadow === true) {
                ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
                ctx.shadowBlur = 10;
                ctx.shadowOffsetX = 15;
                ctx.shadowOffsetY = 15;
            }
        };

        // 텍스트 렌더링 함수
        const renderText = (titleText, contentText, titleTextStyle, contentTextStyle) => {
            if (titleText === '' && contentText === '') {
                return;
            }

            let textLines = [];
            if (contentText !== '') {
                textLines = contentText.split('\n');
            }

            const MARGIN_X = 15;
            const MARGIN_Y = 15;

            ctx.textAlign = 'center';
            ctx.textBaseline = 'top';
            let textX = canvas.width / 2;
            let textY = MARGIN_Y;
            if (titleTextStyle.textVerticalAlign === 'bottom') {
                textY = canvas.height - MARGIN_Y;
            }

            textLines.forEach((line) => {
                ctx.font = `${contentTextStyle.textThickness} ${contentTextStyle.textSize}px ${contentTextStyle.font}`
                const textMetrics = ctx.measureText(line);
                const textHeight = textMetrics.actualBoundingBoxAscent + textMetrics.actualBoundingBoxDescent;
                
                if (titleTextStyle.textVerticalAlign === 'top') {
                    // empty
                } else if (titleTextStyle.textVerticalAlign === 'middle') {
                    textY -= (textHeight + MARGIN_Y) / 2;
                } else {
                    textY -= (textHeight + MARGIN_Y);
                }
            });

            if (titleTextStyle.textVerticalAlign === 'top') {
                textY = MARGIN_Y;
            } else if (titleTextStyle.textVerticalAlign === 'middle') {
                textY += canvas.height / 2;
            } else {
                textY -= MARGIN_Y;
            }

            if (titleText !== '') {
                ctx.fillStyle = titleTextStyle.titleTextColor;
                ctx.font = `${titleTextStyle.textThickness} ${titleTextStyle.textSize}px ${titleTextStyle.font}`
                if (titleTextStyle.textHorizontalAlign === 'left') {
                    ctx.textAlign = 'left';
                    textX = MARGIN_X;
                } else if (titleTextStyle.textHorizontalAlign === 'right') {
                    ctx.textAlign = 'right';
                    textX = canvas.width - MARGIN_X;
                }

                const textMetrics = ctx.measureText(titleText);
                const textHeight = textMetrics.actualBoundingBoxAscent + textMetrics.actualBoundingBoxDescent;
                if (titleTextStyle.textVerticalAlign === 'top') {
                    textY = MARGIN_Y;
                } else if (titleTextStyle.textVerticalAlign === 'middle') {
                    textY -= textHeight;
                } else {
                    textY -= textHeight * 2;
                }

                ctx.fillText(titleText, textX, textY);
                if (Number(setting.textStrokeSize) > 0) {
                    ctx.strokeText(titleText, textX, textY);
                }

                textY += textHeight + MARGIN_Y * 3;
            }

            if (contentText !== '') {
                ctx.fillStyle = contentTextStyle.textColor;
                ctx.font = `${contentTextStyle.textThickness} ${contentTextStyle.textSize}px ${contentTextStyle.font}`

                textLines.forEach((line) => {
                    const textMetrics = ctx.measureText(line);
                    const textHeight = textMetrics.actualBoundingBoxAscent + textMetrics.actualBoundingBoxDescent;
                    
                    ctx.fillText(line, textX, textY);
                    if (Number(setting.textStrokeSize) > 0) {
                        ctx.strokeText(line, textX, textY);
                    }
                    textY += textHeight + MARGIN_Y;
                });
            }
        };

        if (setting.backgroundImage !== '') {
            const image = new Image();
            image.src = setting.backgroundImage;

            image.onload = () => {
                ctx.globalAlpha = setting.backgroundImageOpacity;
                ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

                ctx.globalAlpha = 1;
                applyCommonSettings();
                renderText(titleText, contentText, setting.titleTextStyle, setting.contentTextStyle);
            };
        } else {
            ctx.globalAlpha = 1;
            ctx.fillStyle = setting.backgroundColor;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            applyCommonSettings();
            renderText(titleText, contentText, setting.titleTextStyle, setting.contentTextStyle);
        }

    }, [canvasRef, setting, titleText, contentText]);

    const handleTitleTextChange = (e) => {
        setTitleText(e.target.value);
    }

    const handleContentTextChange = (e) => {
        setContentText(e.target.value);
    }

    return (
        <div>
            <div className="min-w-[300px] max-w-[300px] relative justify-center items-center flex m-2 border-2 border-dashed border-gray-800 aspect-square rounded-lg hover:bg-red-300 hover:cursor-pointer">
                <div className='absolute top-2 bg-slate-500 bg-opacity-30 rounded-2xl p-1'>{page} 페이지</div>
                <canvas ref={canvasRef} className='w-full h-full' />
            </div>
            <div className="m-2 hidden md:block">
                <div>
                    제목
                    <input type="text" className="w-full text-black" onChange={handleTitleTextChange} />
                </div>
                <div className="mt-2 w-full">
                    내용
                    <textarea className="w-full text-black" rows="5" onChange={handleContentTextChange} />
                </div>
            </div>
        </div>
    )
}

const DEFAULT_FONTS = ['OAGothic', 'KCC-Ganpan', 'Arial', 'Georgia', 'Times New Roman', 'Courier New'];
const CardNewsBasicSetting = (props) => {
    return (
        <div className="w-full border-gray-600 border-2 p-2">
            <div>
                대본 업로드: <input type="file" />
            </div>
            <div className="mt-4">
                제목 색상: <input type="color" onChange={(e) => { props.onChangeTitleTextColor(e.target.value) }} />
            </div>
            <div className="mt-4">
                제목 크기: <input type="range" min="10" max="256" step="1" className="w-1/4"
                    onChange={(e) => { props.onChangeTitleTextSize(e.target.value) }} />
            </div>
            <div className="mt-4">
                제목 굵기: <input type="range" min="1" max="1000" step="1" className="w-1/4"
                    onChange={(e) => { props.onChangeTitleTextThickness(e.target.value) }} />
            </div>
            <div className="mt-4">
                내용 색상: <input type="color" onChange={(e) => { props.onChangeContentTextColor(e.target.value) }} />
            </div>
            <div className="mt-4">
                내용 크기: <input type="range" min="10" max="256" step="1" className="w-1/4"
                    onChange={(e) => { props.onChangeContentTextSize(e.target.value) }} />
            </div>
            <div className="mt-4">
                내용 굵기: <input type="range" min="1" max="1000" step="1" className="w-1/4"
                    onChange={(e) => { props.onChangeContentTextThickness(e.target.value) }} />
            </div>
            <div className="mt-4">
                폰트 선택:
                <select className="text-black ml-1" onChange={(e) => { props.onChangeFont(e.target.value) }}>
                    {DEFAULT_FONTS.map((font, index) => {
                        return (<option value={font} key={index}>{font}</option>);
                    })}
                </select>
            </div>
            <div className="mt-4">
                글자 수직 정렬:
                <button className="bg-blue-400 rounded-lg p-1 mx-2 hover:bg-red-400"
                    onClick={() => { props.onClickTextVerticalAlign('top') }}>상단</button>
                <button className="bg-blue-400 rounded-lg p-1 mx-2 hover:bg-red-400"
                    onClick={() => { props.onClickTextVerticalAlign('middle') }}>중앙</button>
                <button className="bg-blue-400 rounded-lg p-1 mx-2 hover:bg-red-400"
                    onClick={() => { props.onClickTextVerticalAlign('bottom') }}>하단</button>
            </div>
            <div className="mt-4">
                글자 수평 정렬:
                <button className="bg-blue-400 rounded-lg p-1 mx-2 hover:bg-red-400"
                    onClick={() => { props.onClickTextHorizontalAlign('left') }}>좌측</button>
                <button className="bg-blue-400 rounded-lg p-1 mx-2 hover:bg-red-400"
                    onClick={() => { props.onClickTextHorizontalAlign('center') }}>중앙</button>
                <button className="bg-blue-400 rounded-lg p-1 mx-2 hover:bg-red-400"
                    onClick={() => { props.onClickTextHorizontalAlign('right') }}>우측</button>
            </div>
            <div className="mt-4">
                글자 외곽선: <input type="range" min="0" max="10" step="0.1" className="w-1/4"
                    onChange={(e) => props.onChangeTextStrokeSize(e.target.value)}></input>
            </div>
            <div className="mt-4">
                글자 외곽선 색상: <input type="color" onChange={(e) => props.onChangeTextStrokeColor(e.target.value)} />
            </div>
            <div className="mt-4">
                <input type="checkbox" className="mr-2" onClick={props.onClickTextShadow} />글자 그림자
            </div>
            <div className="mt-4">
                배경 색상: <input type="color" onChange={(e) => { props.onChangeBackgroundColor(e.target.value) }} />
            </div>
            <div className='mt-4'>
                배경 파일: <input type="file" accept="image/*" onChange={props.onChangeBackgroundImage} />
            </div>
            <div className="mt-4">
                배경 투명도: <input type="range" min="0" max="1" step="0.01" className="w-1/4"
                    onChange={(e) => props.onChangeBackgroundImageOpacity(e.target.value)}></input>
            </div>
        </div>
    );
}

const CardNewsMaker = ({ setting }) => {
    const [cardList, setCardList] = useState([
        {
            "page": 1
        }
    ]);
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
        }
    }, [cardList]);

    const handleAddCardNews = () => {
        const currentPage = cardList.length;
        const newCardList = cardList.slice();
        newCardList.push({
            page: currentPage + 1
        });
        console.log(newCardList);
        setCardList(newCardList);
    }

    return (
        <div ref={scrollRef} className='flex bg-zinc-950 border-double border-gray-900 border-4 wd-full overflow-auto'>
            <div className="flex flex-row justify-center items-center">
                {cardList.map((card) => {
                    return (<CardNews key={card.page} page={card.page} setting={setting} />);
                })}
                <button className='bg-zinc-700 px-2 rounded-full bg-opacity-80 text-center mx-12' onClick={handleAddCardNews}>+</button>
            </div>
        </div>
    );
}

const DEFAULT_SETTING = {
    "titleTextStyle": {
        "font": DEFAULT_FONTS[0],
        "textColor": "black",
        "textSize": 10,
        "textThickness": 1,
        "textHorizontalAlign": "right",
        "textVerticalAlign": "top"
    },
    "contentTextStyle": {
        "font": DEFAULT_FONTS[0],
        "textColor": "black",
        "textSize": 10,
        "textThickness": 1,
        "textHorizontalAlign": "right",
        "textVerticalAlign": "top"
    },
    "textStrokeSize": 1,
    "textStrokeColor": "white",
    "backgroundColor": "white",
    "backgroundImage": "",
    "textShadow": false,
    "backgroundImage": "",
    "backgroundImageOpacity": 100

};
const CardNewsPage = () => {
    const [setting, setSetting] = useState(DEFAULT_SETTING);

    // 폰트 변경
    const handleChangeFont = (font) => {
        setSetting({
            ...setting,
            "titleTextStyle": {
                ...setting.titleTextStyle,
                "font": font
            },
            "contentTextStyle": {
                ...setting.contentTextStyle,
                "font": font
            }
        });
    }

    // 제목 크기 변경
    const handleChangeTitleTextSize = (size) => {
        setSetting({
            ...setting,
            "titleTextStyle": {
                ...setting.titleTextStyle,
                "textSize": size
            }
        });
    }

    // 제목 색상 변경
    const handleChangeTitleTextColor = (color) => {
        setSetting({
            ...setting,
            "titleTextStyle": {
                ...setting.titleTextStyle,
                "textColor": color
            }
        });
    }

    // 제목 굵기 변경
    const handleChangeTitleTextThickness = (thickness) => {
        setSetting({
            ...setting,
            "titleTextStyle": {
                ...setting.titleTextStyle,
                "textThickness": thickness
            }
        });
    }

    // 내용 크기 변경
    const handleChangeContentTextSize = (size) => {
        setSetting({
            ...setting,
            "contentTextStyle": {
                ...setting.contentTextStyle,
                "textSize": size
            }
        });
    }

    // 내용 색상 변경
    const handleChangeContentTextColor = (color) => {
        setSetting({
            ...setting,
            "contentTextStyle": {
                ...setting.contentTextStyle,
                "textColor": color
            }
        });
    }

    // 내용 굵기 변경
    const handleChangeContentTextThickness = (thickness) => {
        setSetting({
            ...setting,
            "contentTextStyle": {
                ...setting.contentTextStyle,
                "textThickness": thickness
            }
        });
    }

    // 글자 외곽선 색상 변경
    const handleChangeTextStrokeColor = (color) => {
        setSetting({
            ...setting,
            "textStrokeColor": color
        })
    }

    // 글자 외곽선 굵기 변경
    const handleChangeTextStrokeSize = (size) => {
        setSetting({
            ...setting,
            "textStrokeSize": size
        })
    }

    // 배경 색상 변경
    const handleChangeBackgroundColor = (color) => {
        setSetting({
            ...setting,
            "backgroundColor": color
        });
    }

    // 글자 수평 정렬
    const handleClickTextHorizontalAlign = (align) => {
        setSetting({
            ...setting,
            "titleTextStyle": {
                ...setting.titleTextStyle,
                "textHorizontalAlign": align
            },
            "contentTextStyle": {
                ...setting.contentTextStyle,
                "textHorizontalAlign": align
            }
        });
    }

    // 글자 수직 정렬
    const handleClickTextVerticalAlign = (align) => {
        setSetting({
            ...setting,
            "titleTextStyle": {
                ...setting.titleTextStyle,
                "textVerticalAlign": align
            },
            "contentTextStyle": {
                ...setting.contentTextStyle,
                "textVerticalAlign": align
            }
        });
    }

    // 글자 그림자 여부
    const handleClickTextShadow = () => {
        setSetting({
            ...setting,
            "textShadow": !setting.textShadow
        });
    }

    // 이미지 파일 선택 핸들러
    const handleBackgroundImageChange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onloadend = () => {
            setSetting({
                ...setting,
                "backgroundImage": reader.result
            });
        };

        if (file) {
            reader.readAsDataURL(file);
        }
    };

    // 배경 이미지 투명도 조절
    const handleBackgroundImageOpacityChange = (opacity) => {
        setSetting({
            ...setting,
            "backgroundImageOpacity": opacity
        });
    }

    return (
        <>
            <h2 className="flex items-center">
                <img src="images/card_news.png" width="64px" height="64px" alt="카드뉴스 생성기" style={{ imageRendering: "pixelated" }} />
                카드뉴스 생성기
            </h2>
            <div className="wd-full m-2">
                <CardNewsMaker setting={setting} />
                <CardNewsBasicSetting
                    onChangeFont={(font) => { handleChangeFont(font) }}
                    onChangeTitleTextSize={(size) => { handleChangeTitleTextSize(size) }}
                    onChangeTitleTextColor={(color) => { handleChangeTitleTextColor(color) }}
                    onChangeTitleTextThickness={(thickness) => { handleChangeTitleTextThickness(thickness) }}
                    onChangeContentTextSize={(size) => { handleChangeContentTextSize(size) }}
                    onChangeContentTextColor={(color) => { handleChangeContentTextColor(color) }}
                    onChangeContentTextThickness={(thickness) => { handleChangeContentTextThickness(thickness) }}
                    onChangeTextStrokeColor={(color) => { handleChangeTextStrokeColor(color) }}
                    onChangeTextStrokeSize={(size) => { handleChangeTextStrokeSize(size) }}
                    onChangeBackgroundColor={(color) => { handleChangeBackgroundColor(color) }}
                    onClickTextHorizontalAlign={(align) => { handleClickTextHorizontalAlign(align) }}
                    onClickTextVerticalAlign={(align) => { handleClickTextVerticalAlign(align) }}
                    onClickTextShadow={(isShadow) => { handleClickTextShadow(isShadow) }}
                    onChangeBackgroundImage={(e) => { handleBackgroundImageChange(e) }}
                    onChangeBackgroundImageOpacity={(opacity) => { handleBackgroundImageOpacityChange(opacity) }}
                />
            </div>
        </>
    );
}

export default CardNewsPage;